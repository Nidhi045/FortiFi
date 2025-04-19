import os
import boto3
import pymongo
import psycopg2
from psycopg2.extras import execute_values
from typing import Dict, Any, List, Optional
from utils.config import get_storage_config
from utils.logger import StructuredLogger

class StorageRouter:
    def __init__(self):
        config = get_storage_config()
        self.logger = StructuredLogger(name="StorageRouter")
        self.pg_conn = self._init_postgres(config['postgres'])
        self.mongo_db = self._init_mongodb(config['mongodb'])
        self.s3 = self._init_s3(config['s3'])

    def _init_postgres(self, pg_config: Dict[str, Any]):
        try:
            conn = psycopg2.connect(
                host=pg_config['host'],
                user=pg_config['user'],
                password=pg_config['password'],
                dbname=pg_config['database']
            )
            self.logger.info("Connected to PostgreSQL")
            return conn
        except Exception as e:
            self.logger.error(f"Failed to connect to PostgreSQL: {e}")
            raise

    def _init_mongodb(self, mongo_config: Dict[str, Any]):
        try:
            client = pymongo.MongoClient(
                host=mongo_config['host'],
                username=mongo_config['username'],
                password=mongo_config['password'],
                authSource=mongo_config.get('authSource', 'admin')
            )
            db = client.get_database()
            self.logger.info("Connected to MongoDB")
            return db
        except Exception as e:
            self.logger.error(f"Failed to connect to MongoDB: {e}")
            raise

    def _init_s3(self, s3_config: Dict[str, Any]):
        try:
            s3 = boto3.client(
                's3',
                aws_access_key_id=s3_config['aws_access_key_id'],
                aws_secret_access_key=s3_config['aws_secret_access_key'],
                region_name=s3_config.get('region_name', 'ap-south-1')
            )
            self.logger.info("Connected to S3")
            return s3
        except Exception as e:
            self.logger.error(f"Failed to connect to S3: {e}")
            raise

    def store_shard(self, shard_id: str, data: bytes, storage_type: str):
        try:
            if storage_type == 'postgres':
                self._pg_store(shard_id, data)
            elif storage_type == 'mongodb':
                self._mongo_store(shard_id, data)
            elif storage_type == 's3':
                self._s3_store(shard_id, data)
            else:
                raise ValueError(f"Unknown storage type: {storage_type}")
            self.logger.info(f"Stored shard {shard_id} in {storage_type}")
        except Exception as e:
            self.logger.error(f"Storage failed for {shard_id} in {storage_type}: {e}")
            raise

    def _pg_store(self, shard_id: str, data: bytes):
        with self.pg_conn.cursor() as cur:
            cur.execute("""
                INSERT INTO data_shards (shard_id, data, created_at)
                VALUES (%s, %s, NOW())
                ON CONFLICT (shard_id) DO UPDATE SET data = EXCLUDED.data, created_at = NOW()
            """, (shard_id, data))
            self.pg_conn.commit()

    def _mongo_store(self, shard_id: str, data: bytes):
        coll = self.mongo_db.shards
        coll.replace_one(
            {'_id': shard_id},
            {'_id': shard_id, 'data': data, 'created_at': pymongo.datetime.datetime.utcnow()},
            upsert=True
        )

    def _s3_store(self, shard_id: str, data: bytes):
        bucket = os.getenv('S3_BUCKET', 'fortifi-shards')
        self.s3.put_object(
            Bucket=bucket,
            Key=shard_id,
            Body=data,
            Metadata={'shard_id': shard_id}
        )

    def retrieve_shard(self, shard_id: str, storage_type: str) -> Optional[bytes]:
        try:
            if storage_type == 'postgres':
                return self._pg_retrieve(shard_id)
            elif storage_type == 'mongodb':
                return self._mongo_retrieve(shard_id)
            elif storage_type == 's3':
                return self._s3_retrieve(shard_id)
            else:
                raise ValueError(f"Unknown storage type: {storage_type}")
        except Exception as e:
            self.logger.error(f"Retrieval failed for {shard_id} in {storage_type}: {e}")
            return None

    def _pg_retrieve(self, shard_id: str) -> Optional[bytes]:
        with self.pg_conn.cursor() as cur:
            cur.execute("SELECT data FROM data_shards WHERE shard_id = %s", (shard_id,))
            row = cur.fetchone()
            return row[0] if row else None

    def _mongo_retrieve(self, shard_id: str) -> Optional[bytes]:
        coll = self.mongo_db.shards
        doc = coll.find_one({'_id': shard_id})
        return doc['data'] if doc else None

    def _s3_retrieve(self, shard_id: str) -> Optional[bytes]:
        bucket = os.getenv('S3_BUCKET', 'fortifi-shards')
        try:
            obj = self.s3.get_object(Bucket=bucket, Key=shard_id)
            return obj['Body'].read()
        except Exception:
            return None

if __name__ == "__main__":
    router = StorageRouter()
    router.store_shard("test_shard_001", b"test_data", "mongodb")
    data = router.retrieve_shard("test_shard_001", "mongodb")
    print("Retrieved data:", data)
#     router.store_shard("test_shard_001", b"test_data", "postgres")    