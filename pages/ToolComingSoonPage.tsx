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
        <h2 className="text-3xl font-bold mb-4 text-white">Coming Soon!</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          We're working hard to bring you this tool. It will be available in a future update. Stay tuned!
        </p>
        <Link
          to="/"
          className="inline-block px-8 py-3 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg shadow-primary/20 hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
        >
          Back to All Tools
        </Link>
      </div>
    </ToolPageLayout>
  );
};

export default ToolComingSoonPage;