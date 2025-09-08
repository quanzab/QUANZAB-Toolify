import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative flex items-center justify-center min-h-screen text-center text-white px-4 sm:px-6 lg:px-8">
      {/* Background Image */}
      <img
        src="https://i.ibb.co/xtmR1cz8/Chat-GPT-Image-Sep-8-2025-09-59-23-PM.png"
        alt="A futuristic digital interface showcasing various productivity tools and AI capabilities."
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-900/40"></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="hero-title font-heading tracking-tight leading-tight mb-4 lg:text-7xl md:text-6xl text-5xl">
          Unlock Limitless Productivity
        </h1>
        <p className="hero-subtitle max-w-2xl mx-auto lg:text-2xl md:text-xl text-lg">
          Your Complete Suite of AI-Powered Tools for Documents, Business, and Creativity.
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
            className="w-full sm:w-auto inline-block px-8 py-4 text-lg font-semibold text-white bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors duration-300"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;