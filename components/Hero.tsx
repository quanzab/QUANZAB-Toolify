import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Image Section */}
      <div className="relative h-[55vh] sm:h-[60vh] bg-slate-900">
        <img
          src="https://i.ibb.co/xtmR1cz8/Chat-GPT-Image-Sep-8-2025-09-59-23-PM.png"
          alt="A futuristic digital interface showcasing various productivity tools and AI capabilities."
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
          Your All-in-One
          <span className="block bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text mt-2 sm:mt-3">AI Productivity Suite</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-gray-400">
         From complex document analysis to creative text generation, accomplish more with our intelligent, integrated toolkit.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#tools"
            className="w-full sm:w-auto inline-block px-8 py-4 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg shadow-primary/20 hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
          >
            Explore AI Tools
          </a>
          <a
            href="#features"
            className="w-full sm:w-auto inline-block px-8 py-4 text-lg font-semibold text-slate-700 dark:text-white bg-slate-100 dark:bg-white/10 border border-slate-300 dark:border-white/20 rounded-lg hover:bg-slate-200 dark:hover:bg-white/20 backdrop-blur-sm transition-colors duration-300"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;