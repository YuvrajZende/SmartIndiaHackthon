# Ocean LLM - AI-Powered Ocean Data Analysis Platform 🌊

A comprehensive ocean data analysis platform that combines ARGO float data with AI-powered insights for marine research, fishing optimization, and environmental monitoring.

## 🚀 Quick Start

### Automated Setup (Recommended)

Run the automated setup script to configure everything:

```bash
python setup_dev_environment.py
```

This will:
- Create a proper virtual environment
- Install all backend dependencies
- Install all frontend dependencies  
- Create convenient startup scripts
- Set up data directories and configuration

### Manual Setup

If you prefer manual setup:

#### Backend Setup
```bash
# Create virtual environment
python -m venv backend_venv

# Activate virtual environment (Windows)
backend_venv\Scripts\activate
# Or on Linux/Mac:
source backend_venv/bin/activate

# Install dependencies
cd backend
pip install -r requirements.txt
```

#### Frontend Setup
```bash
cd frontend
npm install
```

## 🔧 Configuration

### API Keys
1. Get a free Google Gemini API key from: https://makersuite.google.com/app/apikey
2. Edit `backend/config_keys.py` and add your API key:
```python
GEMINI_API_KEY = "your-actual-api-key-here"
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

### 🛡️ Production-Ready Features
- **Error Handling**: Comprehensive error management
- **Health Checks**: API status monitoring
- **Cache Management**: Manual cache clearing
- **Model Metrics**: Performance tracking and validation
- **CORS Support**: Secure cross-origin requests

## 🌊 Ocean Data Regions

Supported regions with real ARGO float data:
- **Arabian Sea**: Rich marine biodiversity analysis
- **Bay of Bengal**: Monsoon impact studies
- **North Indian Ocean**: Climate change monitoring

## 🧪 API Documentation

### Core Endpoints
- `GET /` - API information and available regions
- `POST /api/analyze` - Complete analysis with model training
- `POST /api/visualizations` - Get cached visualizations
- `POST /api/chat` - AI chatbot interaction
- `POST /api/predict` - Ocean parameter predictions
- `GET /api/model_status` - Model loading status
- `POST /api/clear_cache` - Cache management

### Example Usage
```python
import requests

# Get visualizations (uses cache if available)
response = requests.post('http://localhost:8000/api/visualizations', 
                        json={'region_key': 'arabian_sea'})
data = response.json()

# Chat with AI assistant
response = requests.post('http://localhost:8000/api/chat',
                        json={
                            'message': 'What are the ocean conditions like?',
                            'region_key': 'arabian_sea'
                        })
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Visualizations not showing
```bash
# Check if Plotly dependencies are installed
cd frontend
npm list react-plotly.js plotly.js-dist-min

# Reinstall if missing
npm install plotly.js-dist-min@^2.27.0 react-plotly.js@^2.6.0
```

#### 2. Models not persisting
```bash
# Check if models directory exists
ls models/

# Clear cache and retrain
curl -X POST http://localhost:8000/api/clear_cache \
     -H "Content-Type: application/json" \
     -d '{"region_key": "arabian_sea"}'
```

#### 3. Chatbot not responding
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

#### 4. Cache issues
```bash
# Check cache status
curl http://localhost:8000/api/model_status

# Clear all caches
rm -rf data_cache/
rm -rf models/
```

## 🤝 Contributing

1. Fork the repository
2. Run `python setup_dev_environment.py` 
3. Make your changes
4. Test both backend and frontend
5. Submit a pull request

## 📜 License

This project was developed for the Smart India Hackathon, demonstrating innovative use of AI and oceanographic data for practical applications in marine science and fisheries management.

---

**Built with ❤️ for ocean science and marine conservation** 🐠🌊
