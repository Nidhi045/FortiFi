"""
AI Model for Detecting Phantom Transaction Triggers
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib
import hashlib
from faker import Faker

class PhantomTransactionModel:
    def __init__(self, config):
        self.config = config
        self.faker = Faker()
        self.model = IsolationForest(n_estimators=150, contamination=0.01, random_state=42)
        self.preprocessor = self._build_preprocessor()
        
    def _build_preprocessor(self):
        numeric_features = ['Amount']
        numeric_transformer = Pipeline(steps=[
            ('scaler', StandardScaler())
        ])

        categorical_features = ['Merchant_Category', 'Device_ID']
        categorical_transformer = Pipeline(steps=[
            ('onehot', OneHotEncoder(handle_unknown='ignore'))
        ])

        return ColumnTransformer(
            transformers=[
                ('num', numeric_transformer, numeric_features),
                ('cat', categorical_transformer, categorical_features)
            ])

    def generate_synthetic_data(self, sample_size=10000):
        """Generates AI-powered phantom transactions dataset"""
        data = []
        for _ in range(sample_size):
            record = {
                'User_ID': hashlib.sha256(self.faker.uuid4().encode()).hexdigest()[:16],
                'Transaction_ID': f"TX_{self.faker.uuid4()}",
                'Timestamp': self.faker.date_time_between(start_date='-1y', end_date='now'),
                'Amount': np.random.lognormal(mean=4, sigma=1.2),
                'Merchant_Category': np.random.choice(['Retail', 'Travel', 'Utilities', 'Pharmacy']),
                'Device_ID': f"DEV_{np.random.randint(1000,9999)}",
                'Location': self.faker.country_code(),
                'AI_Generated_Fake_Transaction_Label': np.random.choice([0, 1], p=[0.97, 0.03])
            }
            data.append(record)
        return pd.DataFrame(data)

    def train(self, df):
        """Trains anomaly detection model on phantom transaction patterns"""
        X = df.drop(['User_ID', 'Transaction_ID', 'Timestamp', 'AI_Generated_Fake_Transaction_Label'], axis=1)
        y = df['AI_Generated_Fake_Transaction_Label']
        
        X_processed = self.preprocessor.fit_transform(X)
        self.model.fit(X_processed)
        
        # Evaluate
        predictions = self.model.predict(X_processed)
        print(f"Anomaly detection model trained. {sum(predictions == -1)} anomalies detected.")

    def predict(self, new_data):
        """Detects phantom transaction triggers in real-time"""
        processed_data = self.preprocessor.transform(new_data)
        return self.model.decision_function(processed_data)

    def save_model(self, path):
        """Saves trained model and preprocessor"""
        joblib.dump({'model': self.model, 'preprocessor': self.preprocessor}, path)

    def load_model(self, path):
        """Loads pre-trained model"""
        artifacts = joblib.load(path)
        self.model = artifacts['model']
        self.preprocessor = artifacts['preprocessor']

    def explain_anomaly(self, transaction):
        """Provides SHAP-style explanation for fraud predictions"""
        processed = self.preprocessor.transform(pd.DataFrame([transaction]))
        return {
            'score': self.model.decision_function(processed)[0],
            'features': self.preprocessor.get_feature_names_out(),
            'values': processed.toarray().tolist()[0]
        }

# Example usage
if __name__ == "__main__":
    config = {'model_path': './models/phantom_detector.joblib'}
    model = PhantomTransactionModel(config)
    
    # Generate and train
    df = model.generate_synthetic_data()
    model.train(df)
    
    # Test prediction
    sample_tx = {
        'Amount': 450.0,
        'Merchant_Category': 'Travel',
        'Device_ID': 'DEV_4512',
        'Location': 'US'
    }
    print("Anomaly score:", model.predict(pd.DataFrame([sample_tx])))
    print("Explanation:", model.explain_anomaly(sample_tx))
