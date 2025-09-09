
import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import saveAs from 'file-saver';
import ToolPageLayout from '../components/ToolPageLayout';
import FileDropzone from '../components/FileDropzone';
import Loader from '../components/Loader';
import { DownloadIcon } from '../components/Icons';

const ImageBackgroundRemoverPage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const blobToBase64 = (blob: Blob): Promise<string> => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });

    const handleDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const currentFile = acceptedFiles[0];
            setFile(currentFile);
            setPreview(URL.createObjectURL(currentFile));
            setResult(null);
            setError(null);
        }
    }, []);

    const handleRemoveBackground = async () => {
        if (!file) {
            setError('Please upload an image first.');
            return;
        }

        // FIX: Use process.env.API_KEY per coding guidelines.
        if (!process.env.API_KEY) {
            setError("AI features are disabled. Please set the API_KEY environment variable in your hosting provider's settings and redeploy the application to enable this tool.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            // FIX: Use process.env.API_KEY per coding guidelines.
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const base64Data = await blobToBase64(file);

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image-preview',
                contents: {
                    parts: [
                        { inlineData: { data: base64Data, mimeType: file.type } },
                        { text: 'remove the background. The output should be a PNG with a transparent background.' },
                    ],
                },
                config: {
                    responseModalities: [Modality.IMAGE, Modality.TEXT],
                },
            });

            const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);

            if (imagePart?.inlineData) {
                const resultBase64 = imagePart.inlineData.data;
                const resultMimeType = imagePart.inlineData.mimeType || 'image/png';
                setResult(`data:${resultMimeType};base64,${resultBase64}`);
            } else {
                const textPart = response.candidates?.[0]?.content?.parts.find(part => part.text);
                const errorMessage = textPart?.text || "The AI could not process the image. Please try a different one.";
                throw new Error(errorMessage);
            }

        } catch (e: any) {
            console.error(e);
            setError(e.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDownload = () => {
        if (result && file) {
            const fileName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            saveAs(result, `${fileName}-no-bg.png`);
        }
    };
    
    const handleReset = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
        setError(null);
        setIsLoading(false);
    };
    
    const checkeredBg = {
        backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 32 32\' width=\'32\' height=\'32\' fill=\'none\' stroke=\'rgb(71 85 105 / 0.5)\'%3e%3cpath d=\'M0 .5H32V32\'/%3e%3c/svg%3e")',
        backgroundPosition: 'center',
    };

    if (isLoading) {
        return <ToolPageLayout title="Image Background Remover" description="Use AI to automatically remove the background from any image."><Loader message="AI is processing your image..." /></ToolPageLayout>;
    }
    
    if (result) {
        return (
            <ToolPageLayout title="Image Background Remover" description="Use AI to automatically remove the background from any image.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="text-center">
                        <h3 className="font-bold text-lg mb-2">Original</h3>
                        <img src={preview!} alt="Original upload" className="rounded-lg shadow-md max-h-80 w-auto mx-auto"/>
                    </div>
                     <div className="text-center">
                        <h3 className="font-bold text-lg mb-2">Result</h3>
                        <div style={checkeredBg} className="rounded-lg p-2 inline-block bg-slate-800">
                            <img src={result} alt="Background removed" className="rounded-lg shadow-md max-h-80 w-auto mx-auto"/>
                        </div>
                    </div>
                </div>
                 {error && <p className="text-red-500 text-center my-4 font-semibold">{error}</p>}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 pt-6 border-t border-slate-700">
                    <button onClick={handleDownload} className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg hover:bg-opacity-90">
                        <DownloadIcon className="w-6 h-6" /> Download Image
                    </button>
                    <button onClick={handleReset} className="font-semibold text-slate-400 hover:text-primary">Process Another</button>
                </div>
            </ToolPageLayout>
        );
    }

    return (
        <ToolPageLayout title="Image Background Remover" description="Use AI to automatically remove the background from any image.">
            {!file ? (
                <FileDropzone onDrop={handleDrop} accept={{ 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] }} multiple={false} instructions="Drop an image file here" />
            ) : (
                <div className="text-center space-y-6">
                    <div>
                        <h3 className="font-bold text-lg mb-2">Image Preview</h3>
                        <img src={preview!} alt="Upload preview" className="rounded-lg shadow-md max-h-80 w-auto mx-auto"/>
                    </div>
                    {error && <p className="text-red-500 text-center font-semibold">{error}</p>}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button onClick={handleRemoveBackground} className="w-full sm:w-auto px-8 py-3 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg">Remove Background</button>
                        <button onClick={handleReset} className="font-semibold text-slate-400 hover:text-primary">Change Image</button>
                    </div>
                </div>
            )}
        </ToolPageLayout>
    );
};

export default ImageBackgroundRemoverPage;