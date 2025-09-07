import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="bg-brand-light dark:bg-gray-800 py-20 sm:py-24 lg:py-32 relative">
       <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] bg-gradient-to-br from-white via-blue-50 to-green-50 dark:from-gray-800 dark:via-blue-900/20 dark:to-green-900/20 animate-[spin_40s_linear_infinite] opacity-50 dark:opacity-30"></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-brand-dark dark:text-white tracking-tight">
          Do Everything With Your Documents, <span className="text-brand-primary">For Free</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-400">
          Merge, Convert, Sign, Analyze, and More — all in one place. Your ultimate productivity suite is just a click away.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#tools"
            className="w-full sm:w-auto inline-block px-8 py-3 text-lg font-semibold text-white bg-brand-primary rounded-lg shadow-lg hover:bg-blue-800 transition-all duration-300 transform hover:scale-105"
          >
            Start Using Free
          </a>
          <a
            href="#tools"
            className="w-full sm:w-auto inline-block px-8 py-3 text-lg font-semibold text-brand-primary bg-white dark:bg-gray-700 dark:text-white border-2 border-brand-primary dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors duration-300"
          >
            See All Tools
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;