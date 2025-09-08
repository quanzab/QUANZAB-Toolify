

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ToolGrid from '../components/ToolGrid';
import TrustSection from '../components/TrustSection';
import CtaBanner from '../components/CtaBanner';
import TestimonialSection from '../components/TestimonialSection';
import { tools } from '../data/tools';
import { Category } from '../types';

const categoryColorMap: Record<Category, string> = {
  [Category.DOCUMENTS]: '#3b82f6',
  [Category.BUSINESS]: '#22c55e',
  [Category.AI]: '#a855f7',
  [Category.MARITIME]: '#22d3ee',
};

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const featuredTools = tools.filter(t => t.featured);
  const nonFeaturedTools = tools.filter(t => !t.featured);

  return (
    <>
      <Hero />
      <TrustSection />

      {/* Featured Tools Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold font-heading text-slate-900 dark:text-white">
            Featured Tools
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-gray-400">
            Get started with our most powerful and popular AI-driven solutions.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredTools.map(tool => {
            const { name, description, icon: Icon, path, tags } = tool;
            const accentColor = categoryColorMap[tool.category];
            const cardStyle = { '--accent-color': accentColor } as React.CSSProperties;

            return (
              <Link to={path} key={name} style={cardStyle} className="block group relative bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 transition-all duration-300 ease-in-out transform hover:-translate-y-2 overflow-hidden shadow-lg hover:shadow-xl">
                <div className="absolute -inset-px bg-gradient-to-r from-[var(--accent-color)] to-primary rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg inline-block shadow-sm dark:shadow-none">
                      <Icon className="h-10 w-10 text-[var(--accent-color)]" />
                    </div>
                    {tags?.map(tag => (
                      <span key={tag} className="px-3 py-1 text-sm font-semibold rounded-full bg-secondary/20 text-secondary-300 border border-secondary/50">{tag}</span>
                    ))}
                  </div>
                  <h3 className="text-3xl font-bold font-heading text-slate-900 dark:text-gray-100 mt-6 mb-3">{name}</h3>
                  <p className="text-slate-600 dark:text-gray-300 text-lg">{description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
      
      <main id="tools" className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 relative z-10">
        <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold font-heading text-slate-900 dark:text-white">
                An Entire Suite of Tools, Right Here.
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-gray-400">
                Everything you need to enhance productivity and streamline your workflows.
            </p>
        </div>
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-sm p-4 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl">
            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-8">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for a tool..."
                        className="block w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full py-3 pl-10 pr-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                    />
                </div>
            </div>
            <ToolGrid tools={nonFeaturedTools} searchQuery={searchQuery} />
        </div>
      </main>

      <TestimonialSection />
      <CtaBanner />
    </>
  );
};

export default HomePage;