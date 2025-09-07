import React from 'react';
import { FastIcon, SecureIcon, FreeIcon, TrustedIcon } from './Icons';

const TrustSection: React.FC = () => {
  const features = [
    { icon: FastIcon, title: 'Lightning Fast', description: 'Optimized processing for all your tasks.' },
    { icon: SecureIcon, title: 'Bank-Grade Security', description: 'Your data is encrypted and protected.' },
    { icon: FreeIcon, title: 'Generous Free Tier', description: 'Access essential tools completely free.' },
    { icon: TrustedIcon, title: 'Trusted by Thousands', description: 'Loved by over 100,000+ users worldwide.' },
  ];

  return (
    <section id="features" className="py-20 sm:py-24 border-y border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
           <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">More Accurate Than Standard LLMs</h2>
           <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
             By using real data to model individuals and their interactions, Artificial Societies can predict social outcomes at far greater accuracy than standard LLMs.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center">
              <feature.icon className="h-10 w-10 text-cyan mb-4" />
              <h3 className="text-xl font-bold font-heading text-white">{feature.title}</h3>
              <p className="text-gray-400 mt-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;