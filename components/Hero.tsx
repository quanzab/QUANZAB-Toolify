
import React from 'react';
import { Category } from '../types';

interface HeroProps {
  setActiveCategory: (category: Category | 'all') => void;
}

const Hero: React.FC<HeroProps> = ({ setActiveCategory }) => {
  const tags = ["PDF Tools", "AI Assistant", "eSign Documents", "Business Tools", "Content Creation"];

  const tagToCategoryMap: { [key: string]: Category } = {
    "PDF Tools": Category.DOCUMENTS,
    "AI Assistant": Category.AI,
    "eSign Documents": Category.DOCUMENTS,
    "Business Tools": Category.BUSINESS,
    "Content Creation": Category.AI,
  };

  const handleTagClick = (tag: string) => {
    const category = tagToCategoryMap[tag];
    if (category) {
      setActiveCategory(category);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-slate-950 -z-20"></div>
      <div className="absolute left-0 bottom-0 w-full h-[300px] bg-[radial-gradient(ellipse_at_bottom,_rgba(99,102,241,0.15)_0%,_transparent_70%)] -z-10"></div>
      
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center justify-center lg:justify-between gap-12 w-full pt-20 pb-16 lg:py-0">
        
        {/* Text Content */}
        <div className="text-center lg:text-left z-10 lg:w-1/2 flex-shrink-0">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-heading tracking-tighter text-white">
            Unlock Limitless
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-500">
              Productivity
            </span>
          </h1>
          <div className="flex flex-wrap gap-3 mt-8 justify-center lg:justify-start">
            {tags.map((tag) => (
              <a
                key={tag}
                href="#tools"
                onClick={() => handleTagClick(tag)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-slate-300 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-colors duration-200"
              >
                {tag}
              </a>
            ))}
          </div>
        </div>
        
        {/* Image container */}
        <div className="lg:w-1/2 flex justify-center lg:justify-end">
            <img
              src="https://ik.imagekit.io/2sk0geeer/hero1.png?updatedAt=1757397204870"
              alt="Person with a laptop representing productivity and AI"
              className="w-full h-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-none"
            />
        </div>
      </div>
    </section>
  );
};

export default Hero;
