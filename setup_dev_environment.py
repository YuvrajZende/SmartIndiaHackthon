#!/usr/bin/env python3
"""
Development Environment Setup Script for SmartIndiaHackthon Ocean LLM Project
This script sets up the complete development environment with proper virtual environment,
dependencies, and initial project configuration.
"""

import os
import sys
import subprocess
import platform
from pathlib import Path

def run_command(command, shell=True, check=True, capture_output=False):
    """Run a command and handle errors appropriately."""
    try:
        if capture_output:
            result = subprocess.run(command, shell=shell, check=check, capture_output=True, text=True)
            return result.stdout.strip()
        else:
            result = subprocess.run(command, shell=shell, check=check)
            return result.returncode == 0
    except subprocess.CalledProcessError as e:
        print(f"❌ Command failed: {command}")
        print(f"Error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error running command: {command}")
        print(f"Error: {e}")
        return False

def check_python_version():
    """Check if Python version is compatible."""
    version = sys.version_info
    if version.major != 3 or version.minor < 8:
        print(f"❌ Python 3.8+ is required. Current version: {version.major}.{version.minor}")
        return False
    print(f"✅ Python version: {version.major}.{version.minor}.{version.micro}")
    return True

def check_node_npm():
    """Check if Node.js and npm are installed."""
    try:
        node_version = run_command("node --version", capture_output=True)
        npm_version = run_command("npm --version", capture_output=True)
        print(f"✅ Node.js version: {node_version}")
        print(f"✅ npm version: {npm_version}")
        return True
    except:
        print("❌ Node.js and npm are required for frontend development")
        print("Please install Node.js from: https://nodejs.org/")
        return False

def setup_backend_environment():
    """Set up Python backend environment."""
    print("\n🐍 Setting up Python backend environment...")
    
    # Create virtual environment
    venv_path = Path("backend_venv")
    if not venv_path.exists():
        print("Creating virtual environment...")
        if not run_command(f"python -m venv backend_venv"):
            return False
        print("✅ Virtual environment created")
    else:
        print("✅ Virtual environment already exists")
    
    # Determine activation script based on OS
    if platform.system() == "Windows":
        activate_script = venv_path / "Scripts" / "activate.bat"
        pip_executable = venv_path / "Scripts" / "pip.exe"
        python_executable = venv_path / "Scripts" / "python.exe"
    else:
        activate_script = venv_path / "bin" / "activate"
        pip_executable = venv_path / "bin" / "pip"
        python_executable = venv_path / "bin" / "python"
    
    # Install backend dependencies
    print("Installing backend dependencies...")
    requirements_path = Path("backend") / "requirements.txt"
    if requirements_path.exists():
        if not run_command(f"\"{pip_executable}\" install -r \"{requirements_path}\""):
            return False
        print("✅ Backend dependencies installed")
    else:
        # Install essential dependencies if requirements.txt is missing
        essential_deps = [
            "fastapi", "uvicorn[standard]", "pandas", "numpy", 
            "plotly", "scikit-learn", "argopy", "google-generativeai",
            "python-multipart", "lightgbm", "xgboost", "joblib"
        ]
        deps_str = " ".join(essential_deps)
        if not run_command(f"\"{pip_executable}\" install {deps_str}"):
            return False
        print("✅ Essential backend dependencies installed")
    
    return True, str(python_executable), str(activate_script)

def setup_frontend_environment():
    """Set up Node.js frontend environment."""
    print("\n🌐 Setting up frontend environment...")
    
    frontend_path = Path("frontend")
    if not frontend_path.exists():
        print("❌ Frontend directory not found")
        return False
    
    # Change to frontend directory
    original_cwd = os.getcwd()
    try:
        os.chdir(frontend_path)
        
        # Install frontend dependencies
        print("Installing frontend dependencies...")
        if not run_command("npm install"):
            return False
        print("✅ Frontend dependencies installed")
        
        return True
    finally:
        os.chdir(original_cwd)

def create_startup_scripts():
    """Create convenient startup scripts."""
    print("\n📝 Creating startup scripts...")
    
    if platform.system() == "Windows":
        # Backend startup script
        backend_script = """@echo off
echo Starting Ocean LLM Backend...
call backend_venv\\Scripts\\activate.bat
cd backend
python app.py
pause
"""
        with open("start_backend.bat", "w") as f:
            f.write(backend_script)
        
        # Frontend startup script
        frontend_script = """@echo off
echo Starting Ocean LLM Frontend...
cd frontend
npm run dev
pause
"""
        with open("start_frontend.bat", "w") as f:
            f.write(frontend_script)
        
        # Combined startup script
        combined_script = """@echo off
echo Starting Ocean LLM Full Stack...
start "Backend" start_backend.bat
timeout /t 3 /nobreak > nul
start "Frontend" start_frontend.bat
echo.
echo Both services are starting...
echo Backend will be at: http://localhost:8000
echo Frontend will be at: http://localhost:5173
pause
"""
        with open("start_development.bat", "w") as f:
            f.write(combined_script)
        
        print("✅ Created Windows startup scripts:")
        print("   - start_backend.bat")
        print("   - start_frontend.bat") 
        print("   - start_development.bat")
    
    else:
        # Backend startup script
        backend_script = """#!/bin/bash
echo "Starting Ocean LLM Backend..."
source backend_venv/bin/activate
cd backend
python app.py
"""
        with open("start_backend.sh", "w") as f:
            f.write(backend_script)
        os.chmod("start_backend.sh", 0o755)
        
        # Frontend startup script
        frontend_script = """#!/bin/bash
echo "Starting Ocean LLM Frontend..."
cd frontend
npm run dev
"""
        with open("start_frontend.sh", "w") as f:
            f.write(frontend_script)
        os.chmod("start_frontend.sh", 0o755)
        
        # Combined startup script
        combined_script = """#!/bin/bash
echo "Starting Ocean LLM Full Stack..."
./start_backend.sh &
sleep 3
./start_frontend.sh &
echo
echo "Both services are starting..."
echo "Backend will be at: http://localhost:8000"
echo "Frontend will be at: http://localhost:5173"
wait
"""
        with open("start_development.sh", "w") as f:
            f.write(combined_script)
        os.chmod("start_development.sh", 0o755)
        
        print("✅ Created Linux/Mac startup scripts:")
        print("   - start_backend.sh")
        print("   - start_frontend.sh")
        print("   - start_development.sh")

def setup_environment_config():
    """Set up environment configuration files."""
    print("\n⚙️ Setting up environment configuration...")
    
    # Create config_keys.py template if it doesn't exist
    config_keys_path = Path("backend") / "config_keys.py"
    if not config_keys_path.exists():
        config_template = '''# config_keys.py - API Keys Configuration
# ⚠️ Important: Never commit this file to version control!
# Get your free API key from: https://makersuite.google.com/app/apikey

GEMINI_API_KEY = "your-gemini-api-key-here"

# Instructions:
# 1. Replace "your-gemini-api-key-here" with your actual Google Gemini API key
# 2. Save this file
# 3. Restart the backend server
# 4. The chatbot functionality will now work properly
'''
        with open(config_keys_path, "w") as f:
            f.write(config_template)
        print("✅ Created config_keys.py template")
        print("   📝 Please edit backend/config_keys.py and add your Google Gemini API key")
    else:
        print("✅ config_keys.py already exists")
    
    # Create directories for data storage
    dirs_to_create = ["models", "data_cache"]
    for dir_name in dirs_to_create:
        dir_path = Path(dir_name)
        dir_path.mkdir(exist_ok=True)
        print(f"✅ Created directory: {dir_name}")

def main():
    """Main setup function."""
    print("🌊 Ocean LLM Development Environment Setup")
    print("=" * 50)
    
    # Check prerequisites
    if not check_python_version():
        return False
    
    if not check_node_npm():
        return False
    
    # Setup backend
    backend_result = setup_backend_environment()
    if isinstance(backend_result, tuple):
        success, python_exe, activate_script = backend_result
        if not success:
            print("❌ Backend setup failed")
            return False
    else:
        print("❌ Backend setup failed")
        return False
    
    # Setup frontend
    if not setup_frontend_environment():
        print("❌ Frontend setup failed")
        return False
    
    # Create startup scripts
    create_startup_scripts()
    
    # Setup environment configuration
    setup_environment_config()
    
    print("\n🎉 Development environment setup complete!")
    print("\n📋 Next Steps:")
    print("1. Edit backend/config_keys.py and add your Google Gemini API key")
    print("2. Run the development servers:")
    if platform.system() == "Windows":
        print("   - Backend: start_backend.bat")
        print("   - Frontend: start_frontend.bat")
        print("   - Both: start_development.bat")
    else:
        print("   - Backend: ./start_backend.sh")
        print("   - Frontend: ./start_frontend.sh")
        print("   - Both: ./start_development.sh")
    print("3. Open http://localhost:5173 in your browser")
    print("4. Load ocean models using the interface")
    print("5. Start exploring ocean data!")
    
    print("\n💡 Features include:")
    print("   - Intelligent data caching (avoids reprocessing)")
    print("   - Model persistence (trains once, reuses models)")
    print("   - Enhanced visualizations with Plotly")
    print("   - Real-time ocean data analysis")
    print("   - AI-powered chatbot assistance")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
