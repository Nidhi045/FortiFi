import numpy as np
import tensorflow as tf
from tensorflow.keras.layers import Dense, LayerNormalization, Input
from tensorflow.keras.models import Model

class PatternAbstractor:
    def __init__(self, input_dim=64, latent_dim=16):
        self.input_dim = input_dim
        self.latent_dim = latent_dim
        self.encoder = self._build_encoder()
        self.model = Model(self.encoder.input, self.encoder.output)
        self.model.compile(optimizer='adam', loss='mse')

    def _build_encoder(self):
        inp = Input(shape=(self.input_dim,))
        x = Dense(128, activation='relu')(inp)
        x = LayerNormalization()(x)
        x = Dense(64, activation='relu')(x)
        x = LayerNormalization()(x)
        x = Dense(self.latent_dim, activation='linear')(x)
        return Model(inp, x)

    def abstract_pattern(self, transaction: dict) -> np.ndarray:
        features = self._vectorize(transaction)
        embedding = self.model.predict(features, verbose=0)
        return embedding[0]

    def _vectorize(self, tx: dict) -> np.ndarray:
        v = np.zeros(self.input_dim)
        v[0] = tx.get('amount', 0) / 10000.0
        v[1] = tx.get('velocity', 0.0)
        v[2] = tx.get('geo_risk', 0.0)
        v[3] = tx.get('device_score', 0.0)
        v[4] = tx.get('behavior_score', 0.0)
        v[5] = int(tx.get('high_risk_merchant', False))
        v[6] = tx.get('ip_reputation', 0.5)
        # ... fill up to input_dim as needed
        return v.reshape(1, -1)

    def train_on_patterns(self, transactions: list):
        X = np.array([self._vectorize(tx)[0] for tx in transactions])
        self.model.fit(X, X, epochs=20, batch_size=32)

if __name__ == "__main__":
    abstractor = PatternAbstractor()
    tx = {
        'amount': 2000.0,
        'velocity': 1.2,
        'geo_risk': 0.8,
        'device_score': 0.25,
        'behavior_score': 0.7,
        'high_risk_merchant': True,
        'ip_reputation': 0.1
    }
    emb = abstractor.abstract_pattern(tx)
    print("Pattern embedding:", emb)
