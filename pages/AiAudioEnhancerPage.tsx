import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import ToolPageLayout from '../components/ToolPageLayout';
import FileDropzone from '../components/FileDropzone';
import Loader from '../components/Loader';
import { AudioIcon } from '../components/Icons';

interface EnhancementResult {
    qualityAnalysis: string;
    enhancedTranscript: string;
}

const AiAudioEnhancerPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EnhancementResult | null>(null);
  const [copied, setCopied] = useState(false);

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

  const handleEnhance = async () => {
    if (!file) {
      setError('Please select an audio file to enhance.');
      return;
    }
    if (!process.env.API_KEY) {
        setError("AI features are disabled. The API_KEY environment variable is not set. Please add it to your hosting provider's settings to use this tool.");
        return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const audioPart = await fileToGenerativePart(file);
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [audioPart, { text: "Act as an audio engineer. First, provide a brief analysis of the audio quality (e.g., clarity, background noise). Second, transcribe the audio, but clean it up for readability by removing filler words (like 'um', 'ah'), stutters, and false starts. The result should be a clean, easy-to-read version of the speech." }] },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    qualityAnalysis: {
                        type: Type.STRING,
                        description: "A brief analysis of the audio file's quality."
                    },
                    enhancedTranscript: {
                        type: Type.STRING,
                        description: "A cleaned-up and enhanced transcript of the audio."
                    }
                }
            }
        }
      });

      const parsedResult: EnhancementResult = JSON.parse(response.text);
      setResult(parsedResult);
    } catch (e) {
      console.error(e);
      setError("Failed to enhance the audio. The file might be unsupported or an AI error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setResult(null);
      setError(null);
    }
  }, []);

  const handleCopy = () => {
    if (result?.enhancedTranscript) {
      navigator.clipboard.writeText(result.enhancedTranscript).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  const acceptedFormats = {
    'audio/mpeg': ['.mp3'],
    'audio/wav': ['.wav'],
    'audio/flac': ['.flac'],
    'audio/aac': ['.aac'],
    'audio/ogg': ['.ogg'],
  };

  return (
    <ToolPageLayout
      title="AI Audio Enhancer"
      description="Analyze audio, clean up transcripts by removing filler words, and get quality improvement suggestions."
    >
      {isLoading ? (
        <Loader message="AI is enhancing your audio..." />
      ) : (
        <div className="space-y-6">
          {!file ? (
            <FileDropzone onDrop={handleDrop} accept={acceptedFormats} multiple={false} instructions="Drop an audio file here (MP3, WAV, FLAC)" />
          ) : (
            <div className="text-center">
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg inline-flex items-center gap-4 shadow-sm">
                <AudioIcon className="w-6 h-6 text-primary" />
                <span className="font-medium text-slate-800 dark:text-gray-300">{file.name}</span>
                <button onClick={handleReset} className="text-red-500 hover:text-red-700 font-bold text-2xl">&times;</button>
              </div>
            </div>
          )}
          
          {error && <p className="text-red-500 text-center font-semibold mt-4">{error}</p>}
          
          {file && !result && (
            <div className="text-center mt-4">
              <button
                onClick={handleEnhance}
                disabled={!file}
                className="w-full sm:w-auto px-12 py-4 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg disabled:bg-slate-600"
              >
                Enhance Audio
              </button>
            </div>
          )}

          {result && (
            <div className="mt-6 border-t pt-4 border-slate-200 dark:border-slate-700 space-y-4">
                <div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Audio Quality Analysis</h3>
                    <p className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-md text-slate-700 dark:text-gray-300 italic">{result.qualityAnalysis}</p>
                </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Enhanced Transcript</h3>
                  <button onClick={handleCopy} className="px-3 py-1.5 text-sm font-semibold text-slate-800 dark:text-gray-200 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600">
                    {copied ? 'Copied!' : 'Copy Transcript'}
                  </button>
                </div>
                <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-md whitespace-pre-wrap text-slate-800 dark:text-gray-300 max-h-60 overflow-y-auto">
                  {result.enhancedTranscript}
                </div>
              </div>
               <div className="text-center mt-6">
                    <button onClick={handleReset} className="font-semibold text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
                        Enhance another file
                    </button>
                </div>
            </div>
          )}
        </div>
      )}
    </ToolPageLayout>
  );
};

export default AiAudioEnhancerPage;