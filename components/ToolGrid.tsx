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
    <div>
      <div className="flex justify-center flex-wrap gap-2 sm:gap-3 mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 ${
              activeCategory === cat
                ? 'bg-white text-slate-900 shadow-md'
                : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700'
            }`}
          >
            {cat === 'all' ? 'All Tools' : cat.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map(tool => (
          <ToolCard key={tool.name} tool={tool} />
        ))}
      </div>
    </div>
  );
};

export default ToolGrid;
