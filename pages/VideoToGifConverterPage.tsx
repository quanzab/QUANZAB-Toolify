import React from 'react';
import { Link } from 'react-router-dom';
import ToolPageLayout from '../components/ToolPageLayout';
import { VideoIcon } from '../components/Icons';

const VideoToGifConverterPage: React.FC = () => {
  return (
    <ToolPageLayout
      title="Video to GIF Converter"
      description="Create animated GIFs from video clips with custom settings."
    >
      <div className="text-center py-10">
        <VideoIcon className="w-16 h-16 mx-auto text-primary mb-4" />
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Feature Under Development</h2>
        <p className="text-slate-600 dark:text-gray-400 mb-6 max-w-lg mx-auto">
          We are actively engineering a high-performance, in-browser Video to GIF converter.
        </p>
        <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 text-left max-w-lg mx-auto">
            <h4 className="font-semibold text-slate-800 dark:text-gray-200">A Note on Browser-Based Video Processing</h4>
            <p className="text-sm text-slate-600 dark:text-gray-400 mt-2">
                Video encoding and manipulation are computationally intensive tasks traditionally handled by powerful servers. Bringing this functionality directly into your browser requires cutting-edge technologies like WebAssembly to run highly optimized code securely on your machine.
                <br/><br/>
                Our commitment is to your privacy and data security, which means we will never upload your video files to a server for processing. We are perfecting this complex, client-side solution and appreciate your patience.
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

export default VideoToGifConverterPage;
