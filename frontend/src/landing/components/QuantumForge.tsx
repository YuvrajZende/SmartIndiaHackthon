import { Waves } from "lucide-react";

export default function OceanHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ocean-deep/65 backdrop-blur-sm border-b border-ocean-light/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-aqua-bright to-aqua-light rounded-lg flex items-center justify-center shadow-glow-aqua">
              <Waves className="w-6 h-6 text-ocean-deep" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-aqua-bright to-aqua-light rounded-lg blur-sm opacity-50 group-hover:opacity-70 transition-opacity"></div>
          </div>
          <span className="text-xl font-bold text-foreground group-hover:text-aqua-bright transition-colors">
            Ocean LLM
          </span>
        </div>
      </div>
    </header>
  );
}
