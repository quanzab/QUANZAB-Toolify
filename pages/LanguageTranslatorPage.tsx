import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import ToolPageLayout from '../components/ToolPageLayout';
import Loader from '../components/Loader';
import { TranslateIcon } from '../components/Icons';

const languages = [
    "English", "Spanish", "French", "German", "Mandarin Chinese", "Japanese", 
    "Korean", "Russian", "Arabic", "Portuguese", "Italian", "Hindi"
];

const LanguageTranslatorPage: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [targetLanguage, setTargetLanguage] = useState('Spanish');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleTranslate = async () => {
        if (!inputText.trim()) {
            setError('Please enter text to translate.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setOutputText('');

        const prompt = `Translate the following text to ${targetLanguage}:\n\n"${inputText}"`;

        try {
            // FIX: Use process.env.API_KEY as per the coding guidelines.
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ parts: [{ text: prompt }] }],
            });
            setOutputText(response.text.trim());
        } catch (e) {
            console.error(e);
            setError('An AI error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (outputText) {
            navigator.clipboard.writeText(outputText).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        }
    };

    return (
        <ToolPageLayout
            title="Language Translator"
            description="Translate text between dozens of languages using the power of AI."
        >
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="input-text" className="block font-semibold mb-2 text-slate-800 dark:text-gray-200">Text to Translate</label>
                        <textarea
                            id="input-text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            rows={10}
                            className="w-full p-3 border rounded-md bg-slate-100 dark:bg-slate-800 border-transparent dark:border-slate-600 shadow-sm dark:shadow-none focus:ring-2 focus:ring-primary"
                            placeholder="Enter text here..."
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                           <label htmlFor="output-text" className="block font-semibold text-slate-800 dark:text-gray-200">Translated Text</label>
                           {outputText && (
                                <button onClick={handleCopy} className="px-3 py-1.5 text-sm font-semibold text-slate-800 dark:text-gray-200 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 shadow-sm">
                                {copied ? 'Copied!' : 'Copy'}
                                </button>
                           )}
                        </div>
                        <div className="w-full h-full p-3 border rounded-md bg-slate-100 dark:bg-slate-800/50 border-transparent dark:border-slate-600 whitespace-pre-wrap min-h-[236px] shadow-inner">
                            {isLoading ? <Loader message={`Translating to ${targetLanguage}...`} /> : outputText}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-4">
                    <div className="flex items-center gap-2">
                        <label htmlFor="language-select" className="font-semibold text-slate-800 dark:text-gray-200">Translate to:</label>
                        <select
                            id="language-select"
                            value={targetLanguage}
                            onChange={(e) => setTargetLanguage(e.target.value)}
                            className="p-2 border rounded-md bg-white dark:bg-slate-700 border-transparent dark:border-slate-600 shadow-sm dark:shadow-none focus:ring-2 focus:ring-primary"
                        >
                            {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                        </select>
                    </div>
                    <button
                        onClick={handleTranslate}
                        disabled={isLoading || !inputText}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-12 py-3 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg disabled:bg-slate-600"
                    >
                        <TranslateIcon className="w-6 h-6" />
                        {isLoading ? 'Translating...' : 'Translate'}
                    </button>
                </div>

                {error && <p className="text-red-500 text-center font-semibold">{error}</p>}
            </div>
        </ToolPageLayout>
    );
};

export default LanguageTranslatorPage;