"""
FortiFi Graph-Based Fraud Mapping Engine
Discovers fraud rings, synthetic identities, and anomalous transaction patterns using advanced graph analytics.
"""

import networkx as nx
from datetime import datetime, timedelta
from typing import Dict, Any, List, Set

class FraudGraphAnalyzer:
    def __init__(self, neo4j_uri: str, redis):
        self.neo4j_uri = neo4j_uri
        self.redis = redis
        self.G = nx.MultiDiGraph()  # Directed multigraph for rich relationship modeling

    async def build_transaction_graph(self, transactions: List[Dict[str, Any]]):
        """
        Builds or updates the in-memory transaction graph from transaction data.
        """
        for tx in transactions:
            user = tx["user_id"]
            tx_id = tx["tx_id"]
            amount = tx.get("amount", 0)
            merchant = tx.get("merchant", "Unknown")
            timestamp = tx.get("timestamp", datetime.utcnow().isoformat())

            # Add user and transaction nodes
            self.G.add_node(user, type="user")
            self.G.add_node(tx_id, type="transaction", amount=amount, merchant=merchant, timestamp=timestamp)

            # Add edge: user -> transaction
            self.G.add_edge(user, tx_id, relation="initiated", timestamp=timestamp)

            # Add merchant node and edge
            self.G.add_node(merchant, type="merchant")
            self.G.add_edge(tx_id, merchant, relation="to_merchant", amount=amount)

            # Optionally: add device/IP nodes for advanced mapping
            if "device_fingerprint" in tx:
                device = tx["device_fingerprint"]
                self.G.add_node(device, type="device")
                self.G.add_edge(user, device, relation="used_device")
            if "ip" in tx:
                ip = tx["ip"]
                self.G.add_node(ip, type="ip")
                self.G.add_edge(user, ip, relation="used_ip")

    async def detect_fraud_rings(self, min_ring_size: int = 3) -> List[Set[str]]:
        """
        Identifies fraud rings as tightly connected user clusters with shared devices, IPs, or merchants.
        """
        # Project user-device or user-ip bipartite graph for ring detection
        user_nodes = [n for n, d in self.G.nodes(data=True) if d.get("type") == "user"]
        device_nodes = [n for n, d in self.G.nodes(data=True) if d.get("type") == "device"]
        ip_nodes = [n for n, d in self.G.nodes(data=True) if d.get("type") == "ip"]

        # Find user clusters sharing devices or IPs
        fraud_rings = []
        for device in device_nodes:
            users = [u for u in self.G.predecessors(device) if self.G.nodes[u].get("type") == "user"]
            if len(users) >= min_ring_size:
                fraud_rings.append(set(users))
        for ip in ip_nodes:
            users = [u for u in self.G.predecessors(ip) if self.G.nodes[u].get("type") == "user"]
            if len(users) >= min_ring_size:
                fraud_rings.append(set(users))

        # Remove duplicates
        unique_rings = []
        seen = set()
        for ring in fraud_rings:
            ring_tuple = tuple(sorted(ring))
            if ring_tuple not in seen:
                unique_rings.append(ring)
                seen.add(ring_tuple)
        return unique_rings

    async def detect_synthetic_identities(self, min_tx: int = 5) -> List[str]:
        """
        Flags user nodes with unusually high connectivity or transactional diversity (synthetic IDs).
        """
        synthetic_users = []
        for node, data in self.G.nodes(data=True):
            if data.get("type") == "user":
                out_edges = list(self.G.out_edges(node, data=True))
                if len(out_edges) >= min_tx:
                    merchants = set()
                    for _, tx, edge_data in out_edges:
                        if self.G.nodes[tx].get("type") == "transaction":
                            merchant = self.G.nodes[tx].get("merchant")
                            if merchant:
                                merchants.add(merchant)
                    if len(merchants) > 3:  # Arbitrary diversity threshold
                        synthetic_users.append(node)
        return synthetic_users

    async def flag_fraud_patterns(self):
        """
        Runs full graph analytics and flags detected rings and synthetic identities in the DB/cache.
        """
        # Assume transactions are preloaded
        fraud_rings = await self.detect_fraud_rings()
        synthetic_ids = await self.detect_synthetic_identities()

        # Flag in Redis for fast lookup (could also update DB)
        for ring in fraud_rings:
            ring_id = "ring_" + "_".join(sorted(ring))
            await self.redis.set(f"fraud_ring:{ring_id}", list(ring), expire=86400)
        for user in synthetic_ids:
            await self.redis.set(f"synthetic_id:{user}", True, expire=86400)

        # Optionally: log or export for audit
        print(f"Detected fraud rings: {fraud_rings}")
        print(f"Detected synthetic identities: {synthetic_ids}")

    async def analyze_and_flag_rings(self):
        """
        Main entrypoint: fetches transactions, builds graph, and flags fraud rings and synthetic IDs.
        """
        # Fetch recent transactions (simulate or from DB)
        from data.simulated_db import SimulatedDB
        db = SimulatedDB()
        transactions = await db.get_all_transactions()
        await self.build_transaction_graph(transactions)
        await self.flag_fraud_patterns()

    async def export_graphml(self, filename: str = "fraud_graph.graphml"):
        """
        Exports the current graph to GraphML for external analysis or visualization.
        """
        nx.write_graphml(self.G, filename)
        print(f"Graph exported to {filename}")

# Example usage for testing/demo
if __name__ == "__main__":
    import asyncio

    async def main():
        analyzer = FraudGraphAnalyzer("bolt://localhost:7687", redis=None)
        await analyzer.analyze_and_flag_rings()
        await analyzer.export_graphml()

    asyncio.run(main())
