
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import ToolPageLayout from '../components/ToolPageLayout';
import Loader from '../components/Loader';
import { WandIcon } from '../components/Icons';

const AiAutoTaggerPage: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleExtract = async () => {
        if (!inputText.trim()) {
            setError('Please enter some text to analyze.');
            return;
        }
        if (!import.meta.env.VITE_API_KEY) {
            setError("AI features are disabled. Add VITE_API_KEY in Vercel settings.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setTags([]);

        try {
            const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ parts: [{ text: `Analyze the following text and generate a list of relevant category tags. These tags should describe the text's subject matter (e.g., 'Technology', 'Healthcare', 'Legal Document').\n\nText: "${inputText}"` }] }],
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            tags: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.STRING,
                                    description: "A category tag describing the text."
                                }
                            }
                        }
                    },
                },
            });
            const parsedData: { tags: string[] } = JSON.parse(response.text);
            setTags(parsedData.tags);

        } catch (e) {
            console.error(e);
            setError('An AI error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyAll = () => {
        if (tags.length > 0) {
            navigator.clipboard.writeText(tags.join(', ')).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        }
    };

    return (
        <ToolPageLayout
            title="AI Auto-Tagger"
            description="Automatically analyze text and generate relevant category tags to help with organization."
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
                        placeholder="Paste your article, report, or any text here to generate tags..."
                    />
                </div>
                
                <div className="text-center">
                    <button
                        onClick={handleExtract}
                        disabled={isLoading || !inputText}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-12 py-4 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg shadow-primary/20 hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        <WandIcon className="w-6 h-6" />
                        {isLoading ? 'Generating Tags...' : 'Generate Tags'}
                    </button>
                </div>

                {error && <p className="text-red-500 text-center font-semibold">{error}</p>}
                
                {isLoading && <Loader message="AI is analyzing your text..." />}

                {tags.length > 0 && (
                    <div className="mt-6 border-t pt-6 border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Generated Tags</h3>
                            <button
                                onClick={handleCopyAll}
                                className="px-3 py-1.5 text-sm font-semibold text-slate-800 dark:text-gray-200 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors shadow-sm"
                            >
                                {copied ? 'Copied!' : 'Copy All'}
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-3 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-md border border-slate-200 dark:border-slate-700 shadow-inner">
                            {tags.map((tag, index) => (
                                <span key={index} className="px-3 py-1 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 font-semibold rounded-full shadow-sm border border-cyan-500/50">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </ToolPageLayout>
    );
};

export default AiAutoTaggerPage;
