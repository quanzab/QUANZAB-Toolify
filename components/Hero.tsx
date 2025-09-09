import React from 'react';

const Hero: React.FC = () => {
  const tags = ["PDF Tools", "AI Assistant", "eSign Documents", "Business Tools", "Content Creation"];

  return (
    <section className="relative min-h-screen flex items-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-slate-950 -z-20"></div>
      {/* The wavy background glow */}
      <div className="absolute left-0 bottom-0 w-full h-[300px] bg-[radial-gradient(ellipse_at_bottom,_rgba(99,102,241,0.15)_0%,_transparent_70%)] -z-10"></div>
      
      <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Text Content */}
        <div className="text-left z-10 py-24">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-heading tracking-tighter text-white">
            Unlock Limitless
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-500">
              Productivity
            </span>
          </h1>
          <div className="flex flex-wrap gap-3 mt-8">
            {tags.map((tag) => (
              <span key={tag} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-slate-300 backdrop-blur-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: Image */}
        <div className="hidden lg:flex justify-center items-center z-10">
          <img
            src="https://i.ibb.co/xtmR1cz8/Chat-GPT-Image-Sep-8-2025-09-59-23-PM.png"
            alt="Productivity tools showcase"
            className="rounded-2xl max-w-lg w-full shadow-2xl shadow-primary/10"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;