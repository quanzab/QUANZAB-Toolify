import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import ToolPageLayout from '../components/ToolPageLayout';
import Loader from '../components/Loader';
import { WandIcon } from '../components/Icons';

const AiKeywordExtractorPage: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [keywords, setKeywords] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleExtract = async () => {
        if (!inputText.trim()) {
            setError('Please enter some text to analyze.');
            return;
        }
        if (!process.env.API_KEY) {
            setError('The API_KEY environment variable is not set. This feature is currently unavailable.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setKeywords([]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ parts: [{ text: `Extract the most relevant keywords from the following text:\n\n${inputText}` }] }],
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            keywords: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.STRING
                                }
                            }
                        }
                    },
                },
            });
            const parsedData: { keywords: string[] } = JSON.parse(response.text);
            setKeywords(parsedData.keywords);

        } catch (e) {
            console.error(e);
            setError('An AI error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyAll = () => {
        if (keywords.length > 0) {
            navigator.clipboard.writeText(keywords.join(', ')).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        }
    };

    return (
        <ToolPageLayout
            title="AI Keyword Extractor"
            description="Automatically identify and extract the most relevant keywords and topics from your text."
        >
            <div className="space-y-6">
                <div>
                    <label htmlFor="input-text" className="block font-semibold mb-2 text-slate-800 dark:text-gray-200">
                        Your Text
                    </label>
                    <textarea
                        id="input-text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        rows={8}
                        className="w-full p-3 border rounded-md bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary shadow-sm dark:shadow-none"
                        placeholder="Paste your article, report, or any text here..."
                    />
                </div>
                
                <div className="text-center">
                    <button
                        onClick={handleExtract}
                        disabled={isLoading || !inputText}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-12 py-4 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg shadow-primary/20 hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        <WandIcon className="w-6 h-6" />
                        {isLoading ? 'Extracting...' : 'Extract Keywords'}
                    </button>
                </div>

                {error && <p className="text-red-500 text-center font-semibold">{error}</p>}
                
                {isLoading && <Loader message="AI is analyzing your text for keywords..." />}

                {keywords.length > 0 && (
                    <div className="mt-6 border-t pt-6 border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Extracted Keywords</h3>
                            <button
                                onClick={handleCopyAll}
                                className="px-3 py-1.5 text-sm font-semibold text-slate-800 dark:text-gray-200 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors shadow-sm"
                            >
                                {copied ? 'Copied!' : 'Copy All'}
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-3 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-md border border-slate-200 dark:border-slate-700 shadow-inner">
                            {keywords.map((keyword, index) => (
                                <span key={index} className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-primary font-semibold rounded-full shadow-sm">
                                    {keyword}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </ToolPageLayout>
    );
};

export default AiKeywordExtractorPage;