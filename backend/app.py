# app.py - FastAPI Ocean Data Analysis API

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from backend.analysis_manager import AnalysisManager
from backend.config import CONFIG
import traceback

# Import API key configuration
try:
    from config_keys import GEMINI_API_KEY
    os.environ['GEMINI_API_KEY'] = GEMINI_API_KEY
    print("✅ GEMINI_API_KEY loaded from config_keys.py")
    print(f"🔑 API Key: {GEMINI_API_KEY[:20]}...")
except ImportError as e:
    print(f"⚠️  config_keys.py not found: {e}")
    print("Using environment variable if available")

# --- FastAPI App Initialization ---
app = FastAPI(
    title="Ocean LLM API",
    description="Ocean Data Analysis and Chatbot API using ARGO float data",
    version="1.0.0"
)

# --- CORS Configuration for Frontend Integration ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- In-memory Session Management ---
analysis_sessions = {}

# --- Pydantic Models ---
class ChatRequest(BaseModel):
    message: str
    region_key: Optional[str] = "arabian_sea"

class AnalysisRequest(BaseModel):
    region_key: str

class PredictionRequest(BaseModel):
    region_key: str
    lat: float
    lon: float
    depth: int
    month: int

class FishingAdviceRequest(BaseModel):
    region_key: str
    lat: float
    lon: float
    month: int

# --- Helper Functions ---
def get_analysis_manager(region_key: str):
    """
    Retrieves or creates an analysis manager for a given region.
    This helps in caching the trained models and data for a session.
    """
    if region_key not in analysis_sessions:
        print(f"Creating new analysis manager for {region_key}")
        analysis_sessions[region_key] = AnalysisManager(region_key)
    return analysis_sessions[region_key]

# --- API Routes ---

@app.get("/")
async def root():
    """Root endpoint with API information."""
    available_regions = {key: details["name"] for key, details in CONFIG["regions"].items()}
    return {
        "message": "Ocean LLM API is running!",
        "available_regions": available_regions,
        "endpoints": {
            "chat": "/api/chat",
            "analyze": "/api/analyze", 
            "predict": "/api/predict",
            "fishing_advice": "/api/fishing_advice"
        }
    }

@app.get("/api/regions")
async def get_regions():
    """Get available ocean regions for analysis."""
    available_regions = {key: details["name"] for key, details in CONFIG["regions"].items()}
    return {"regions": available_regions}

@app.post("/api/load_models")
async def load_models(request: AnalysisRequest):
    """Load and cache models for a specific region."""
    try:
        if request.region_key not in CONFIG["regions"]:
            raise HTTPException(status_code=400, detail="Invalid region key")

        manager = get_analysis_manager(request.region_key)
        
        # Check if models are already loaded
        if manager.predictor.models_trained:
            return {
                "status": "already_loaded",
                "message": f"Models for {manager.region_name} are already loaded and ready",
                "region": manager.region_name
            }
        
        # Load models by running analysis
        success = manager.run_complete_analysis()
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to load models for the selected region")

        return {
            "status": "loaded",
            "message": f"Models for {manager.region_name} have been successfully loaded",
            "region": manager.region_name,
            "summary": manager.get_summary(),
            "model_metrics": manager.get_model_metrics()
        }

    except Exception as e:
        print(f"Model loading error: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/model_status")
async def get_model_status():
    """Get the loading status of all region models."""
    status = {}
    for region_key, region_config in CONFIG["regions"].items():
        if region_key in analysis_sessions:
            manager = analysis_sessions[region_key]
            status[region_key] = {
                "name": region_config["name"],
                "loaded": manager.predictor.models_trained,
                "summary": manager.get_summary() if manager.predictor.models_trained else None
            }
        else:
            status[region_key] = {
                "name": region_config["name"],
                "loaded": False,
                "summary": None
            }
    return {"model_status": status}

@app.post("/api/chat")
async def chat_with_bot(request: ChatRequest):
    """Endpoint to interact with the AI chatbot."""
    try:
        manager = get_analysis_manager(request.region_key)
        
        # Initialize analysis if not done yet
        if not manager.chatbot:
            print("Initializing analysis for chatbot...")
            success = manager.run_complete_analysis()
            if not success:
                raise HTTPException(status_code=500, detail="Failed to initialize ocean data analysis")

        if not manager.chatbot:
            raise HTTPException(status_code=400, detail="Chatbot not initialized. Ensure GEMINI_API_KEY is set.")

        bot_response = manager.chatbot.chat(request.message)
        return {"response": bot_response, "region": manager.region_name}

    except Exception as e:
        print(f"Chat error: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze")
async def analyze_region(request: AnalysisRequest):
    """
    Endpoint to fetch data, train models, and create initial visualizations.
    This is the main long-running task.
    """
    try:
        if request.region_key not in CONFIG["regions"]:
            raise HTTPException(status_code=400, detail="Invalid region key")

        manager = get_analysis_manager(request.region_key)
        
        # Run the complete analysis (fetches data, trains models)
        success = manager.run_complete_analysis()

        if not success:
            raise HTTPException(status_code=500, detail="Failed to fetch or process data for the selected region")

        # Prepare response data
        response_data = {
            "summary": manager.get_summary(),
            "model_metrics": manager.get_model_metrics(),
            "visualizations": {
                "geo_map": manager.create_visualization('geographic_map'),
                "depth_profile": manager.create_visualization('depth_profile'),
                "time_series": manager.create_visualization('time_series'),
                "scatter_3d": manager.create_visualization('scatter_3d')
            }
        }
        return response_data

    except Exception as e:
        print(f"Analysis error: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/visualizations")
async def get_visualizations(request: AnalysisRequest):
    """
    Endpoint to get visualizations for already loaded models.
    This does NOT retrain models - only creates visualizations from cached data.
    """
    try:
        if request.region_key not in CONFIG["regions"]:
            raise HTTPException(status_code=400, detail="Invalid region key")

        manager = get_analysis_manager(request.region_key)
        
        # Check if models are loaded
        if not manager.predictor.models_trained:
            raise HTTPException(status_code=400, detail="Models for this region are not loaded yet. Please load models first.")

        # Check if we have data
        if manager.df.empty:
            raise HTTPException(status_code=400, detail="No data available for this region. Please load models first.")

        # Create visualizations from existing data
        response_data = {
            "summary": manager.get_summary(),
            "model_metrics": manager.get_model_metrics(),
            "visualizations": {
                "geo_map": manager.create_visualization('geographic_map'),
                "depth_profile": manager.create_visualization('depth_profile'),
                "time_series": manager.create_visualization('time_series'),
                "scatter_3d": manager.create_visualization('scatter_3d')
            }
        }
        return response_data

    except Exception as e:
        print(f"Visualization error: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/predict")
async def predict_conditions(request: PredictionRequest):
    """Endpoint to get predictions for a specific point."""
    try:
        manager = get_analysis_manager(request.region_key)

        if not manager.predictor.models_trained:
            raise HTTPException(status_code=400, detail="Models for this region are not trained yet. Please run analysis first.")

        predictions = manager.predictor.predict(request.lat, request.lon, request.depth, request.month)
        return predictions

    except Exception as e:
        print(f"Prediction error: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/fishing_advice")
async def get_fishing_advice(request: FishingAdviceRequest):
    """Endpoint for the Fishing Advisor."""
    try:
        manager = get_analysis_manager(request.region_key)

        if not manager.fishing_advisor:
            raise HTTPException(status_code=400, detail="Fishing advisor not available. Please run analysis first.")
        
        advice = manager.fishing_advisor.get_fishing_advice(request.lat, request.lon, request.month)
        return {"advice": advice}
        
    except Exception as e:
        print(f"Fishing advice error: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

# --- Health Check ---
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "api_key_set": bool(os.environ.get('GEMINI_API_KEY'))}

# --- Main Application Runner ---
if __name__ == '__main__':
    import uvicorn
    
    # Set the GEMINI_API_KEY from an environment variable for security
    if not os.environ.get('GEMINI_API_KEY'):
        print("⚠️  WARNING: GEMINI_API_KEY environment variable not set. Chatbot will not function.")
    
    print("🌊 Starting Ocean LLM FastAPI server...")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)