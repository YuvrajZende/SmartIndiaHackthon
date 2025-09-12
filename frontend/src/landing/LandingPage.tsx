import { Button } from "./components/ui/button";
import WorkflowStep from "./components/WorkflowStep";
import FeatureCard from "./components/FeatureCard";
import Ocean3D from "./components/Ocean3D";
import QuantumForge from "./components/QuantumForge";
import { 
  Database, 
  BarChart3, 
  Brain, 
  MessageCircle, 
  Globe, 
  Zap, 
  Bot, 
  TrendingUp,
  Download,
  Eye,
  Github,
  Mail,
  Info
} from "lucide-react";
import oceanBackground from "./assets/ocean-background.jpg";

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  const handleGetStarted = () => {
    onGetStarted();
  };

  return (
    <div className="min-h-screen bg-gradient-ocean-vertical">
      {/* QuantumForge Header */}
      <QuantumForge />
      
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${oceanBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/80 via-ocean-dark/60 to-ocean-deep/90" />
        <Ocean3D />
        
        <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
          <div className="mb-8 inline-block">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="text-glow bg-gradient-to-r from-aqua-bright to-aqua-light bg-clip-text text-transparent">
                Dive Deep
              </span>
              <br />
              <span className="text-foreground">
                into Ocean Insights
              </span>
              <br />
              <span className="text-aqua-glow">
                with AI
              </span>
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            From raw ARGO data to interactive analysis, predictions, and conversations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              variant="ocean" 
              size="xl" 
              onClick={handleGetStarted}
              className="float glow-aqua min-w-[200px]"
            >
              <Zap className="w-5 h-5" />
              Get Started
            </Button>
            <Button 
              variant="ocean-outline" 
              size="xl"
              className="min-w-[200px]"
            >
              <Eye className="w-5 h-5" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-aqua-bright/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 px-6 bg-ocean-dark/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              How <span className="text-aqua-bright">Ocean LLM</span> Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transform complex ocean data into meaningful insights through our intelligent workflow
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <WorkflowStep
              step={1}
              icon={<Database />}
              title="Fetch & Process"
              description="Automatically collect and process raw ARGO oceanographic data from global databases"
            />
            <WorkflowStep
              step={2}
              icon={<BarChart3 />}
              title="Visualize"
              description="Create stunning interactive maps, 3D plots, and comprehensive data visualizations"
            />
            <WorkflowStep
              step={3}
              icon={<TrendingUp />}
              title="Predict"
              description="Generate AI-powered predictions and forecasts based on historical patterns"
            />
            <WorkflowStep
              step={4}
              icon={<MessageCircle />}
              title="Chat"
              description="Have natural conversations with our AI to explore insights and ask questions"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Powerful <span className="text-aqua-bright">Features</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to unlock the secrets of our oceans
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard
              icon="🌍"
              title="Interactive Maps & 3D Plots"
              description="Explore ocean data through beautiful, interactive visualizations. Navigate through 3D ocean models and real-time global maps with intuitive controls."
            />
            <FeatureCard
              icon="🧠"
              title="AI-Powered Predictions"
              description="Leverage advanced machine learning algorithms to forecast ocean conditions, temperature changes, and marine ecosystem trends."
            />
            <FeatureCard
              icon="🤖"
              title="Natural Conversation with AI"
              description="Ask questions in plain English and get intelligent responses about ocean data, trends, and scientific insights."
            />
            <FeatureCard
              icon="📊"
              title="Easy-to-Understand Insights for Everyone"
              description="Complex oceanographic data made simple. Perfect for students, researchers, and ocean enthusiasts of all levels."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-ocean">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Ready to Explore the <span className="text-aqua-bright">Deep Blue?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join researchers, students, and ocean enthusiasts in discovering the hidden patterns of our planet's oceans.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              variant="ocean" 
              size="xl" 
              onClick={handleGetStarted}
              className="glow-aqua min-w-[200px]"
            >
              <Zap className="w-5 h-5" />
              Start Exploring
            </Button>
            <Button 
              variant="ocean-ghost" 
              size="xl"
              className="min-w-[200px]"
            >
              <Download className="w-5 h-5" />
              Download Data
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-ocean-deep border-t border-ocean-light/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-aqua-bright mb-4">Ocean LLM</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Intelligent Ocean Data Analysis System - Making oceanographic research accessible to everyone
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-12">
            <Button variant="ocean-ghost" size="lg" className="gap-3">
              <Info className="w-5 h-5" />
              About
            </Button>
            <Button variant="ocean-ghost" size="lg" className="gap-3">
              <Mail className="w-5 h-5" />
              Contact
            </Button>
            <Button variant="ocean-ghost" size="lg" className="gap-3">
              <Github className="w-5 h-5" />
              GitHub Repo
            </Button>
          </div>
          
          <div className="mt-12 pt-8 border-t border-ocean-light/20 text-center">
            <p className="text-muted-foreground text-sm">
              © 2024 Ocean LLM. Exploring the depths of ocean data with artificial intelligence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
