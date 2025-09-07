import React from 'react';

const CtaBanner: React.FC = () => {
  return (
    <section className="py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple/10 rounded-full blur-2xl"></div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white relative z-10">
            Get started today
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400 relative z-10">
            Unlock batch processing, higher limits, and priority support. Supercharge your productivity.
          </p>
          <div className="mt-8 relative z-10">
            <a
              href="#"
              className="inline-block px-8 py-3 text-lg font-semibold text-slate-900 bg-white rounded-lg shadow-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
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