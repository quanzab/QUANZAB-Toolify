import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import ToolPageLayout from '../components/ToolPageLayout';
import Loader from '../components/Loader';
import { ResearchIcon } from '../components/Icons';

// FIX: Made `uri` and `title` optional to match the type from the @google/genai library.
interface GroundingChunk {
  web: {
    uri?: string;
    title?: string;
  };
}

const AiResearchAssistantPage: React.FC = () => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const [sources, setSources] = useState<GroundingChunk[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleResearch = async () => {
        if (!query.trim()) {
            setError('Please enter a question to research.');
            return;
        }
        if (!process.env.API_KEY) {
            setError('The API_KEY environment variable is not set. This feature is currently unavailable.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        setSources([]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: query,
                config: {
                    tools: [{ googleSearch: {} }],
                },
            });

            setResult(response.text);
            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
            if (groundingChunks) {
                setSources(groundingChunks as GroundingChunk[]);
            }

        } catch (e) {
            console.error(e);
            setError('An AI error occurred. Please try again or refine your query.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ToolPageLayout
            title="AI Research Assistant"
            description="Get AI-powered answers grounded in real-time Google Search results for up-to-date information."
        >
            <div className="space-y-6">
                <div>
                    <label htmlFor="query-input" className="block font-semibold mb-2 text-slate-800 dark:text-gray-200">
                        Your Question
                    </label>
                    <textarea
                        id="query-input"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        rows={3}
                        className="w-full p-3 border rounded-md bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary shadow-sm dark:shadow-none"
                        placeholder="e.g., Who won the latest Formula 1 race and what were the key moments?"
                    />
                </div>

                <div className="text-center">
                    <button
                        onClick={handleResearch}
                        disabled={isLoading || !query}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-12 py-4 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg shadow-primary/20 hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        <ResearchIcon className="w-6 h-6" />
                        {isLoading ? 'Researching...' : 'Get Answer'}
                    </button>
                </div>

                {error && <p className="text-red-500 text-center font-semibold" role="alert">{error}</p>}
                
                {isLoading && <Loader message="Searching the web and synthesizing an answer..." />}

                {result && (
                    <div className="mt-6 border-t pt-6 border-slate-200 dark:border-slate-700">
                        <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Answer</h3>
                        <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-md whitespace-pre-wrap text-slate-800 dark:text-gray-300 shadow-inner border border-slate-200 dark:border-slate-700">
                            {result}
                        </div>
                        
                        {sources.length > 0 && (
                            <div className="mt-6">
                                <h4 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Sources</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* FIX: Add a guard to ensure source.web.uri exists before rendering the link. */}
                                    {sources.map((source, index) => (
                                        source.web.uri &&
                                        <a
                                            key={index}
                                            href={source.web.uri}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-primary transition-colors shadow-sm dark:shadow-none"
                                        >
                                            <p className="font-semibold text-primary truncate">{source.web.title || "Untitled Source"}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{source.web.uri}</p>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ToolPageLayout>
    );
};

export default AiResearchAssistantPage;