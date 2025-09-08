import React, { useState } from 'react';
import saveAs from 'file-saver';
import JSZip from 'jszip';
import { GoogleGenAI } from "@google/genai";
import ToolPageLayout from '../components/ToolPageLayout';
import FileDropzone from '../components/FileDropzone';
import Loader from '../components/Loader';
import { AIIcon } from '../components/Icons';

type OutputFormat = 'jpg' | 'png';

const PdfConverterPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('jpg');
  const [progress, setProgress] = useState('');
  const [enableOcr, setEnableOcr] = useState<boolean>(false);

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
    }
  };
  
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
    setProgress('Initializing converter...');

    try {
      const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist');
      GlobalWorkerOptions.workerSrc = `https://aistudiocdn.com/pdfjs-dist@4.5.136/build/pdf.worker.min.mjs`;

      const loadingTask = getDocument(URL.createObjectURL(file));
      const pdf = await loadingTask.promise;
      const zip = new JSZip();
      
      let fullText = `--- OCR Results for ${file.name} ---\n\n`;
      const ai = enableOcr ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress(`Processing page ${i} of ${pdf.numPages}...`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          // FIX: The 'render' method requires the 'canvas' property in its parameters.
          await page.render({ canvas, canvasContext: context, viewport: viewport }).promise;
          const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, `image/${outputFormat}`, 0.95));
          if (blob) {
            zip.file(`page_${i}.${outputFormat}`, blob);
            
            if (enableOcr && ai) {
              setProgress(`Performing OCR on page ${i} of ${pdf.numPages}...`);
              const base64Data = await blobToBase64(blob);
              const response = await ai.models.generateContent({
                  model: 'gemini-2.5-flash',
                  contents: { parts: [{ inlineData: { mimeType: `image/${outputFormat}`, data: base64Data } }, { text: "Extract all text from this image." }] },
              });
              const extractedText = response.text;
              zip.file(`page_${i}.txt`, extractedText);
              fullText += `--- Page ${i} ---\n\n${extractedText}\n\n`;
            }
          }
        }
      }
      
      if (enableOcr) {
        zip.file('full_text.txt', fullText);
      }
      
      setProgress('Zipping files...');
      const zipFileName = enableOcr 
        ? `${file.name.replace('.pdf', '')}-with-ocr.zip`
        : `${file.name.replace('.pdf', '')}.zip`;

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, zipFileName);
      setFile(null);
      setEnableOcr(false);

    } catch (e) {
      console.error(e);
      setError('An error occurred during conversion. The PDF might be corrupted, protected, or an API error occurred.');
    } finally {
      setIsLoading(false);
      setProgress('');
    }
  };
  
  return (
    <ToolPageLayout
      title="PDF to Image Converter"
      description="Convert each page of your PDF file into high-quality JPG or PNG images, with optional AI-powered text recognition."
    >
      {isLoading ? (
        <Loader message={progress || `Converting PDF...`} />
      ) : (
        <>
          {!file ? (
            <FileDropzone
              onDrop={handleDrop}
              accept={{ 'application/pdf': ['.pdf'] }}
              multiple={false}
              instructions="Drag 'n' drop a PDF file here"
            />
          ) : (
             <div className="text-center">
                <div className="p-4 bg-slate-800 rounded-lg inline-flex items-center gap-4">
                  <span className="font-medium text-gray-300">{file.name}</span>
                  <button onClick={() => setFile(null)} className="text-red-500 hover:text-red-700 font-bold text-2xl leading-none px-2 rounded-full hover:bg-red-900/50 transition-colors">&times;</button>
                </div>
            </div>
          )}
          
          {file && (
            <div className="my-6 p-6 border border-slate-700 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Conversion Options</h3>
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <label htmlFor="format" className="font-semibold text-gray-200">Convert to:</label>
                        <select 
                            id="format"
                            value={outputFormat}
                            onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
                            className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary"
                        >
                            <option value="jpg">JPG</option>
                            <option value="png">PNG</option>
                        </select>
                    </div>

                    <div className="flex items-center">
                        <label htmlFor="ocr-toggle" className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input id="ocr-toggle" type="checkbox" className="sr-only" checked={enableOcr} onChange={() => setEnableOcr(!enableOcr)} />
                                <div className={`block w-14 h-8 rounded-full transition-colors ${enableOcr ? 'bg-accent' : 'bg-slate-600'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${enableOcr ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                            <div className="ml-4">
                                <span className="font-semibold text-gray-200">
                                Enable OCR (Extract Text)
                                <span className="ml-2 text-xs font-bold text-slate-900 bg-primary rounded-full px-2 py-1 align-middle">AI</span>
                                </span>
                                <p className="text-sm text-slate-400">Creates searchable text files for each page.</p>
                            </div>
                        </label>
                    </div>
                </div>

                {enableOcr && (
                    <div className="p-4 mt-6 bg-primary/10 border-l-4 border-primary text-primary/80">
                        <p><strong>Note:</strong> AI-powered OCR may take significantly longer than a standard conversion, especially for large documents.</p>
                    </div>
                )}
            </div>
          )}


          {error && <p className="text-red-500 text-center my-4 font-semibold">{error}</p>}

          <div className="mt-8 text-center">
            <button
              onClick={handleConvert}
              disabled={!file}
              className="w-full sm:w-auto px-12 py-4 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg shadow-primary/20 hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100"
            >
              {enableOcr ? 'Convert with OCR' : 'Convert to Image'}
            </button>
          </div>
        </>
      )}
    </ToolPageLayout>
  );
};

export default PdfConverterPage;