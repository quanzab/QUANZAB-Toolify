import React from 'react';
import { Link } from 'react-router-dom';
import { Tool } from '../types';
import { StarIcon } from './Icons';

interface ToolCardProps {
  tool: Tool;
  accentColor: string;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, accentColor }) => {
  const { name, description, icon: Icon, premium, path, tags } = tool;
  const cardStyle = { '--accent-color': accentColor } as React.CSSProperties;
  
  const tagColors: { [key: string]: string } = {
    'AI': 'bg-secondary/20 text-secondary-300 border-secondary/50',
    'New': 'bg-green-500/20 text-green-300 border-green-500/50',
    'Popular': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
  };

  return (
    <Link to={path} style={cardStyle} className="block group h-full relative [perspective:1000px]">
       <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--accent-color)] to-primary rounded-xl blur opacity-0 group-hover:opacity-70 transition-all duration-300"></div>
      <div className="relative bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 ease-in-out h-full transform group-hover:-translate-y-2 group-hover:rotate-x-3 group-hover:-rotate-y-2">
        <div className="flex justify-between items-start">
            <div className="flex-shrink-0 mb-4">
                <div className="relative group p-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg inline-block transition-colors duration-300">
                    <div className="absolute -inset-px bg-[var(--accent-color)] rounded-lg blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                    <Icon className="relative h-8 w-8 text-[var(--accent-color)] group-hover:text-white transition-colors duration-300" />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 whitespace-nowrap">
                        {name}
                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
                    </span>
                </div>
            </div>
            <div className="flex gap-2">
                {tags?.map(tag => (
                    <span key={tag} className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${tagColors[tag] || 'bg-slate-700'}`}>{tag}</span>
                ))}
            </div>
        </div>
        
        {premium && (
          <div className="absolute top-0 right-0 bg-gradient-to-r from-secondary to-primary text-white px-3 py-1 text-xs font-bold rounded-tr-xl rounded-bl-lg flex items-center gap-1 z-10">
            <StarIcon className="w-3 h-3" />
            PRO
          </div>
        )}
        <div className="flex flex-col items-start h-full">
          <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-gray-100 mb-2">{name}</h3>
          <p className="text-slate-600 dark:text-gray-300 text-base flex-grow">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default ToolCard;