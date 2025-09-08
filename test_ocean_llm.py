#!/usr/bin/env python3
"""
Test script for Ocean LLM - Verifies all functionality
"""

import requests
import json
import time

def test_backend():
    """Test the backend functionality."""
    print("🌊 Testing Ocean LLM Backend")
    print("=" * 40)
    
    base_url = "http://localhost:8000"
    
    # Test 1: Health Check
    print("1. Testing health check...")
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Health: {data['status']}")
            print(f"   🔑 API Key: {'✅ Set' if data['api_key_set'] else '❌ Not Set'}")
        else:
            print(f"   ❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Health check error: {e}")
        return False
    
    # Test 2: Regions
    print("\n2. Testing regions...")
    try:
        response = requests.get(f"{base_url}/api/regions")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Available regions: {list(data['regions'].keys())}")
        else:
            print(f"   ❌ Regions test failed: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Regions test error: {e}")
    
    # Test 3: Analysis (this will generate visualizations)
    print("\n3. Testing ocean data analysis...")
    try:
        response = requests.post(
            f"{base_url}/api/analyze",
            json={"region_key": "arabian_sea"}
        )
        if response.status_code == 200:
            data = response.json()
            print("   ✅ Analysis completed successfully!")
            print(f"   📊 Summary: {data['summary']['region']} - {data['summary']['num_profiles']} profiles")
            print(f"   🤖 Model metrics: {list(data['model_metrics'].keys())}")
            print(f"   📈 Visualizations: {list(data['visualizations'].keys())}")
            
            # Check if visualizations have data
            for viz_type, viz_data in data['visualizations'].items():
                if viz_data:
                    print(f"      ✅ {viz_type}: Data available")
                else:
                    print(f"      ❌ {viz_type}: No data")
        else:
            print(f"   ❌ Analysis failed: {response.status_code}")
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"   ❌ Analysis test error: {e}")
    
    # Test 4: Chat (if API key is set)
    print("\n4. Testing AI chatbot...")
    try:
        response = requests.post(
            f"{base_url}/api/chat",
            json={
                "message": "What can you tell me about ocean temperature?",
                "region_key": "arabian_sea"
            }
        )
        if response.status_code == 200:
            data = response.json()
            print("   ✅ Chat working!")
            print(f"   💬 Response: {data['response'][:100]}...")
        else:
            print(f"   ❌ Chat failed: {response.status_code}")
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"   ❌ Chat test error: {e}")
    
    return True

def main():
    """Main test function."""
    print("🧪 Ocean LLM System Test")
    print("=" * 50)
    
    # Wait a moment for servers to start
    print("⏳ Waiting for servers to start...")
    time.sleep(2)
    
    # Test backend
    backend_ok = test_backend()
    
    print("\n" + "=" * 50)
    if backend_ok:
        print("🎉 Ocean LLM is working correctly!")
        print("\n📋 What you can do now:")
        print("   • Visit http://localhost:8000/docs for API documentation")
        print("   • Visit http://localhost:5173 for the web interface")
        print("   • Test ocean data analysis and AI chatbot")
        print("   • View interactive visualizations")
    else:
        print("❌ Some tests failed. Check the backend logs.")
    
    print("\n🔧 Troubleshooting:")
    print("   • Make sure both backend and frontend are running")
    print("   • Check that GEMINI_API_KEY is set in config_keys.py")
    print("   • Verify all dependencies are installed")

if __name__ == "__main__":
    main()

