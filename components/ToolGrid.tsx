import React, { useState, useMemo } from 'react';
import { tools } from '../data/tools';
import { Category } from '../types';
import ToolCard from './ToolCard';

const ToolGrid: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');

  const filteredTools = useMemo(() => {
    if (activeCategory === 'all') {
      return tools;
    }
    return tools.filter(tool => tool.category === activeCategory);
  }, [activeCategory]);

  const categories: (Category | 'all')[] = ['all', ...Object.values(Category)];

  return (
    <section id="tools" className="py-20 sm:py-24 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-brand-dark dark:text-white">Our Powerful Suite of Tools</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            Select a category to find the perfect tool for your task.
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-2 sm:gap-4 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base font-semibold rounded-full transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-brand-primary text-white shadow-md'
                  : 'bg-brand-light dark:bg-gray-800 text-brand-dark dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat === 'all' ? 'All Tools' : cat.split(' ')[0]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredTools.map(tool => (
            <ToolCard key={tool.name} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolGrid;