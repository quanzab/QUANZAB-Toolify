import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import saveAs from 'file-saver';
import ToolPageLayout from '../components/ToolPageLayout';
import Loader from '../components/Loader';
import { WandIcon, DownloadIcon } from '../components/Icons';

const loadingMessages = [
    "Contacting the AI director...",
    "Storyboarding your vision...",
    "Setting up the virtual cameras...",
    "Rendering the first few frames...",
    "This can take a few minutes, great art needs time!",
    "Polishing the final cut...",
    "Almost there, preparing for the premiere..."
];

const AiVideoGeneratorPage: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt to generate a video.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setVideoUrl(null);
        let messageIndex = 0;
        setLoadingMessage(loadingMessages[messageIndex]);
        const messageInterval = setInterval(() => {
            messageIndex = (messageIndex + 1) % loadingMessages.length;
            setLoadingMessage(loadingMessages[messageIndex]);
        }, 8000);

        try {
            // FIX: Use process.env.API_KEY as per guidelines.
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            let operation = await ai.models.generateVideos({
                model: 'veo-2.0-generate-001',
                prompt,
                config: { numberOfVideos: 1 }
            });

            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
                operation = await ai.operations.getVideosOperation({ operation: operation });
            }
            
            clearInterval(messageInterval);
            setLoadingMessage("Finalizing your video...");

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (!downloadLink) {
                throw new Error("AI operation finished, but no video link was returned.");
            }

            // The API key is required to fetch the video from the download URI
            // FIX: Use process.env.API_KEY as per guidelines.
            const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
            if (!response.ok) {
                throw new Error(`Failed to download video. Status: ${response.statusText}`);
            }
            
            const videoBlob = await response.blob();
            const url = URL.createObjectURL(videoBlob);
            setVideoUrl(url);

        } catch (e: any) {
            console.error(e);
            setError(e.message || 'An AI error occurred. Please try again or refine your prompt.');
        } finally {
            clearInterval(messageInterval);
            setIsLoading(false);
            setLoadingMessage('');
        }
    };
    
    const handleDownload = () => {
        if (videoUrl) {
            saveAs(videoUrl, `quanzab-ai-video.mp4`);
        }
    };
    
    const handleReset = () => {
        setPrompt('');
        setVideoUrl(null);
        setError(null);
    }

    return (
        <ToolPageLayout
            title="AI Video Generator"
            description="Create high-quality videos from a simple text prompt using cutting-edge AI."
        >
            <div className="space-y-6">
                {!videoUrl && !isLoading && (
                    <>
                        <div>
                            <label htmlFor="prompt" className="block font-semibold mb-2 text-slate-800 dark:text-gray-200">
                                Describe the video you want to create
                            </label>
                            <textarea
                                id="prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows={4}
                                className="w-full p-3 border rounded-md bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary shadow-sm dark:shadow-none"
                                placeholder="e.g., A cinematic drone shot of a futuristic city at sunset, with flying cars."
                            />
                        </div>
                        <div className="p-4 my-2 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 text-yellow-800 dark:text-yellow-200">
                            <p><strong>Note:</strong> Video generation is an intensive process and may take several minutes to complete. Please be patient.</p>
                        </div>
                        <div className="text-center">
                            <button onClick={handleGenerate} disabled={isLoading || !prompt} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-12 py-4 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg shadow-primary/20 hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100">
                                <WandIcon className="w-6 h-6" />
                                {isLoading ? 'Generating...' : 'Generate Video'}
                            </button>
                        </div>
                    </>
                )}
                
                {error && <p className="text-red-500 text-center font-semibold">{error}</p>}
                
                {isLoading && <Loader message={loadingMessage} />}

                {videoUrl && !isLoading && (
                    <div className="mt-6 border-t pt-6 border-slate-200 dark:border-slate-700 text-center">
                        <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Your AI-Generated Video</h3>
                        <video src={videoUrl} controls autoPlay loop className="rounded-lg w-full max-w-2xl mx-auto shadow-lg"></video>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                             <button onClick={handleDownload} className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg hover:bg-opacity-90">
                                <DownloadIcon className="w-6 h-6" /> Download Video
                            </button>
                            <button onClick={handleReset} className="font-semibold text-slate-500 dark:text-slate-400 hover:text-primary">
                                Generate Another
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </ToolPageLayout>
    );
};

export default AiVideoGeneratorPage;