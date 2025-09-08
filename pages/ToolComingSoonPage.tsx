import React from 'react';
import { Link } from 'react-router-dom';
import ToolPageLayout from '../components/ToolPageLayout';
import { Tool } from '../types';

interface ToolComingSoonPageProps {
  tool: Tool;
}

const ToolComingSoonPage: React.FC<ToolComingSoonPageProps> = ({ tool }) => {
  return (
    <ToolPageLayout title={tool.name} description={tool.description}>
      <div className="text-center py-10">
        <div className="p-6 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 max-w-lg mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Feature Under Development</h2>
            <p className="text-slate-600 dark:text-gray-400">
              We're working hard to bring you this tool. It will be available in a future update. Stay tuned!
            </p>
        </div>
        <Link
          to="/"
          className="inline-block mt-8 px-8 py-3 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg shadow-primary/20 hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
        >
          Back to All Tools
        </Link>
      </div>
    </ToolPageLayout>
  );
};

export default ToolComingSoonPage;