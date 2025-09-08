import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative text-center overflow-hidden pt-20 pb-12 sm:pt-32 sm:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12">
          <img
            src="https://i.ibb.co/xtmR1cz8/Chat-GPT-Image-Sep-8-2025-09-59-23-PM.png"
            alt="A futuristic digital interface showcasing various productivity tools and AI capabilities, representing the QUANZAB Toolkit's all-in-one suite."
            className="mx-auto rounded-xl shadow-2xl shadow-slate-900/40 w-full max-w-4xl"
            width="1024"
            height="576"
          />
        </div>
        
        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
          Your All-in-One
          <span className="block bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text mt-2 sm:mt-4">AI Productivity Suite</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-gray-300">
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
            className="w-full sm:w-auto inline-block px-8 py-4 text-lg font-semibold text-white bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/20 rounded-lg hover:bg-black/20 dark:hover:bg-white/20 transition-colors duration-300"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;