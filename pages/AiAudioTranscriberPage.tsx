import React from 'react';
import { Link } from 'react-router-dom';
import ToolPageLayout from '../components/ToolPageLayout';
import { AudioIcon } from '../components/Icons';

const AiAudioTranscriberPage: React.FC = () => {
  return (
    <ToolPageLayout
      title="AI Audio Transcriber"
      description="Convert speech from audio files into accurate, searchable text."
    >
      <div className="text-center py-10">
        <AudioIcon className="w-16 h-16 mx-auto text-primary mb-4" />
        <h2 className="text-3xl font-bold mb-4 text-white">Feature Under Development</h2>
        <p className="text-gray-400 mb-6 max-w-lg mx-auto">
          Our team is developing a state-of-the-art AI transcription tool to provide fast and accurate audio-to-text conversion.
        </p>
        <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 text-left max-w-lg mx-auto">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200">What to Expect</h4>
            <p className="text-sm text-slate-600 dark:text-gray-400 mt-2">
                This upcoming premium feature will leverage advanced AI models to handle various audio formats and accents. We are focused on ensuring high accuracy and providing features like speaker identification and timestamping. Thank you for your patience as we build this powerful tool for you.
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

export default AiAudioTranscriberPage;