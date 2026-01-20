import type { ReactNode } from "react";


interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

interface FeatureCardProps {
  feature: Feature;
}

const FeatureCard = ({ feature }: FeatureCardProps) => {
  return (
    <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg hover:shadow-amber-100/50 hover:border-amber-200 transition-all duration-300 group">
      <div className="mb-4 p-3 rounded-full bg-amber-50 w-fit group-hover:bg-amber-100 transition-colors">
        {feature.icon}
      </div>

      <h3 className="text-slate-900 font-bold text-lg mb-2">
        {feature.title}
      </h3>

      <p className="text-slate-600 text-sm leading-relaxed">
        {feature.description}
      </p>
    </div>
  );
};

export default FeatureCard;
