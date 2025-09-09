
import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import ToolPageLayout from '../components/ToolPageLayout';
import FileDropzone from '../components/FileDropzone';
import Loader from '../components/Loader';
import { AudioIcon } from '../components/Icons';

const AiAudioTranscriberPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string>('');
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

  const handleTranscribe = async () => {
    if (!file) {
      setError('Please select an audio file to transcribe.');
      return;
    }
    // FIX: Use process.env.API_KEY per coding guidelines.
    if (!process.env.API_KEY) {
        setError("AI features are disabled. Please set the API_KEY environment variable in your hosting provider's settings and redeploy the application to enable this tool.");
        return;
    }
    setIsLoading(true);
    setError(null);
    setTranscription('');

    try {
      // FIX: Use process.env.API_KEY per coding guidelines.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const audioPart = await fileToGenerativePart(file);
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [audioPart, { text: "Transcribe the audio." }] },
      });

      setTranscription(response.text);
    } catch (e) {
      console.error(e);
      setError("Failed to transcribe the audio. The file might be unsupported or an API error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setTranscription('');
      setError(null);
    }
  }, []);

  const handleCopy = () => {
    if (transcription) {
      navigator.clipboard.writeText(transcription).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleReset = () => {
    setFile(null);
    setTranscription('');
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
      title="AI Audio Transcriber"
      description="Convert speech from audio files into accurate, searchable text."
    >
      {isLoading ? (
        <Loader message="AI is transcribing your audio... This may take a few moments for longer files." />
      ) : (
        <div className="space-y-6">
          {!file ? (
            <FileDropzone onDrop={handleDrop} accept={acceptedFormats} multiple={false} instructions="Drop an audio file here (MP3, WAV, FLAC)" />
          ) : (
            <div className="text-center">
              <div className="p-4 bg-slate-800 rounded-lg inline-flex items-center gap-4">
                <AudioIcon className="w-6 h-6 text-primary" />
                <span className="font-medium text-gray-300">{file.name}</span>
                <button onClick={handleReset} className="text-red-500 hover:text-red-700 font-bold text-2xl">&times;</button>
              </div>
            </div>
          )}
          
          <div className="p-4 my-2 bg-yellow-900/30 border-l-4 border-yellow-400 text-yellow-200">
            <p><strong>Note:</strong> Transcription quality depends on the audio clarity. Background noise and multiple speakers may affect accuracy. Max audio length is approx. 1 hour.</p>
          </div>

          {error && <p className="text-red-500 text-center font-semibold">{error}</p>}

          <div className="text-center">
            <button
              onClick={handleTranscribe}
              disabled={!file}
              className="w-full sm:w-auto px-12 py-4 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg disabled:bg-slate-600"
            >
              Transcribe Audio
            </button>
          </div>

          {transcription && (
            <div className="mt-6 border-t pt-4 border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold">Transcription Result</h3>
                <button onClick={handleCopy} className="px-3 py-1.5 text-sm font-semibold text-gray-200 bg-slate-700 rounded-md hover:bg-slate-600">
                  {copied ? 'Copied!' : 'Copy Text'}
                </button>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-md whitespace-pre-wrap text-gray-300 max-h-60 overflow-y-auto">
                {transcription}
              </div>
            </div>
          )}
        </div>
      )}
    </ToolPageLayout>
  );
};

export default AiAudioTranscriberPage;