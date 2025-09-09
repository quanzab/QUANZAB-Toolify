import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import ToolPageLayout from '../components/ToolPageLayout';
import Loader from '../components/Loader';
import { WandIcon } from '../components/Icons';

const AiDataExtractorPage: React.FC = () => {
    const [sourceText, setSourceText] = useState('');
    const [query, setQuery] = useState('');
    const [extractedData, setExtractedData] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleExtract = async () => {
        if (!sourceText.trim() || !query.trim()) {
            setError('Please provide both source text and an extraction query.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setExtractedData('');

        const prompt = `From the text provided below, extract the following information: "${query}". Format the output cleanly, using Markdown for tables if appropriate.

---
TEXT:
${sourceText}
---`;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ parts: [{ text: prompt }] }],
            });
            setExtractedData(response.text.trim());
        } catch (e) {
            console.error(e);
            setError('An AI error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (extractedData) {
            navigator.clipboard.writeText(extractedData).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        }
    };

    return (
        <ToolPageLayout
            title="AI Data Extractor"
            description="Extract structured data like tables or lists from unstructured text."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inputs */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="source-text" className="block font-semibold mb-2 text-slate-800 dark:text-gray-200">
                            Source Text
                        </label>
                        <textarea
                            id="source-text"
                            value={sourceText}
                            onChange={(e) => setSourceText(e.target.value)}
                            rows={15}
                            className="w-full p-3 border rounded-md bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary shadow-sm"
                            placeholder="Paste the text you want to extract data from..."
                        />
                    </div>
                    <div>
                        <label htmlFor="query" className="block font-semibold mb-2 text-slate-800 dark:text-gray-200">
                            What to Extract?
                        </label>
                        <input
                            id="query"
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full p-3 border rounded-md bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary shadow-sm"
                            placeholder="e.g., a table of employees and their roles"
                        />
                    </div>
                    <button
                        onClick={handleExtract}
                        disabled={isLoading || !sourceText || !query}
                        className="w-full inline-flex items-center justify-center gap-2 px-12 py-3 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg hover:bg-opacity-90 disabled:bg-slate-600"
                    >
                        <WandIcon className="w-6 h-6" />
                        {isLoading ? 'Extracting...' : 'Extract Data'}
                    </button>
                </div>

                {/* Output */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-200">Extracted Data</h3>
                        {extractedData && (
                             <button onClick={handleCopy} className="px-3 py-1.5 text-sm font-semibold text-slate-800 dark:text-gray-200 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 shadow-sm">
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        )}
                    </div>
                    <div className="w-full h-[32rem] p-3 border rounded-md bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-inner overflow-y-auto">
                        {isLoading ? <Loader message="AI is extracting data..." /> : (
                            <pre className="whitespace-pre-wrap font-sans text-slate-800 dark:text-gray-200">
                                {extractedData || "Results will appear here..."}
                            </pre>
                        )}
                    </div>
                     {error && <p className="text-red-500 text-center font-semibold mt-2">{error}</p>}
                </div>
            </div>
        </ToolPageLayout>
    );
};

export default AiDataExtractorPage;