
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
        if (!import.meta.env.VITE_API_KEY) {
            setError("VITE_API_KEY is not configured. This AI feature is currently unavailable.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);
        setSources([]);

        try {
            const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
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
            setError('An AI error occurred. The search may be unavailable or your query could not be processed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ToolPageLayout
            title="AI Research Assistant"
            description="Ask questions about current events or topics requiring up-to-date information. Get AI-powered answers grounded in Google Search results."
        >
            <div className="space-y-6">
                <div className="flex gap-2">
                    <input
                        id="query"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-grow p-3 border rounded-md bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary shadow-sm dark:shadow-none"
                        placeholder="e.g., Who won the latest F1 Grand Prix?"
                        onKeyPress={e => e.key === 'Enter' && !isLoading && handleResearch()}
                    />
                    <button
                        onClick={handleResearch}
                        disabled={isLoading || !query}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-slate-900 bg-primary rounded-lg shadow-lg hover:bg-opacity-90 disabled:bg-slate-600"
                    >
                        <ResearchIcon className="w-5 h-5" />
                        {isLoading ? 'Researching...' : 'Research'}
                    </button>
                </div>

                {error && <p className="text-red-500 text-center font-semibold">{error}</p>}
                
                {isLoading && <Loader message="AI is searching the web for answers..." />}

                {result && (
                    <div className="mt-6 border-t pt-6 border-slate-200 dark:border-slate-700 space-y-4">
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Answer</h3>
                            <p className="whitespace-pre-wrap p-4 bg-slate-100 dark:bg-slate-800/50 rounded-md border border-slate-200 dark:border-slate-700">{result}</p>
                        </div>
                        {sources.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">Sources</h3>
                                <ul className="space-y-2">
                                    {sources.map((source, index) => (
                                        <li key={index} className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-md border border-slate-200 dark:border-slate-700">
                                            <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold break-all">
                                                {source.web.title || source.web.uri}
                                            </a>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{source.web.uri}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ToolPageLayout>
    );
};

export default AiResearchAssistantPage;
