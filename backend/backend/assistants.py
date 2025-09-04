class FishingAdvisor:
    """Specialized advisor for fishing communities."""
    
    def __init__(self, predictor):
        self.predictor = predictor
    
    def get_fishing_advice(self, lat, lon, month):
        """Provides fishing advice based on predicted ocean conditions."""
        if not self.predictor or not self.predictor.models_trained:
            return "Predictive models are not ready. Please run analysis first."
            
        depths_to_check = [10, 50, 100, 200]
        advice = f"🎣 Fishing Conditions Report for {lat:.2f}°N, {lon:.2f}°E in Month {month}:\n\n"
        
        for depth in depths_to_check:
            try:
                conditions = self.predictor.predict(lat, lon, depth, month)
                temp = conditions.get('predicted_temperature', 'N/A')
                
                advice += f"📏 Depth {depth}m:\n"
                advice += f"   🌡️ Predicted Temperature: {temp}°C\n"
                
                if isinstance(temp, (int, float)):
                    if 24 < temp < 30:
                        advice += "   🐟 Good for: Tuna, Marlin, Dolphinfish. ✅ Recommended fishing depth.\n\n"
                    elif 20 < temp <= 24:
                        advice += "   🐟 Good for: Mackerel, Sardines, Anchovies. ⚡ Moderate conditions.\n\n"
                    else:
                        advice += "   🐟 Good for: Deep-water species. ❄️ Cool water fishing.\n\n"
                else:
                    advice += "   Could not determine recommendation.\n\n"
                    
            except Exception as e:
                advice += f"   ❌ Could not analyze depth {depth}m: {e}\n\n"
        
        advice += "💡 General Tip: Best fishing times are often early morning and late evening."
        return advice

class ResearchAssistant:
    """Assistant for marine researchers."""
    
    def __init__(self, data_df):
        self.df = data_df
    
    def analyze_water_masses(self):
        """Identifies and analyzes different water masses."""
        if self.df.empty:
            return "No data available for water mass analysis."
        
        analysis = "🌊 Water Mass Analysis:\n\n"
        water_masses = {
            "Surface Water (0-100m)": self.df[self.df['depth'] <= 100],
            "Intermediate Water (100-1000m)": self.df[(self.df['depth'] > 100) & (self.df['depth'] <= 1000)],
            "Deep Water (>1000m)": self.df[self.df['depth'] > 1000]
        }
        
        for name, data in water_masses.items():
            if not data.empty:
                analysis += (f"📊 {name}:\n"
                             f"   🌡️ Avg Temp: {data['temperature'].mean():.2f}°C\n"
                             f"   🧂 Avg Salinity: {data['salinity'].mean():.2f} PSU\n"
                             f"   📈 Data Points: {len(data)}\n\n")
        return analysis