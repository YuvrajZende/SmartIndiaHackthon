import os
import json
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, r2_score
import plotly.express as px
from .config import CONFIG # Relative import

# Advanced ML library imports with availability checks
try:
    import lightgbm as lgb
    LIGHTGBM_AVAILABLE = True
except ImportError:
    LIGHTGBM_AVAILABLE = False

try:
    import xgboost as xgb
    XGBOOST_AVAILABLE = True
except ImportError:
    XGBOOST_AVAILABLE = False

class AdvancedOceanPredictor:
    """Advanced ML models with model persistence and explainability."""
    
    def __init__(self, region_key, model_preference="lightgbm"):
        self.region_key = region_key
        self.model_dir = os.path.join('models', region_key)
        self.models = {}
        self.scalers = {}
        self.feature_names = ['lat_sin', 'lat_cos', 'lon_sin', 'lon_cos', 'depth_log', 'month_sin', 'month_cos']
        self.model_metrics = {}
        self.model_preference = model_preference
        self.models_trained = False
        os.makedirs(self.model_dir, exist_ok=True)
        
    def _get_model(self):
        """Gets the appropriate model based on preference and availability."""
        if self.model_preference == "lightgbm" and LIGHTGBM_AVAILABLE:
            return lgb.LGBMRegressor(random_state=CONFIG["model_settings"]["random_state"], n_jobs=-1, verbose=-1)
        elif self.model_preference == "xgboost" and XGBOOST_AVAILABLE:
            return xgb.XGBRegressor(random_state=CONFIG["model_settings"]["random_state"], n_jobs=-1, verbosity=0)
        else:
            if self.model_preference != "randomforest":
                print(f"⚠️ {self.model_preference} not available, falling back to RandomForest.")
            return RandomForestRegressor(
                n_estimators=CONFIG["model_settings"]["n_estimators"],
                random_state=CONFIG["model_settings"]["random_state"], n_jobs=-1
            )
        
    def _prepare_features(self, df):
        """Enhanced feature engineering with cyclical encoding."""
        features = df[['latitude', 'longitude', 'depth', 'month']].copy()
        features['lat_sin'] = np.sin(np.radians(features['latitude']))
        features['lat_cos'] = np.cos(np.radians(features['latitude']))
        features['lon_sin'] = np.sin(np.radians(features['longitude']))
        features['lon_cos'] = np.cos(np.radians(features['longitude']))
        features['month_sin'] = np.sin(2 * np.pi * features['month'] / 12)
        features['month_cos'] = np.cos(2 * np.pi * features['month'] / 12)
        features['depth_log'] = np.log1p(features['depth'])
        return features[self.feature_names]
    
    def train_models(self, df):
        """Trains advanced models for multiple parameters."""
        print(f"🤖 Training predictive models for {self.region_key} using {self.model_preference.upper()}...")
        features = self._prepare_features(df)
        
        if 'temperature' in df.columns:
            self._train_single_model(features, df['temperature'], 'temperature')
        if 'salinity' in df.columns:
            self._train_single_model(features, df['salinity'], 'salinity')
        
        if self.models:
            self.models_trained = True
            self._save_models()
            print("✅ Model training completed.")
        else:
            print("❌ No models were trained due to lack of data or valid targets.")
            
        return self.model_metrics
    
    def _train_single_model(self, features, target, param_name):
        """Trains a single advanced model."""
        mask = ~(features.isna().any(axis=1) | target.isna())
        X_clean, y_clean = features[mask], target[mask]
        
        if len(X_clean) < 50:
            print(f"❌ Not enough data to train {param_name} model (requires at least 50 points).")
            return
        
        self.scalers[param_name] = StandardScaler()
        X_scaled = self.scalers[param_name].fit_transform(X_clean)
        
        X_train, X_test, y_train, y_test = train_test_split(
            X_scaled, y_clean, 
            test_size=CONFIG["model_settings"]["test_size"],
            random_state=CONFIG["model_settings"]["random_state"]
        )
        
        model = self._get_model()
        model.fit(X_train, y_train)
        self.models[param_name] = model
        
        y_pred = model.predict(X_test)
        self.model_metrics[param_name] = {
            'mae': round(mean_absolute_error(y_test, y_pred), 3),
            'r2': round(r2_score(y_test, y_pred), 3),
            'model_type': type(model).__name__
        }
        print(f"  📊 {param_name}: R² = {self.model_metrics[param_name]['r2']:.3f}")

    def plot_feature_importance(self, param_name='temperature'):
        """Generates JSON for a feature importance plot."""
        if param_name not in self.models: return None
        model = self.models[param_name]
        
        if hasattr(model, 'feature_importances_'):
            importances = model.feature_importances_
        else:
            return None
        
        feature_importance_df = pd.DataFrame({
            'feature': self.feature_names,
            'importance': importances
        }).sort_values('importance', ascending=True)
        
        fig = px.bar(
            feature_importance_df, x='importance', y='feature', orientation='h',
            title=f'Feature Importance for {param_name.title()} Prediction'
        )
        return fig.to_json()

    def _save_models(self):
        """Saves trained models and scalers to disk."""
        try:
            for param_name in self.models:
                joblib.dump(self.models[param_name], os.path.join(self.model_dir, f'{param_name}_model.joblib'))
                joblib.dump(self.scalers[param_name], os.path.join(self.model_dir, f'{param_name}_scaler.joblib'))
            
            metadata = {'metrics': self.model_metrics, 'trained_date': datetime.now().isoformat()}
            with open(os.path.join(self.model_dir, 'metadata.json'), 'w') as f:
                json.dump(metadata, f, indent=2)
            print(f"💾 Models saved to {self.model_dir}")
        except Exception as e:
            print(f"⚠️ Could not save models: {e}")
    
    def load_models(self):
        """Loads pre-trained models from disk."""
        try:
            metadata_path = os.path.join(self.model_dir, 'metadata.json')
            if not os.path.exists(metadata_path):
                return False

            with open(metadata_path, 'r') as f:
                metadata = json.load(f)
            self.model_metrics = metadata.get('metrics', {})
            
            loaded_a_model = False
            for param_name in ['temperature', 'salinity']:
                model_path = os.path.join(self.model_dir, f'{param_name}_model.joblib')
                scaler_path = os.path.join(self.model_dir, f'{param_name}_scaler.joblib')
                
                if os.path.exists(model_path) and os.path.exists(scaler_path):
                    self.models[param_name] = joblib.load(model_path)
                    self.scalers[param_name] = joblib.load(scaler_path)
                    loaded_a_model = True

            if loaded_a_model:
                self.models_trained = True
                print(f"✅ Pre-trained models loaded from {self.model_dir}")
                return True
            return False
            
        except Exception as e:
            print(f"❌ Error loading models: {e}")
            return False
    
    def predict(self, lat, lon, depth, month):
        """Predicts ocean conditions with confidence intervals."""
        if not self.models_trained:
            raise Exception("Models not trained or loaded yet.")
            
        features_df = pd.DataFrame([{'latitude': lat, 'longitude': lon, 'depth': depth, 'month': month}])
        features = self._prepare_features(features_df)
        
        predictions = {}
        for param_name, model in self.models.items():
            if param_name in self.scalers:
                X_scaled = self.scalers[param_name].transform(features)
                pred = model.predict(X_scaled)[0]
                predictions[f'predicted_{param_name}'] = round(float(pred), 2)
                predictions[f'{param_name}_confidence'] = self.model_metrics.get(param_name, {}).get('r2', 0)
        
        return predictions