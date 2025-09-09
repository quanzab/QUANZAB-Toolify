import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import ToolPageLayout from '../components/ToolPageLayout';
import FileDropzone from '../components/FileDropzone';
import Loader from '../components/Loader';

interface ExtractedData {
  vendor?: string;
  date?: string;
  total?: number;
  items?: { description: string; price: number }[];
}

const ReceiptScannerPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ExtractedData | null>(null);

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

  const handleScan = async () => {
    if (!file) return;
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      // FIX: Use process.env.API_KEY as per guidelines.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const imagePart = await fileToGenerativePart(file);
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, { text: "Extract key information from this receipt." }] },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              vendor: { type: Type.STRING },
              date: { type: Type.STRING },
              total: { type: Type.NUMBER },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    description: { type: Type.STRING },
                    price: { type: Type.NUMBER },
                  },
                },
              },
            },
          },
        },
      });

      const parsedData = JSON.parse(response.text);
      setData(parsedData);

    } catch (e) {
      console.error(e);
      setError("Failed to scan the receipt. The image might be unclear or an API error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const currentFile = acceptedFiles[0];
      setFile(currentFile);
      setPreview(URL.createObjectURL(currentFile));
      setData(null);
      setError(null);
    }
  }, []);

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setData(null);
    setError(null);
  };

  return (
    <ToolPageLayout
      title="Receipt Scanner"
      description="Digitize your paper receipts with AI. Upload an image to automatically extract details."
    >
      {!file && (
        <FileDropzone onDrop={handleDrop} accept={{ 'image/*': ['.jpeg', '.jpg', '.png'] }} multiple={false} instructions="Drop a receipt image here" />
      )}

      {file && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Receipt Preview</h3>
            {preview && <img src={preview} alt="Receipt preview" className="rounded-lg shadow-md max-h-96 w-auto mx-auto" />}
            <div className="flex gap-4">
              <button onClick={handleScan} disabled={isLoading} className="flex-grow px-8 py-3 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg disabled:bg-slate-600">
                {isLoading ? 'Scanning...' : 'Scan with AI'}
              </button>
              <button onClick={handleReset} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-md text-slate-800 dark:text-gray-200 hover:bg-slate-300 dark:hover:bg-slate-600 shadow-sm">Change File</button>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Extracted Data</h3>
            {isLoading && <Loader message="AI is analyzing your receipt..." />}
            {error && <p className="text-red-500 font-semibold">{error}</p>}
            {data && (
              <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm dark:shadow-none text-slate-800 dark:text-gray-200">
                <p><strong>Vendor:</strong> {data.vendor || 'N/A'}</p>
                <p><strong>Date:</strong> {data.date || 'N/A'}</p>
                <p><strong>Total:</strong> ${data.total?.toFixed(2) || 'N/A'}</p>
                {data.items && data.items.length > 0 && (
                  <div>
                    <strong>Items:</strong>
                    <ul className="list-disc pl-5">
                      {data.items.map((item, index) => (
                        <li key={index}>{item.description} - ${item.price.toFixed(2)}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
};

export default ReceiptScannerPage;