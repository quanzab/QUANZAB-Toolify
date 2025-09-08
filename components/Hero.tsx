import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative text-center overflow-hidden min-h-[60vh] sm:min-h-[75vh] flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://i.ibb.co/xtmR1cz8/Chat-GPT-Image-Sep-8-2025-09-59-23-PM.png"
          alt="A futuristic digital interface showcasing various productivity tools and AI capabilities."
          className="w-full h-full object-cover"
        />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-slate-950/60"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 sm:py-32">
        <h1 
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-heading text-white tracking-tight drop-shadow-lg opacity-0 animate-fade-in-up"
          style={{ animationDelay: '200ms' }}
        >
          Your All-in-One{' '}
          <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            AI Productivity Suite
          </span>
        </h1>
        <p 
          className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-gray-200 drop-shadow-md opacity-0 animate-fade-in-up"
          style={{ animationDelay: '400ms' }}
        >
         From complex document analysis to creative text generation, accomplish more with our intelligent, integrated toolkit.
        </p>
        <div 
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '600ms' }}
        >
          <a
            href="#tools"
            className="w-full sm:w-auto inline-block px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary to-secondary rounded-lg shadow-lg shadow-primary/30 hover:shadow-2xl hover:shadow-secondary/30 transition-all duration-300 transform hover:-translate-y-1"
          >
            Explore AI Tools
          </a>
          <a
            href="#features"
            className="w-full sm:w-auto inline-block px-8 py-4 text-lg font-semibold text-white bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 backdrop-blur-sm transition-colors duration-300"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;