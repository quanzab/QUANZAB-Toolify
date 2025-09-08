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
      {/* Overlay Removed */}

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto mt-24">
        <h1 className="hero-title font-heading tracking-tight leading-tight mb-4 lg:text-7xl md:text-6xl text-5xl">
          Unlock Limitless Productivity
        </h1>
        <p className="hero-subtitle max-w-2xl mx-auto lg:text-2xl md:text-xl text-lg">
          Your Complete Suite of AI-Powered Tools for Documents, Business, and Creativity.
        </p>
      </div>
    </section>
  );
};

export default Hero;