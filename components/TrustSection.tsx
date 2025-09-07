import React from 'react';
import { AIIcon, SecureIcon, FreeIcon, FastIcon } from './Icons';

const TrustSection: React.FC = () => {
  const features = [
    { icon: AIIcon, title: 'AI-Powered Precision', description: 'Leverage cutting-edge AI for smarter, more accurate results.' },
    { icon: SecureIcon, title: 'Secure & Private', description: 'Your data is encrypted and handled with bank-grade security.' },
    { icon: FreeIcon, title: 'Comprehensive Suite', description: 'All the tools you need for productivity in one unified platform.' },
    { icon: FastIcon, title: 'Streamlined Workflow', description: 'Intuitive design and fast processing to save you time.' },
  ];

  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
           <h2 className="text-4xl sm:text-5xl font-extrabold font-heading text-white">Why Choose QUANZAB?</h2>
           <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-400">
             We combine powerful technology with user-centric design to deliver an unparalleled productivity experience.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="p-4 bg-slate-800 rounded-full mb-4 relative ring-2 ring-slate-700">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary to-primary rounded-full blur opacity-20"></div>
                <feature.icon className="relative h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-white">{feature.title}</h3>
              <p className="text-gray-400 mt-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
