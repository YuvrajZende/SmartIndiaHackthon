import { Button } from "@/components/ui/button";
import { 
  Database, 
  BarChart3, 
  MessageCircle, 
  Zap, 
  TrendingUp,
  Eye,
  Download,
  Info,
  Mail,
  Github
} from "lucide-react";
// import oceanBackground from "./assets/ocean-background.jpg"; // Commented out to fix TypeScript issues

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  const handleGetStarted = () => {
    onGetStarted();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-blue-800/60 to-slate-900/90" />
        
        <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight text-white">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Ocean LLM
              </span>
              <br />
              <span className="text-white">
                AI-Powered Ocean Analysis
              </span>
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            From raw ARGO data to interactive analysis, predictions, and conversations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              onClick={handleGetStarted}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 rounded-lg min-w-[200px]"
            >
              Get Started
            </Button>
            <Button 
              variant="outline"
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 px-8 py-3 rounded-lg min-w-[200px]"
            >
              Watch Demo
            </Button>
          </div>
        </div>

      </section>

      {/* Simple Features Section */}
      <section className="py-24 px-6 bg-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-white">
            Powerful Ocean Data Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="p-6 bg-slate-700 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-cyan-400">🌍 Interactive Visualizations</h3>
              <p className="text-gray-300">Explore ocean data through beautiful, interactive maps and 3D plots.</p>
            </div>
            <div className="p-6 bg-slate-700 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-cyan-400">🧠 AI-Powered Predictions</h3>
              <p className="text-gray-300">Get forecasts and insights using advanced machine learning.</p>
            </div>
            <div className="p-6 bg-slate-700 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-cyan-400">🤖 Natural Conversations</h3>
              <p className="text-gray-300">Ask questions in plain English about ocean data and trends.</p>
            </div>
            <div className="p-6 bg-slate-700 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-cyan-400">📊 Easy Insights</h3>
              <p className="text-gray-300">Complex oceanographic data made simple for everyone.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
