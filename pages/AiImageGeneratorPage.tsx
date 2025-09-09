import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import saveAs from 'file-saver';
import ToolPageLayout from '../components/ToolPageLayout';
import Loader from '../components/Loader';
import { WandIcon, DownloadIcon } from '../components/Icons';

type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

const AiImageGeneratorPage: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [numberOfImages, setNumberOfImages] = useState(1);
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt to generate images.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImages([]);

        try {
            // FIX: Use process.env.API_KEY as per the coding guidelines.
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt,
                config: {
                    numberOfImages,
                    outputMimeType: 'image/png',
                    aspectRatio,
                },
            });

            const imageUrls = response.generatedImages.map(img => `data:image/png;base64,${img.image.imageBytes}`);
            setGeneratedImages(imageUrls);

        } catch (e) {
            console.error(e);
            setError('An AI error occurred. Please try again or refine your prompt.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = (base64Image: string, index: number) => {
        saveAs(base64Image, `generated-image-${index + 1}.png`);
    };
    
    return (
        <ToolPageLayout
            title="AI Image Generator"
            description="Create stunning visuals from a simple text description using the power of AI."
        >
            <div className="space-y-6">
                {/* Input and Options */}
                <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <label htmlFor="prompt" className="block font-semibold mb-2 text-slate-800 dark:text-gray-200">
                        Describe the image you want to create
                    </label>
                    <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={3}
                        className="w-full p-3 border rounded-md bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary shadow-sm dark:shadow-none"
                        placeholder="e.g., A photorealistic image of an astronaut riding a horse on Mars"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label htmlFor="num-images" className="block font-semibold mb-2 text-sm text-slate-700 dark:text-gray-300">Number of Images: {numberOfImages}</label>
                            <input type="range" id="num-images" min="1" max="4" step="1" value={numberOfImages} onChange={e => setNumberOfImages(parseInt(e.target.value, 10))} className="w-full" />
                        </div>
                        <div>
                            <label className="block font-semibold mb-2 text-sm text-slate-700 dark:text-gray-300">Aspect Ratio</label>
                            <div className="flex gap-2 flex-wrap">
                                {(['1:1', '16:9', '9:16', '4:3', '3:4'] as AspectRatio[]).map(ratio => (
                                    <button key={ratio} onClick={() => setAspectRatio(ratio)} className={`px-3 py-1 text-xs sm:text-sm rounded-md font-semibold transition-colors ${aspectRatio === ratio ? 'bg-primary text-slate-900' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>
                                        {ratio}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <button onClick={handleGenerate} disabled={isLoading || !prompt} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-12 py-4 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg shadow-primary/20 hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100">
                        <WandIcon className="w-6 h-6" />
                        {isLoading ? 'Generating...' : 'Generate'}
                    </button>
                </div>

                {error && <p className="text-red-500 text-center font-semibold">{error}</p>}
                
                {/* Results */}
                {isLoading && <Loader message="AI is creating your images..." />}
                {generatedImages.length > 0 && (
                    <div className="mt-6 border-t pt-6 border-slate-200 dark:border-slate-700">
                        <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Generated Images</h3>
                        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4`}>
                            {generatedImages.map((imgSrc, index) => (
                                <div key={index} className="relative group">
                                    <img src={imgSrc} alt={`Generated image ${index + 1}`} className="rounded-lg w-full h-full object-cover"/>
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button onClick={() => handleDownload(imgSrc, index)} className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 backdrop-blur-sm">
                                            <DownloadIcon className="w-5 h-5"/> Download
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </ToolPageLayout>
    );
};

export default AiImageGeneratorPage;