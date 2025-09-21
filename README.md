# Ocean LLM - AI-Powered Ocean Data Analysis Platform 🌊

A comprehensive ocean data analysis platform that combines ARGO float data with AI-powered insights for marine research, fishing optimization, and environmental monitoring.

## 🚀 Quick Start

### Manual Setup

If you prefer manual setup:

#### Backend Setup
```bash
# Create virtual environment
python -m venv backend_venv

# Install dependencies
cd backend
pip install -r requirements.txt
```

#### Frontend Setup
```bash
cd frontend
npm install
```


## 🏃‍♂️ Running the Application

### Option 1: Automated Scripts
- **Windows**: Double-click `start_development.bat` 
- **Linux/Mac**: Run `./start_development.sh`

### Option 2: Manual Start
Terminal 1 (Backend):
```bash
backend_venv\Scripts\activate  # Windows
# source backend_venv/bin/activate  # Linux/Mac
cd backend
python app.py
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

Access the application at: http://localhost:5173

## 🛠️ Major Fixes & Improvements

### ✅ Data Persistence & Caching
- **Problem**: Data was fetched and models retrained on every request
- **Solution**: Implemented intelligent caching system
  - Processed data cached for 7 days
  - Models trained once and persisted to disk
  - Cache management API endpoints added
  - 10x faster subsequent loads

### ✅ Visualization Improvements  
- **Problem**: Frontend lacked proper Plotly support, used unreliable iframe approach
- **Solution**: Complete visualization overhaul
  - Added `react-plotly.js` and `plotly.js-dist-min` dependencies
  - Created `EnhancedVisualizationPanel` component
  - Direct Plotly integration for reliable rendering
  - Responsive charts with proper theming
  - Better error handling and loading states

### ✅ Backend API Enhancements
- **Problem**: Limited API endpoints and poor error handling
- **Solution**: Enhanced API with new endpoints
  - `/api/visualizations` - Get visualizations without retraining
  - `/api/clear_cache` - Manual cache management
  - `/api/model_status` - Enhanced status with cache info
  - Better error messages and logging
  - Proper CORS configuration

### ✅ Model Training Optimization
- **Problem**: Models trained repeatedly, inefficient resource usage
- **Solution**: Smart model persistence
  - Models saved as `.joblib` files with metadata
  - Automatic model loading on startup
  - Only retrain when necessary
  - Model versioning and metrics tracking

### ✅ Development Environment
- **Problem**: Complex manual setup, missing dependencies
- **Solution**: Automated development setup
  - One-command environment setup script
  - Virtual environment management  
  - Dependency verification
  - Convenient startup scripts for all platforms

## 📊 Technical Architecture

### Backend Stack
- **FastAPI**: High-performance Python web framework
- **ARGO Data**: Real oceanographic measurements via `argopy`
- **ML Pipeline**: LightGBM, XGBoost, Random Forest models
- **Data Caching**: File-based caching with expiry management
- **Model Persistence**: Joblib-based model serialization
- **AI Chatbot**: Google Gemini integration

### Frontend Stack  
- **React 18**: Modern UI framework with TypeScript
- **Plotly.js**: Interactive scientific visualizations
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component primitives

### Data Flow
```
ARGO API → Data Fetcher → Cache System → ML Models → Visualizations
                ↓              ↓           ↓
            Raw Data      Processed     Trained      
                         Data Cache     Models
```

## 🌟 Key Features

### 🔥 Performance Optimizations
- **Intelligent Caching**: 7-day data cache reduces API calls
- **Model Persistence**: Train once, reuse indefinitely  
- **Lazy Loading**: Components load only when needed
- **Response Compression**: Optimized data transfer

### 📈 Enhanced Visualizations
- **Geographic Maps**: Interactive ARGO float locations
- **Depth Profiles**: Temperature/salinity by depth
- **Time Series**: Temporal oceanographic trends  
- **3D Scatter**: Multi-dimensional ocean data exploration

### 🤖 AI-Powered Analysis
- **Smart Chatbot**: Context-aware oceanographic assistant
- **Predictive Models**: ML-based temperature/salinity prediction
- **Fishing Advisor**: Location-specific recommendations
- **Research Assistant**: Data insights and analysis


## 🌊 Ocean Data Regions

Supported regions with real ARGO float data:
- **Arabian Sea**: Rich marine biodiversity analysis
- **Bay of Bengal**: Monsoon impact studies
- **North Indian Ocean**: Climate change monitoring


## 🔍 Troubleshooting


#### 1. Chatbot not responding
```bash
# Check API key configuration
python -c "
import sys; sys.path.append('backend')
try:
    from config_keys import GEMINI_API_KEY
    print('✅ API key configured')
except ImportError:
    print('❌ config_keys.py missing')
"
```

#### 2. Cache issues
```bash
# Check cache status
curl http://localhost:8000/api/model_status

# Clear all caches
rm -rf data_cache/
rm -rf models/
```

**Built with ❤️ for ocean science and marine conservation** 🐠🌊
