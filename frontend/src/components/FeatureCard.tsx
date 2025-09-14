import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="group p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-ocean-light/30 hover:border-aqua-bright/50 transition-all duration-500 hover:shadow-subtle hover:scale-[1.02] ocean-wave">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-aqua rounded-lg flex items-center justify-center text-ocean-deep text-xl group-hover:shadow-aqua-glow transition-all duration-500">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-aqua-light transition-colors duration-300">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;