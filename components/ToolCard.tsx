import React from 'react';
import { Link } from 'react-router-dom';
import { Tool } from '../types';
import { StarIcon } from './Icons';

interface ToolCardProps {
  tool: Tool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const { name, description, icon: Icon, premium, path } = tool;

  return (
    <Link to={path} className="block group h-full">
      <div className="relative bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out overflow-hidden h-full">
        {premium && (
          <div className="absolute top-0 right-0 bg-brand-accent text-white px-3 py-1 text-xs font-bold rounded-bl-lg flex items-center gap-1 z-10">
            <StarIcon className="w-3 h-3" />
            PRO
          </div>
        )}
        <div className="flex flex-col items-start h-full">
          <div className="flex-shrink-0 mb-4">
            <div className="p-3 bg-brand-light dark:bg-gray-700 rounded-lg inline-block group-hover:bg-brand-primary transition-colors duration-300">
              <Icon className="h-8 w-8 text-brand-primary group-hover:text-white transition-colors duration-300" />
            </div>
          </div>
          <h3 className="text-xl font-bold font-heading text-brand-dark dark:text-gray-100 mb-2">{name}</h3>
          <p className="text-gray-600 dark:text-gray-400 flex-grow">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default ToolCard;