import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import ToolPageLayout from '../components/ToolPageLayout';
import Loader from '../components/Loader';
import { WandIcon } from '../components/Icons';

type ContentType = 'Blog Post' | 'Marketing Email' | 'Social Media Post' | 'Poem' | 'Ad Copy';
type Tone = 'Professional' | 'Casual' | 'Witty' | 'Formal' | 'Enthusiastic' | 'Humorous';

const contentTypes: ContentType[] = ['Blog Post', 'Marketing Email', 'Social Media Post', 'Poem', 'Ad Copy'];
const tones: Tone[] = ['Professional', 'Casual', 'Witty', 'Formal', 'Enthusiastic', 'Humorous'];

const AiContentGeneratorPage: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [contentType, setContentType] = useState<ContentType>('Blog Post');
    const [tone, setTone] = useState<Tone>('Professional');
    const [generatedContent, setGeneratedContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a topic or prompt.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedContent('');

        const fullPrompt = `Generate a "${contentType}" with a "${tone}" tone about the following topic: ${prompt}.`;

        try {
            // FIX: Use process.env.API_KEY as per guidelines.
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ parts: [{ text: fullPrompt }] }],
            });
            setGeneratedContent(response.text.trim());
        } catch (e) {
            console.error(e);
            setError('An AI error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (generatedContent) {
            navigator.clipboard.writeText(generatedContent).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        }
    };

    return (
        <ToolPageLayout
            title="AI Content Generator"
            description="Generate blog posts, emails, and more from a simple text prompt. Choose your tone and style."
        >
            <div className="space-y-6">
                <div>
                    <label htmlFor="prompt" className="block font-semibold mb-2 text-gray-200">
                        What would you like to create?
                    </label>
                    <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={4}
                        className="w-full p-3 border rounded-md bg-slate-800 border-slate-600 focus:ring-2 focus:ring-primary"
                        placeholder="e.g., a blog post about the benefits of remote work"
                        aria-label="Content generation prompt"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="content-type" className="block font-semibold mb-2 text-gray-200">Content Type</label>
                        <select
                            id="content-type"
                            value={contentType}
                            onChange={(e) => setContentType(e.target.value as ContentType)}
                            className="w-full p-3 border rounded-md bg-slate-800 border-slate-600 focus:ring-2 focus:ring-primary"
                        >
                            {contentTypes.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="tone" className="block font-semibold mb-2 text-gray-200">Tone of Voice</label>
                        <select
                            id="tone"
                            value={tone}
                            onChange={(e) => setTone(e.target.value as Tone)}
                            className="w-full p-3 border rounded-md bg-slate-800 border-slate-600 focus:ring-2 focus:ring-primary"
                        >
                            {tones.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>

                <div className="text-center pt-4">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !prompt}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-12 py-4 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg shadow-primary/20 hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        <WandIcon className="w-6 h-6" />
                        {isLoading ? 'Generating...' : 'Generate Content'}
                    </button>
                </div>

                {error && <p className="text-red-500 text-center font-semibold" role="alert">{error}</p>}
                
                {isLoading && <Loader message="AI is crafting your content..." />}

                {generatedContent && (
                    <div role="region" aria-labelledby="generated-content-heading" className="mt-6 border-t pt-6 border-slate-700">
                        <div className="flex justify-between items-center mb-2">
                            <h3 id="generated-content-heading" className="text-xl font-bold">Generated Content</h3>
                            <button
                                onClick={handleCopy}
                                className="px-3 py-1.5 text-sm font-semibold text-gray-200 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors"
                                aria-label="Copy generated content to clipboard"
                            >
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <div className="mt-2 p-4 bg-slate-800/50 rounded-md whitespace-pre-wrap text-gray-300">
                            {generatedContent}
                        </div>
                    </div>
                )}
            </div>
        </ToolPageLayout>
    );
};

export default AiContentGeneratorPage;