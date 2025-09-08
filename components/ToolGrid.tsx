import React, { useState, useMemo } from 'react';
import { Tool, Category } from '../types';
import ToolCard from './ToolCard';

interface ToolGridProps {
  tools: Tool[];
  searchQuery: string;
}

const categoryColorMap: Record<Category, string> = {
  [Category.DOCUMENTS]: '#3b82f6', // blue-500
  [Category.BUSINESS]: '#22c55e', // green-500
  [Category.AI]: '#a855f7', // purple-500
  [Category.MARITIME]: '#22d3ee', // cyan-400
};

const ToolGrid: React.FC<ToolGridProps> = ({ tools, searchQuery }) => {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');

  const filteredTools = useMemo(() => {
    const categoryFiltered = activeCategory === 'all'
      ? tools
      : tools.filter(tool => tool.category === activeCategory);
    
    if (!searchQuery) {
      return categoryFiltered;
    }
    
    return categoryFiltered.filter(tool => 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeCategory, searchQuery, tools]);

  const categories: (Category | 'all')[] = ['all', ...Object.values(Category)];

  const getCategoryName = (category: Category | 'all'): string => {
    if (category === 'all') return 'All Tools';
    if (category === Category.MARITIME) return 'Maritime';
    return category.split(' ')[0];
  };

  return (
    <div>
      <div className="flex justify-center flex-wrap gap-2 sm:gap-3 mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 ${
              activeCategory === cat
                ? 'bg-primary text-slate-900 shadow-md border border-primary'
                : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800/50 dark:text-gray-300 dark:hover:bg-slate-700 border border-slate-200 dark:border-transparent'
            }`}
          >
            {getCategoryName(cat)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.length > 0 ? filteredTools.map(tool => (
          <ToolCard key={tool.name} tool={tool} accentColor={categoryColorMap[tool.category]} />
        )) : (
          <div className="col-span-full text-center py-12">
            <p className="text-xl text-slate-500 dark:text-gray-400">No tools found for your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolGrid;