
import React from 'react';

interface ToolPageLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const ToolPageLayout: React.FC<ToolPageLayoutProps> = ({ title, description, children }) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 py-12 sm:py-16 flex-grow">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold font-heading text-slate-900 dark:text-white">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-gray-400">
            {description}
          </p>
        </div>
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-950 p-6 sm:p-8 rounded-2xl shadow-2xl border border-transparent dark:border-slate-800">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ToolPageLayout;