
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import ToolPageLayout from '../components/ToolPageLayout';
import Loader from '../components/Loader';

const TextSummarizerPage: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to summarize.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSummary('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Summarize the following text:\n\n${inputText}`,
      });
      setSummary(response.text);
    } catch (e) {
      console.error(e);
      setError('An error occurred while summarizing the text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToolPageLayout
      title="Text Summarizer"
      description="Get the key points from long articles, papers, or documents instantly using AI."
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="input-text" className="block font-semibold mb-2">
            Paste your text below
          </label>
          <textarea
            id="input-text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={10}
            className="w-full p-3 border rounded-md dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-brand-primary"
            placeholder="Enter a long piece of text here..."
          ></textarea>
        </div>

        <div className="text-center">
          <button
            onClick={handleSummarize}
            disabled={isLoading || !inputText}
            className="w-full sm:w-auto px-12 py-4 text-lg font-semibold text-white bg-brand-primary rounded-lg shadow-lg hover:bg-blue-800 disabled:bg-gray-400"
          >
            {isLoading ? 'Summarizing...' : 'Summarize Text'}
          </button>
        </div>

        {error && <p className="text-red-500 text-center font-semibold">{error}</p>}
        
        {isLoading && <Loader message="AI is reading and summarizing..." />}

        {summary && (
          <div>
            <h3 className="text-xl font-bold mt-6 border-t pt-4 dark:border-gray-700">Summary</h3>
            <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md whitespace-pre-wrap">
              {summary}
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
};

export default TextSummarizerPage;
