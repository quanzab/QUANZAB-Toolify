
import React from 'react';
import { Link } from 'react-router-dom';
import { Tool } from '../types';
import { StarIcon } from './Icons';

interface ToolCardProps {
  tool: Tool;
  accentColor: string;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, accentColor }) => {
  const { name, description, icon: Icon, path } = tool;
  const cardStyle = { '--accent-color': accentColor } as React.CSSProperties;

  // FIX: Explicitly type `displayTags` to include 'PRO' to prevent type errors when adding it.
  const displayTags: ('New' | 'Popular' | 'AI' | 'PRO')[] = [...(tool.tags || [])];
  if (tool.premium) {
    displayTags.unshift('PRO');
  }
  
  const tagColors: { [key: string]: string } = {
    'AI': 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/50',
    'New': 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/50',
    'Popular': 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-500/20 dark:text-fuchsia-300 dark:border-fuchsia-500/50',
    'PRO': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/50',
  };

  return (
    <Link to={path} style={cardStyle} className="block group h-full relative [perspective:1000px]">
       <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--accent-color)] to-primary rounded-xl blur opacity-0 group-hover:opacity-70 transition-all duration-300"></div>
      <div className="relative bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 ease-in-out h-full transform group-hover:-translate-y-1 shadow-md hover:shadow-xl dark:shadow-none">
        <div className="flex justify-between items-start mb-4">
            <div className="flex-shrink-0">
                <div className="relative group p-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg inline-block transition-colors duration-300 shadow-sm dark:shadow-none">
                    <div className="absolute -inset-px bg-[var(--accent-color)] rounded-lg blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                    <Icon className="relative h-8 w-8 text-[var(--accent-color)] group-hover:text-white transition-colors duration-300" />
                </div>
            </div>
            <div className="flex gap-1.5 flex-wrap justify-end flex-shrink-0 pl-4">
                {displayTags.map(tag => (
                    <span key={tag} className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full border border-transparent ${tagColors[tag] || 'bg-slate-200 dark:bg-slate-700'}`}>
                       {tag === 'PRO' && <StarIcon className="w-3 h-3" />}
                       {tag}
                    </span>
                ))}
            </div>
        </div>
        
        <div className="flex flex-col items-start h-full">
          <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-gray-100 mb-2">{name}</h3>
          <p className="text-slate-600 dark:text-gray-300 text-base flex-grow">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default ToolCard;