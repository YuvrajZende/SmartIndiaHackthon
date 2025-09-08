# Configuration file for API keys
# This file stores the API keys for the Ocean LLM project

# Google Gemini API Key for AI chatbot functionality
GEMINI_API_KEY = "AIzaSyB3tuZk0jTnJXkW7v-uWVUk8l1AbOv0X-I"

# You can also set environment variables here
import os
os.environ['GEMINI_API_KEY'] = GEMINI_API_KEY

print("✅ GEMINI_API_KEY has been set successfully!")
