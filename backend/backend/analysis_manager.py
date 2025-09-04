# /backend/analysis_manager.py

import os
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from .config import CONFIG
from .data_fetcher import EnhancedArgoDataFetcher
from .predictor import AdvancedOceanPredictor
from .chatbot import OceanChatbot
from .assistants import FishingAdvisor, ResearchAssistant

class AnalysisManager:
    """Manages the complete analysis pipeline for a specific region."""

    def __init__(self, region_key):
        if region_key not in CONFIG["regions"]:
            raise ValueError(f"Region '{region_key}' not found in configuration.")
        
        self.region_key = region_key
        region_config = CONFIG["regions"][region_key]
        self.region_name = region_config["name"]
        self.region_bounds = region_config["bounds"]
        
        self.df = pd.DataFrame()
        self.summary = {}
        self.data_fetcher = EnhancedArgoDataFetcher()
        self.predictor = AdvancedOceanPredictor(
            region_key, CONFIG["model_settings"]["model_preference"]
        )
        self.chatbot = None
        self.fishing_advisor = None
        self.research_assistant = None

    def run_complete_analysis(self):
        """Runs the full pipeline: fetch, process, and train models."""
        print(f"🌊 Starting analysis for {self.region_name}...")
        
        # 1. Load existing models if available
        if self.predictor.load_models():
            print("Using pre-trained models. Fetching latest data for context...")
        
        # 2. Fetch and process data
        if not self._fetch_and_process_data():
            return False

        # 3. If models weren't loaded, train them
        if not self.predictor.models_trained:
            self.predictor.train_models(self.df)

        # 4. Initialize assistants and chatbot
        self._initialize_assistants()
        
        print(f"✅ Analysis pipeline completed for {self.region_name}.")
        return True

    def _fetch_and_process_data(self):
        """Fetches and processes ARGO data."""
        raw_df = self.data_fetcher.fetch_data_with_fallback(
            self.region_bounds, 
            years=CONFIG["data_settings"]["years_to_fetch"],
            months=CONFIG["data_settings"]["months"]
        )
        if raw_df.empty:
            print("❌ No data could be fetched for analysis.")
            return False
        
        # Standardize and clean data
        df = raw_df.copy()
        column_map = {'PLATFORM_NUMBER': 'float_id', 'CYCLE_NUMBER': 'cycle_number', 
                      'TIME': 'date', 'LATITUDE': 'latitude', 'LONGITUDE': 'longitude', 
                      'PRES': 'depth', 'TEMP': 'temperature', 'PSAL': 'salinity'}
        df = df.rename(columns=column_map)
        df = df[list(column_map.values())].dropna(subset=['latitude', 'longitude', 'depth', 'temperature', 'salinity'])
        
        df['date'] = pd.to_datetime(df['date'])
        df['month'] = df['date'].dt.month
        df['year'] = df['date'].dt.year
        df['profile_id'] = df['float_id'].astype(str) + '_' + df['cycle_number'].astype(str)
        self.df = df
        
        self._create_summary()
        return True

    def _create_summary(self):
        """Creates a summary dictionary from the processed data."""
        if self.df.empty: return
        surface_df = self.df[self.df['depth'] <= 10]
        self.summary = {
            'region': self.region_name,
            'num_profiles': self.df['profile_id'].nunique(),
            'num_floats': self.df['float_id'].nunique(),
            'date_range': f"{self.df['date'].min().strftime('%Y-%m-%d')} to {self.df['date'].max().strftime('%Y-%m-%d')}",
            'avg_surface_temp_C': f"{surface_df['temperature'].mean():.2f}" if not surface_df.empty else 'N/A',
            'avg_surface_salinity_PSU': f"{surface_df['salinity'].mean():.2f}" if not surface_df.empty else 'N/A',
            'deepest_point_m': f"{self.df['depth'].max():.0f}"
        }

    def _initialize_assistants(self):
        """Initializes chatbot and other assistant tools."""
        if self.predictor.models_trained:
            self.fishing_advisor = FishingAdvisor(self.predictor)
        self.research_assistant = ResearchAssistant(self.df)
        
        if os.environ.get('GEMINI_API_KEY'):
            try:
                self.chatbot = OceanChatbot(predictor=self.predictor, data_summary=self.summary)
                print("✅ Chatbot initialized.")
            except Exception as e:
                print(f"⚠️ Could not initialize chatbot: {e}")
        else:
            print("Chatbot skipped (no API key).")

    def get_summary(self):
        return self.summary

    def get_model_metrics(self):
        return self.predictor.model_metrics

    def create_visualization(self, plot_type):
        """Creates a specific interactive visualization and returns its JSON."""
        if self.df.empty: return None
        
        # Sample data for performance
        viz_sample_size = CONFIG["data_settings"]["sample_size_for_viz"]
        df_sample = self.df.sample(n=min(viz_sample_size, len(self.df)), random_state=42)

        try:
            if plot_type == 'geographic_map':
                fig = px.scatter_mapbox(
                    df_sample, lat="latitude", lon="longitude", color="temperature", size="depth",
                    mapbox_style=CONFIG["visualization_settings"]["mapbox_style"], zoom=3,
                    title=f"ARGO Float Distribution - {self.region_name}",
                    color_continuous_scale=px.colors.sequential.Viridis,
                    hover_name="profile_id", hover_data={"salinity": ":.2f", "date": "|%Y-%m-%d"}
                )
                fig.update_layout(margin={"r":0,"t":40,"l":0,"b":0})

            elif plot_type == 'depth_profile':
                sample_profiles = df_sample['profile_id'].unique()[:10]
                fig = go.Figure()
                for pid in sample_profiles:
                    profile_data = self.df[self.df['profile_id'] == pid].sort_values('depth')
                    if len(profile_data) > 3:
                        fig.add_trace(go.Scatter(x=profile_data['temperature'], y=profile_data['depth'], mode='lines', name=pid))
                fig.update_layout(title='Temperature Depth Profiles', xaxis_title='Temperature (°C)', yaxis_title='Depth (m)', yaxis=dict(autorange='reversed'))
            
            elif plot_type == 'time_series':
                surface_data = self.df[self.df['depth'] <= 10].groupby(pd.Grouper(key='date', freq='D')).mean().reset_index()
                fig = make_subplots(specs=[[{"secondary_y": True}]])
                fig.add_trace(go.Scatter(x=surface_data['date'], y=surface_data['temperature'], name='Temperature (°C)'), secondary_y=False)
                fig.add_trace(go.Scatter(x=surface_data['date'], y=surface_data['salinity'], name='Salinity (PSU)'), secondary_y=True)
                fig.update_layout(title='Surface Conditions Time Series')

            elif plot_type == 'scatter_3d':
                fig = px.scatter_3d(
                    df_sample, x='longitude', y='latitude', z='depth', color='temperature',
                    title='3D Ocean Data Visualization',
                    labels={'depth': 'Depth (m)', 'temperature': 'Temp (°C)'}
                )
                fig.update_layout(scene=dict(zaxis=dict(autorange='reversed')))
            
            else:
                return None
            
            return fig.to_json()
        except Exception as e:
            print(f"Error creating visualization '{plot_type}': {e}")
            return None