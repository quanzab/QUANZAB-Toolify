import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import ToolPageLayout from '../components/ToolPageLayout';
import Loader from '../components/Loader';

const TextSummarizerPage: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to summarize.');
      return;
    }

    if (!process.env.API_KEY) {
        setError("AI features are disabled. The API_KEY environment variable is not set. Please add it to your hosting provider's settings to use this tool.");
        return;
    }

    setIsLoading(true);
    setError(null);
    setSummary('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: `Summarize the following text:\n\n${inputText}` }] }],
      });
      setSummary(response.text);
    } catch (e) {
      console.error(e);
      setError('An error occurred while summarizing the text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (summary) {
      navigator.clipboard.writeText(summary).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <ToolPageLayout
      title="Text Summarizer"
      description="Get the key points from long articles, papers, or documents instantly using AI."
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="input-text" className="block font-semibold mb-2 text-slate-800 dark:text-gray-200">
            Paste your text below
          </label>
          <textarea
            id="input-text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={10}
            className="w-full p-3 border rounded-md bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary shadow-sm dark:shadow-none"
            placeholder="Enter a long piece of text here..."
            aria-label="Text input for summarization"
          ></textarea>
        </div>

        <div className="text-center">
          <button
            onClick={handleSummarize}
            disabled={isLoading || !inputText}
            className="w-full sm:w-auto px-12 py-4 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg hover:bg-opacity-90 disabled:bg-slate-600"
          >
            {isLoading ? 'Summarizing...' : 'Summarize Text'}
          </button>
        </div>

        {error && <p className="text-red-500 text-center font-semibold" role="alert">{error}</p>}
        
        {isLoading && <Loader message="AI is reading and summarizing..." />}

        {summary && (
          <div role="region" aria-labelledby="summary-heading">
            <div className="flex justify-between items-center mt-6 border-t pt-4 border-slate-200 dark:border-slate-700">
              <h3 id="summary-heading" className="text-xl font-bold text-slate-900 dark:text-white">Summary</h3>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 text-sm font-semibold text-slate-800 dark:text-gray-200 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors shadow-sm"
                aria-label="Copy summary to clipboard"
              >
                {copied ? 'Copied!' : 'Copy Summary'}
              </button>
            </div>
            <div className="mt-2 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-md whitespace-pre-wrap shadow-inner border border-slate-200 dark:border-slate-700">
              {summary}
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
};

export default TextSummarizerPage;