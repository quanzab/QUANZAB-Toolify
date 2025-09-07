import React from 'react';

const CtaBanner: React.FC = () => {
  return (
    <section className="py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl"></div>
          <h2 className="text-4xl sm:text-5xl font-extrabold font-heading text-white relative z-10">
            Boost Your Productivity in Seconds
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400 relative z-10">
            Unlock batch processing, higher limits, and priority support. Supercharge your workflow today.
          </p>
          <div className="mt-8 relative z-10">
            <a
              href="#"
              className="inline-block px-8 py-4 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg shadow-primary/20 hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
            >
              Boost Productivity Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;
