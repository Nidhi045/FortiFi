import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from datetime import datetime
from typing import Dict, Optional, Tuple
import json
import hashlib
import warnings
warnings.filterwarnings("ignore", category=UserWarning)

class BehavioralDataset(Dataset):
    """Torch Dataset for behavioral pattern training"""
    def __init__(self, data_path: str, seq_length: int = 30):
        with open(data_path) as f:
            raw_data = json.load(f)
        
        self.samples = []
        self.labels = []
        self.user_hashes = []
        
        for user in raw_data['users']:
            user_hash = hashlib.sha256(user['id'].encode()).hexdigest()[:16]
            for i in range(len(user['transactions']) - seq_length):
                seq = user['transactions'][i:i+seq_length]
                features = self._extract_sequence_features(seq)
                label = 1 if user['labels'][i+seq_length] == 'fraud' else 0
                self.samples.append(features)
                self.labels.append(label)
                self.user_hashes.append(user_hash)
                
    def _extract_sequence_features(self, transactions: list) -> np.ndarray:
        """Convert 30-transaction window to 126D feature vector"""
        features = []
        for tx in transactions:
            features.extend([
                tx['amount'] / 10000.0,
                tx['location']['distance_from_home'],
                tx['device']['swipe_velocity'],
                tx['device']['tilt_angle'],
                tx['merchant_risk'],
                tx['time_since_last']
            ])
        return np.array(features, dtype=np.float32)
    
    def __len__(self):
        return len(self.samples)
    
    def __getitem__(self, idx):
        return (
            torch.tensor(self.samples[idx]), 
            torch.tensor(self.labels[idx], dtype=torch.float32),
            self.user_hashes[idx]
        )

class LSTMBehaviorProfiler(nn.Module):
    """3-layer LSTM network with attention mechanism"""
    def __init__(self, input_size=6, hidden_size=128, num_layers=3):
        super().__init__()
        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
            bidirectional=True
        )
        self.attention = nn.Sequential(
            nn.Linear(hidden_size*2, 64),
            nn.Tanh(),
            nn.Linear(64, 1)
        )
        self.classifier = nn.Sequential(
            nn.Linear(hidden_size*2, 64),
            nn.LayerNorm(64),
            nn.LeakyReLU(),
            nn.Linear(64, 1),
            nn.Sigmoid()
        )
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.to(self.device)
        
    def forward(self, x: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor]:
        batch_size, seq_len, _ = x.size()
        x, _ = self.lstm(x)
        attn_weights = torch.softmax(self.attention(x).squeeze(-1), dim=-1)
        context = torch.bmm(attn_weights.unsqueeze(1), x).squeeze(1)
        return self.classifier(context), attn_weights
    
    def calculate_trust_score(self, transaction_window: list) -> float:
        """Analyzes last 30 transactions for behavioral consistency"""
        features = self._preprocess_window(transaction_window)
        with torch.no_grad():
            output, _ = self.forward(features.unsqueeze(0).to(self.device))
            return output.item()
    
    def _preprocess_window(self, transactions: list) -> torch.Tensor:
        """Convert raw transaction list to model input tensor"""
        seq = []
        for tx in transactions[-30:]:  # Use last 30 transactions
            seq.append([
                tx['amount'] / 10000.0,
                tx['location']['distance_from_home'],
                tx['device']['swipe_velocity'],
                tx['device']['tilt_angle'],
                tx['merchant_risk'],
                tx['time_since_last']
            ])
        return torch.tensor(seq, dtype=torch.float32)
    
    def train_model(self, dataset: BehavioralDataset, epochs=100):
        """Full training pipeline with early stopping"""
        loader = DataLoader(dataset, batch_size=64, shuffle=True)
        criterion = nn.BCELoss()
        optimizer = optim.AdamW(self.parameters(), lr=1e-4)
        scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, 'min')
        
        best_loss = float('inf')
        for epoch in range(epochs):
            self.train()
            total_loss = 0.0
            for inputs, labels, _ in loader:
                inputs = inputs.view(-1, 30, 6).to(self.device)
                labels = labels.to(self.device)
                
                optimizer.zero_grad()
                outputs, _ = self.forward(inputs)
                loss = criterion(outputs.squeeze(), labels)
                loss.backward()
                nn.utils.clip_grad_norm_(self.parameters(), 5.0)
                optimizer.step()
                
                total_loss += loss.item()
            
            avg_loss = total_loss / len(loader)
            scheduler.step(avg_loss)
            
            if avg_loss < best_loss:
                best_loss = avg_loss
                torch.save(self.state_dict(), f"behavior_profiler_epoch{epoch}.pth")
            
            print(f"Epoch {epoch+1}/{epochs} | Loss: {avg_loss:.4f}")

class RealTimeProfiler:
    """Wrapper for production inference with caching"""
    def __init__(self, model_path: str):
        self.model = LSTMBehaviorProfiler().to(torch.device("cuda" if torch.cuda.is_available() else "cpu"))
        self.model.load_state_dict(torch.load(model_path, map_location=self.model.device))
        self.model.eval()
        self.cache = {}
        self.window_size = 30
        
    def process_transaction(self, user_id: str, transaction: Dict) -> float:
        """Main interface for transaction processing"""
        user_hash = hashlib.sha256(user_id.encode()).hexdigest()[:16]
        if user_hash not in self.cache:
            self.cache[user_hash] = []
        
        # Maintain rolling window of 30 transactions
        if len(self.cache[user_hash]) >= self.window_size:
            self.cache[user_hash].pop(0)
        self.cache[user_hash].append(transaction)
        
        # Convert to model input
        input_tensor = self.model._preprocess_window(self.cache[user_hash])
        with torch.no_grad():
            score, _ = self.model(input_tensor.unsqueeze(0).to(self.model.device))
        
        return score.item()

if __name__ == "__main__":
    # Full training example
    dataset = BehavioralDataset("behavior_dataset.json")
    model = LSTMBehaviorProfiler()
    model.train_model(dataset)
    
    # Production inference example
    profiler = RealTimeProfiler("behavior_profiler_epoch50.pth")
    sample_transactions = [...]  # Load 30+ transaction samples
    for tx in sample_transactions:
        score = profiler.process_transaction("user_123", tx)
        print(f"Trust score updated: {score:.4f}")
