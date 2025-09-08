@echo off
echo 🌊 Starting Ocean LLM - AI-Powered Ocean Data Analysis Platform
echo ================================================================

echo.
echo 📦 Starting Backend Server...
cd backend
start "Ocean LLM Backend" cmd /k "python app.py"

echo.
echo ⏳ Waiting for backend to initialize...
timeout /t 3 /nobreak > nul

echo.
echo 🎨 Starting Frontend Server...
cd ..\frontend
start "Ocean LLM Frontend" cmd /k "npm run dev"

echo.
echo ✅ Both servers are starting!
echo.
echo 🌐 Backend API: http://localhost:8000
echo 📚 API Docs: http://localhost:8000/docs
echo 🎨 Frontend: http://localhost:5173
echo.
echo 🔑 GEMINI_API_KEY is configured in config_keys.py
echo 📊 Visualizations will show real ocean data points and graphs
echo.
echo Press any key to exit this window...
pause > nul

