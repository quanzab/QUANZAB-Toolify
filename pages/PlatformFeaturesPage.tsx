import React from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import { platformFeatures, FeatureCategory } from '../data/platformFeatures';

const CheckmarkIcon: React.FC<{ className?: string }> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

const FeatureCard: React.FC<{ category: FeatureCategory }> = ({ category }) => {
  const { title, icon: Icon, color, subCategories } = category;
  
  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 h-full flex flex-col transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
      <div className="flex items-center gap-4 mb-4">
        <Icon className={`w-8 h-8 ${color}`} />
        <h3 className={`text-xl font-bold font-heading ${color}`}>{title}</h3>
      </div>
      <div className="space-y-4 flex-grow">
        {subCategories.map((sub, index) => (
          <div key={index}>
            <h4 className="font-semibold text-gray-200 mb-2">{sub.name}</h4>
            <ul className="space-y-1.5">
              {sub.features.map((feature, fIndex) => (
                <li key={fIndex} className="flex items-start gap-2">
                  <CheckmarkIcon className="w-4 h-4 text-accent flex-shrink-0 mt-1" />
                  <span className="text-slate-300 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

const PlatformFeaturesPage: React.FC = () => {
  return (
    <ToolPageLayout
      title="Platform Features Dashboard"
      description="An overview of the comprehensive capabilities integrated into the QUANZAB Toolkit."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platformFeatures.map(category => (
          <FeatureCard key={category.title} category={category} />
        ))}
      </div>
    </ToolPageLayout>
  );
};

export default PlatformFeaturesPage;