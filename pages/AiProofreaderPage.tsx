import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import ToolPageLayout from '../components/ToolPageLayout';
import Loader from '../components/Loader';
import { WandIcon } from '../components/Icons';

interface Correction {
    errorText: string;
    suggestion: string;
    explanation: string;
    type: 'Grammar' | 'Spelling' | 'Style' | 'Punctuation' | 'Other';
}

const AiProofreaderPage: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [corrections, setCorrections] = useState<Correction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleProofread = async () => {
        if (!inputText.trim()) {
            setError('Please enter some text to proofread.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setCorrections([]);

        const prompt = `Proofread the following text. Identify any grammar, spelling, style, or punctuation errors. For each error, provide the original text with the error, a suggestion for correction, a brief explanation, and the type of error.

Text to proofread:
"${inputText}"`;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ parts: [{ text: prompt }] }],
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            corrections: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        errorText: { type: Type.STRING, description: "The specific text containing the error." },
                                        suggestion: { type: Type.STRING, description: "The suggested correction for the error." },
                                        explanation: { type: Type.STRING, description: "A brief explanation of why it's an error." },
                                        type: { type: Type.STRING, description: "The type of error (e.g., 'Grammar', 'Spelling', 'Style')." }
                                    }
                                }
                            }
                        }
                    },
                },
            });

            const parsedData: { corrections: Correction[] } = JSON.parse(response.text);
            if (parsedData.corrections && parsedData.corrections.length > 0) {
                 setCorrections(parsedData.corrections);
            } else {
                setCorrections([{
                    errorText: "No errors found!",
                    suggestion: "Your text looks great.",
                    explanation: "The AI analysis did not detect any significant grammatical, spelling, or style issues.",
                    type: "Other"
                }]);
            }

        } catch (e) {
            console.error(e);
            setError('An AI error occurred. Please try again or rephrase your text.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const getTagColor = (type: Correction['type']) => {
        switch(type) {
            case 'Grammar': return 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-500/50';
            case 'Spelling': return 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300 border-red-500/50';
            case 'Style': return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300 border-yellow-500/50';
            case 'Punctuation': return 'bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 border-purple-500/50';
            default: return 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300 border-green-500/50';
        }
    };

    return (
        <ToolPageLayout
            title="AI Proofreader"
            description="Check your text for grammar, spelling, and style errors. Get AI-powered suggestions for improvement."
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
                        placeholder="Paste your text here to find and fix errors..."
                    />
                </div>
                
                <div className="text-center">
                    <button
                        onClick={handleProofread}
                        disabled={isLoading || !inputText}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-12 py-4 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg shadow-primary/20 hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        <WandIcon className="w-6 h-6" />
                        {isLoading ? 'Analyzing...' : 'Proofread Text'}
                    </button>
                </div>

                {error && <p className="text-red-500 text-center font-semibold">{error}</p>}
                
                {isLoading && <Loader message="AI is proofreading your text..." />}

                {corrections.length > 0 && !isLoading && (
                    <div className="mt-6 border-t pt-6 border-slate-200 dark:border-slate-700">
                        <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Suggestions</h3>
                        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                            {corrections.map((correction, index) => (
                                <div key={index} className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                                        <p className="line-through text-red-600 dark:text-red-400 italic">"{correction.errorText}"</p>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getTagColor(correction.type)}`}>{correction.type}</span>
                                    </div>
                                    <p className="text-green-600 dark:text-green-400 font-semibold">"{correction.suggestion}"</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{correction.explanation}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </ToolPageLayout>
    );
};

export default AiProofreaderPage;