import React from 'react';
import { Link } from 'react-router-dom';
import ToolPageLayout from '../components/ToolPageLayout';
import { VideoIcon } from '../components/Icons';

const VideoEditorPage: React.FC = () => {
  return (
    <ToolPageLayout
      title="Video Editor"
      description="Trim, merge, and add captions to video files."
    >
      <div className="text-center py-10">
        <VideoIcon className="w-16 h-16 mx-auto text-primary mb-4" />
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Feature Under Development</h2>
        <p className="text-slate-600 dark:text-gray-400 mb-6 max-w-lg mx-auto">
          We are building a powerful, browser-based video editor to give you full control over your media without sacrificing privacy.
        </p>
        <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 text-left max-w-lg mx-auto">
            <h4 className="font-semibold text-slate-800 dark:text-gray-200">Advanced In-Browser Processing</h4>
            <p className="text-sm text-slate-600 dark:text-gray-400 mt-2">
              Video editing requires intensive processing. Our team is engineering an efficient solution using WebAssembly and other modern web technologies to bring this powerful tool to you, right in your browser, without compromising your privacy by uploading files to a server. This ensures your data stays on your device while providing a seamless editing experience.
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

export default VideoEditorPage;