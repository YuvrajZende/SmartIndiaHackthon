import { ReactNode } from "react";

interface WorkflowStepProps {
  icon: ReactNode;
  title: string;
  description: string;
  step: number;
}

const WorkflowStep = ({ icon, title, description, step }: WorkflowStepProps) => {
  return (
    <div className="relative group">
      <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-aqua-bright/20 hover:border-aqua-bright/40 transition-all duration-500 hover:shadow-subtle hover:scale-105">
        <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-aqua rounded-full flex items-center justify-center text-ocean-deep font-bold text-sm">
          {step}
        </div>
        <div className="w-16 h-16 bg-gradient-aqua rounded-xl flex items-center justify-center text-ocean-deep text-2xl mb-2 group-hover:shadow-aqua-glow transition-all duration-500">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default WorkflowStep;