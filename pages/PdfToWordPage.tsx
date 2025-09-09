import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import saveAs from 'file-saver';
import ToolPageLayout from '../components/ToolPageLayout';
import FileDropzone from '../components/FileDropzone';
import Loader from '../components/Loader';

const PdfToWordPage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setError(null);
        }
    }, []);
    
    const blobToBase64 = (blob: Blob): Promise<string> => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });

    const handleConvert = async () => {
        if (!file) {
            setError('Please select a PDF file to convert.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setProgress('Initializing PDF engine...');

        try {
            const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist');
            GlobalWorkerOptions.workerSrc = `https://aistudiocdn.com/pdfjs-dist@4.5.136/build/pdf.worker.min.mjs`;

            // FIX: Use process.env.API_KEY as per guidelines.
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const loadingTask = getDocument(URL.createObjectURL(file));
            const pdf = await loadingTask.promise;
            
            let fullText = `--- Document: ${file.name} ---\n\n`;

            for (let i = 1; i <= pdf.numPages; i++) {
                setProgress(`Performing OCR on page ${i} of ${pdf.numPages}...`);
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 1.5 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                if (!context) continue;

                await (page as any).render({ canvasContext: context, viewport: viewport }).promise;
                const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));

                if (blob) {
                    const base64Data = await blobToBase64(blob);
                    const response = await ai.models.generateContent({
                        model: 'gemini-2.5-flash',
                        contents: { parts: [{ inlineData: { mimeType: 'image/jpeg', data: base64Data } }, { text: "Extract all text from this image. Preserve formatting like paragraphs and line breaks." }] },
                    });
                    const extractedText = response.text;
                    fullText += `--- Page ${i} ---\n\n${extractedText}\n\n`;
                }
            }

            setProgress('Finalizing document...');
            const textBlob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
            const fileName = file.name.replace(/\.pdf$/i, '.txt');
            saveAs(textBlob, fileName);
            setFile(null);

        } catch (e) {
            console.error(e);
            setError('An error occurred during conversion. The PDF might be corrupted or an AI API error occurred.');
        } finally {
            setIsLoading(false);
            setProgress('');
        }
    };

    return (
        <ToolPageLayout
            title="PDF to Word (Text Extraction)"
            description="Uses AI-powered OCR to extract text from your PDF and saves it as a .txt file, which you can open and edit in Microsoft Word."
        >
            {isLoading ? (
                <Loader message={progress || 'Preparing for conversion...'} />
            ) : (
                <div className="space-y-6">
                    {!file ? (
                        <FileDropzone
                            onDrop={handleDrop}
                            accept={{ 'application/pdf': ['.pdf'] }}
                            multiple={false}
                            instructions="Drag 'n' drop a PDF to extract its text"
                        />
                    ) : (
                        <div className="text-center">
                            <div className="p-4 bg-slate-800 rounded-lg inline-flex items-center gap-4">
                                <span className="font-medium text-gray-300">{file.name}</span>
                                <button onClick={() => setFile(null)} className="text-red-500 hover:text-red-700 font-bold text-2xl leading-none px-2 rounded-full hover:bg-red-900/50 transition-colors">&times;</button>
                            </div>
                        </div>
                    )}

                    <div className="p-4 my-6 bg-yellow-900/30 border-l-4 border-yellow-400 text-yellow-200">
                        <p><strong>Note:</strong> This tool extracts the text content into a `.txt` file. It does not preserve complex formatting, tables, or images like a native `.docx` file would.</p>
                    </div>

                    {error && <p className="text-red-500 text-center my-4 font-semibold">{error}</p>}
                    
                    <div className="text-center">
                        <button
                            onClick={handleConvert}
                            disabled={!file}
                            className="w-full sm:w-auto px-12 py-4 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg shadow-primary/20 hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100"
                        >
                            Extract Text
                        </button>
                    </div>
                </div>
            )}
        </ToolPageLayout>
    );
};

export default PdfToWordPage;