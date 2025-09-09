import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import ToolPageLayout from '../components/ToolPageLayout';
import FileDropzone from '../components/FileDropzone';
import Loader from '../components/Loader';

const AiImageClassifierPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classifications, setClassifications] = useState<string[] | null>(null);

  const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  };

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const currentFile = acceptedFiles[0];
      setFile(currentFile);
      setPreview(URL.createObjectURL(currentFile));
      setClassifications(null);
      setError(null);
    }
  }, []);

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setClassifications(null);
    setError(null);
  };

  const handleClassify = async () => {
    if (!file) return;
    if (!process.env.API_KEY) {
        setError("AI features are disabled. The API_KEY environment variable is not set. Please add it to your hosting provider's settings to use this tool.");
        return;
    }
    setIsLoading(true);
    setError(null);
    setClassifications(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const imagePart = await fileToGenerativePart(file);
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, { text: "Classify the main subject, scene, and any relevant concepts in this image. Provide a concise list of labels or tags." }] },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              classifications: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            }
          },
        },
      });

      const parsedData = JSON.parse(response.text);
      if (parsedData.classifications) {
        setClassifications(parsedData.classifications);
      } else {
        throw new Error("AI response did not contain classifications.");
      }

    } catch (e) {
      console.error(e);
      setError("Failed to classify the image. The image might be unsupported or an AI error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToolPageLayout
      title="AI Image Classifier"
      description="Upload an image to identify objects, scenes, and concepts within it using AI."
    >
      {!file && (
        <FileDropzone onDrop={handleDrop} accept={{ 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] }} multiple={false} instructions="Drop an image to classify it" />
      )}

      {file && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Image Preview</h3>
            {preview && <img src={preview} alt="Image preview" className="rounded-lg shadow-md max-h-96 w-auto mx-auto" />}
            <div className="flex gap-4">
              <button onClick={handleClassify} disabled={isLoading} className="flex-grow px-8 py-3 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg disabled:bg-slate-600">
                {isLoading ? 'Analyzing...' : 'Classify Image'}
              </button>
              <button onClick={handleReset} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-md text-slate-800 dark:text-gray-200 hover:bg-slate-300 dark:hover:bg-slate-600 shadow-sm">Change Image</button>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">AI Classifications</h3>
            {isLoading && <Loader message="AI is analyzing your image..." />}
            {error && <p className="text-red-500 font-semibold">{error}</p>}
            {classifications && (
              <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 shadow-inner">
                <div className="flex flex-wrap gap-3">
                    {classifications.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-primary/20 text-primary font-semibold rounded-full shadow-sm">
                            {tag}
                        </span>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
};

export default AiImageClassifierPage;