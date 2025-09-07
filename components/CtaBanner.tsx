

import React from 'react';

const CtaBanner: React.FC = () => {
  return (
    <section className="bg-white dark:bg-gray-800 py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-primary to-blue-600 rounded-xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full"></div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading relative z-10">
            Upgrade to Pro for Unlimited Features
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-blue-100 relative z-10">
            Unlock batch processing, higher limits, and priority support. Supercharge your productivity today.
          </p>
          <div className="mt-8 relative z-10">
            <a
              href="#"
              className="inline-block px-8 py-3 text-lg font-semibold text-brand-primary bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              Explore Pro Plans
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;