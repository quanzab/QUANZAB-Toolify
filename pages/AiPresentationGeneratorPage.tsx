import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import ToolPageLayout from '../components/ToolPageLayout';
import Loader from '../components/Loader';
import { WandIcon, PresentationIcon } from '../components/Icons';

interface Slide {
    title: string;
    content: string[];
}

interface PresentationResult {
    mainTitle: string;
    slides: Slide[];
}

const AiPresentationGeneratorPage: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [slideCount, setSlideCount] = useState(5);
    const [result, setResult] = useState<PresentationResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a topic for your presentation.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        const fullPrompt = `Generate a ${slideCount}-slide presentation about "${prompt}". Provide a main title for the presentation. For each slide, provide a concise title and a list of key bullet points (as an array of strings).`;

        try {
            // FIX: Use process.env.API_KEY as per guidelines.
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ parts: [{ text: fullPrompt }] }],
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            mainTitle: { type: Type.STRING, description: "The main title of the entire presentation." },
                            slides: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        title: { type: Type.STRING, description: "The title of the slide." },
                                        content: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of bullet points for the slide content." },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            const parsedData: PresentationResult = JSON.parse(response.text);
            setResult(parsedData);
        } catch (e) {
            console.error(e);
            setError('An AI error occurred while generating the presentation. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const formatPresentationForCopy = () => {
        if (!result) return '';
        let text = `# ${result.mainTitle}\n\n`;
        result.slides.forEach((slide, index) => {
            text += `## Slide ${index + 1}: ${slide.title}\n`;
            slide.content.forEach(point => {
                text += `- ${point}\n`;
            });
            text += '\n';
        });
        return text;
    };

    const handleCopy = () => {
        const textToCopy = formatPresentationForCopy();
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        }
    };

    return (
        <ToolPageLayout
            title="AI Presentation Generator"
            description="Create professional presentation content from a text prompt, letting AI generate the slides."
        >
            <div className="space-y-6">
                <div>
                    <label htmlFor="prompt" className="block font-semibold mb-2">Presentation Topic</label>
                    <input
                        id="prompt"
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full p-3 border rounded-md bg-slate-800 border-slate-600"
                        placeholder="e.g., The Future of Renewable Energy"
                    />
                </div>
                <div>
                    <label htmlFor="slide-count" className="block font-semibold mb-2">Number of Slides: {slideCount}</label>
                    <input
                        id="slide-count"
                        type="range"
                        min="3"
                        max="12"
                        value={slideCount}
                        onChange={(e) => setSlideCount(parseInt(e.target.value, 10))}
                        className="w-full"
                    />
                </div>
                <div className="text-center">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !prompt}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-12 py-4 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg disabled:bg-slate-600"
                    >
                        <WandIcon className="w-6 h-6" />
                        {isLoading ? 'Generating...' : 'Generate Slides'}
                    </button>
                </div>
                
                {error && <p className="text-red-500 text-center font-semibold">{error}</p>}
                {isLoading && <Loader message="AI is building your presentation..." />}
                
                {result && (
                    <div className="mt-6 border-t pt-6 border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold font-heading text-white">{result.mainTitle}</h3>
                            <button onClick={handleCopy} className="px-3 py-1.5 text-sm font-semibold text-gray-200 bg-slate-700 rounded-md hover:bg-slate-600">
                                {copied ? 'Copied!' : 'Copy as Markdown'}
                            </button>
                        </div>
                        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                            {result.slides.map((slide, index) => (
                                <div key={index} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                                    <h4 className="font-bold text-lg text-primary flex items-center gap-2">
                                        <PresentationIcon className="w-5 h-5" />
                                        Slide {index + 1}: {slide.title}
                                    </h4>
                                    <ul className="list-disc list-inside mt-2 pl-2 space-y-1 text-slate-300">
                                        {slide.content.map((point, pIndex) => (
                                            <li key={pIndex}>{point}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </ToolPageLayout>
    );
};

export default AiPresentationGeneratorPage;