import React from 'react';
import { FastIcon, SecureIcon, FreeIcon, TrustedIcon } from './Icons';

const TrustSection: React.FC = () => {
  const features = [
    { icon: FastIcon, title: 'Fast', description: 'Lightning-fast processing for all your tasks.' },
    { icon: SecureIcon, title: 'Secure', description: 'Your data is encrypted and protected.' },
    { icon: FreeIcon, title: 'Free to Start', description: 'Access essential tools completely free.' },
    // FIX: Corrected the data structure for consistent rendering.
    { icon: TrustedIcon, title: 'Trusted by Users', description: 'Loved by over 100,000+ users worldwide.' },
  ];

  return (
    <section className="bg-brand-light dark:bg-gray-800 py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="p-4 bg-white dark:bg-gray-700 rounded-full shadow-md mb-4">
                <feature.icon className="h-8 w-8 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold font-heading text-brand-dark dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <h4 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-6">TRUSTED BY TEAMS AT</h4>
          <div className="flex justify-center items-center flex-wrap gap-x-12 gap-y-6 opacity-60">
            <span className="font-bold text-2xl text-gray-400 dark:text-gray-500">BRAND.IO</span>
            <span className="font-bold text-2xl text-gray-400 dark:text-gray-500">STARTUP</span>
            <span className="font-bold text-2xl text-gray-400 dark:text-gray-500">ENTERPRISE</span>
            <span className="font-bold text-2xl text-gray-400 dark:text-gray-500">CREATIVE</span>
            <span className="font-bold text-2xl text-gray-400 dark:text-gray-500">TECH.CO</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;