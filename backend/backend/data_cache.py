# /backend/data_cache.py

import os
import json
import pickle
import pandas as pd
from datetime import datetime, timedelta
from pathlib import Path
from .config import CONFIG

class DataCache:
    """Enhanced data caching system for processed ocean data."""
    
    def __init__(self, region_key):
        self.region_key = region_key
        self.cache_dir = Path('data_cache') / region_key
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        
        # Cache file paths
        self.data_cache_path = self.cache_dir / 'processed_data.pkl'
        self.metadata_path = self.cache_dir / 'metadata.json'
        self.summary_path = self.cache_dir / 'summary.json'
        
        # Cache expiry (in days)
        self.cache_expiry_days = 7
    
    def is_cache_valid(self) -> bool:
        """Check if cached data exists and is not expired."""
        if not (self.data_cache_path.exists() and self.metadata_path.exists()):
            return False
        
        try:
            with open(self.metadata_path, 'r') as f:
                metadata = json.load(f)
            
            cached_time = datetime.fromisoformat(metadata['cached_at'])
            expiry_time = cached_time + timedelta(days=self.cache_expiry_days)
            
            return datetime.now() < expiry_time
        except (json.JSONDecodeError, KeyError, ValueError):
            return False
    
    def save_data(self, df: pd.DataFrame, summary: dict):
        """Save processed data and summary to cache."""
        try:
            # Save DataFrame
            df.to_pickle(self.data_cache_path)
            
            # Save summary
            with open(self.summary_path, 'w') as f:
                json.dump(summary, f, indent=2)
            
            # Save metadata
            metadata = {
                'cached_at': datetime.now().isoformat(),
                'region_key': self.region_key,
                'data_points': len(df),
                'date_range': {
                    'start': df['date'].min().isoformat() if not df.empty and 'date' in df.columns else None,
                    'end': df['date'].max().isoformat() if not df.empty and 'date' in df.columns else None
                }
            }
            
            with open(self.metadata_path, 'w') as f:
                json.dump(metadata, f, indent=2)
            
            print(f"💾 Data cached for {self.region_key} ({len(df)} records)")
            return True
            
        except Exception as e:
            print(f"⚠️ Failed to cache data: {e}")
            return False
    
    def load_data(self) -> tuple[pd.DataFrame, dict]:
        """Load processed data and summary from cache."""
        try:
            if not self.is_cache_valid():
                return pd.DataFrame(), {}
            
            # Load DataFrame
            df = pd.read_pickle(self.data_cache_path)
            
            # Load summary
            summary = {}
            if self.summary_path.exists():
                with open(self.summary_path, 'r') as f:
                    summary = json.load(f)
            
            print(f"📂 Loaded cached data for {self.region_key} ({len(df)} records)")
            return df, summary
            
        except Exception as e:
            print(f"⚠️ Failed to load cached data: {e}")
            return pd.DataFrame(), {}
    
    def clear_cache(self):
        """Clear all cached data for this region."""
        try:
            for file_path in [self.data_cache_path, self.metadata_path, self.summary_path]:
                if file_path.exists():
                    file_path.unlink()
            print(f"🗑️ Cache cleared for {self.region_key}")
        except Exception as e:
            print(f"⚠️ Failed to clear cache: {e}")
    
    def get_cache_info(self) -> dict:
        """Get information about cached data."""
        if not self.metadata_path.exists():
            return {'cached': False}
        
        try:
            with open(self.metadata_path, 'r') as f:
                metadata = json.load(f)
            
            return {
                'cached': True,
                'valid': self.is_cache_valid(),
                'cached_at': metadata.get('cached_at'),
                'data_points': metadata.get('data_points', 0),
                'date_range': metadata.get('date_range', {})
            }
        except:
            return {'cached': False}
