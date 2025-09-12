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
            print(f"Chatbot error: {e}")
            # Provide more helpful error messages
            if "API_KEY" in str(e) or "authentication" in str(e).lower():
                return "I'm having trouble connecting to the AI service. Please check if the GEMINI_API_KEY is properly set in the backend environment variables."
            elif "quota" in str(e).lower() or "limit" in str(e).lower():
                return "I've reached my API usage limit. Please try again later or check your API quota."
            else:
                return f"I encountered an error while processing your request: {str(e)[:100]}... Please try rephrasing your question or check the backend logs for more details."
    
    def _create_context_prompt(self, user_message):
        """Creates a context-aware prompt for the AI."""
        system_prompt = """You are OceanGPT, an expert oceanographer and AI assistant specializing in ocean data analysis. You are helping users understand ARGO float data and oceanographic phenomena.
always try to give the output in bullet points, and also try to be with the user input the do not try to extent or try to givr long output
Your expertise includes:
1. Ocean temperature and salinity analysis
2. Marine ecosystem dynamics
3. Fishing recommendations based on ocean conditions
4. Climate change impacts on oceans
5. Oceanographic data interpretation

Guidelines:
- Provide accurate, scientific information
- Use clear, accessible language
- Suggest relevant visualizations when appropriate
- Be helpful and educational
- If you don't know something, say so clearly

Current Data Context:"""

        context_info = ""
        if self.data_summary:
            context_info = "\n" + "\n".join([f"- {k.replace('_', ' ').title()}: {v}" for k, v in self.data_summary.items()])
        else:
            context_info = "\n- No specific ocean data context available for this region yet."
        
        # Add model information if available
        if self.predictor and hasattr(self.predictor, 'model_metrics') and self.predictor.model_metrics:
            context_info += "\n\nAvailable Predictive Models:"
            for param, metrics in self.predictor.model_metrics.items():
                context_info += f"\n- {param.title()} Model: {metrics.get('model_type', 'Unknown')} (R² = {metrics.get('r2', 'N/A')})"
        
        full_prompt = f"{system_prompt}{context_info}\n\nUser Question: {user_message}\n\nYour Answer:"
        return full_prompt
    
    def _extract_text(self, response):
        """Extracts text from Gemini response."""
        try:
            return response.text
        except Exception:
            return "Sorry, there was an error processing the AI response."