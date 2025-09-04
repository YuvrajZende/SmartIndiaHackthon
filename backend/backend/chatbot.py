# /backend/chatbot.py

import os
import google.generativeai as genai

class OceanChatbot:
    """Intelligent chatbot for ocean data analysis."""
    
    def __init__(self, predictor=None, data_summary=None):
        api_key = os.environ.get('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable not set.")
            
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-1.5-flash")
        self.predictor = predictor
        self.data_summary = data_summary or {}
        self.conversation_history = []
        
    def chat(self, user_message):
        """Main chat interface."""
        try:
            prompt = self._create_context_prompt(user_message)
            response = self.model.generate_content(prompt)
            return self._extract_text(response)
        except Exception as e:
            return f"Sorry, I encountered an error: {e}"
    
    def _create_context_prompt(self, user_message):
        """Creates a context-aware prompt for the AI."""
        system_prompt = """You are OceanGPT, an expert oceanographer. You are assisting a user analyzing ARGO float data. 
        Your capabilities:
        1. Analyze ocean data from the provided context.
        2. Explain ocean phenomena.
        3. Provide insights for fishing and marine research.
        Use the data context below to answer the user's question accurately."""

        context_info = f"\nCurrent Data Context:\n" + "\n".join([f"- {k}: {v}" for k, v in self.data_summary.items()])
        
        full_prompt = f"{system_prompt}\n\n{context_info}\n\nUser Question: {user_message}\n\nYour Answer:"
        return full_prompt
    
    def _extract_text(self, response):
        """Extracts text from Gemini response."""
        try:
            return response.text
        except Exception:
            return "Sorry, there was an error processing the AI response."