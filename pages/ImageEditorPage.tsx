
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import saveAs from 'file-saver';
import ToolPageLayout from '../components/ToolPageLayout';
import FileDropzone from '../components/FileDropzone';
import Loader from '../components/Loader';
import { WandIcon, DownloadIcon } from '../components/Icons';

interface Adjustments {
  brightness: number;
  contrast: number;
  saturate: number;
  grayscale: number;
  sepia: number;
  invert: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
}

const defaultAdjustments: Adjustments = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  grayscale: 0,
  sepia: 0,
  invert: 0,
  rotation: 0,
  flipH: false,
  flipV: false,
};

const ImageEditorPage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
    const [adjustments, setAdjustments] = useState<Adjustments>(defaultAdjustments);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const currentFile = acceptedFiles[0];
            setFile(currentFile);
            setError(null);
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    setOriginalImage(img);
                    setAdjustments(defaultAdjustments);
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(currentFile);
        }
    }, []);

    const drawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !originalImage) return;

        const { width, height } = originalImage;
        const rad = adjustments.rotation * Math.PI / 180;
        const absCos = Math.abs(Math.cos(rad));
        const absSin = Math.abs(Math.sin(rad));
        
        canvas.width = width * absCos + height * absSin;
        canvas.height = height * absCos + width * absSin;

        ctx.filter = `
            brightness(${adjustments.brightness}%)
            contrast(${adjustments.contrast}%)
            saturate(${adjustments.saturate}%)
            grayscale(${adjustments.grayscale}%)
            sepia(${adjustments.sepia}%)
            invert(${adjustments.invert}%)
        `;

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rad);
        ctx.scale(adjustments.flipH ? -1 : 1, adjustments.flipV ? -1 : 1);
        ctx.drawImage(originalImage, -width / 2, -height / 2, width, height);
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    }, [originalImage, adjustments]);

    useEffect(() => {
        drawCanvas();
    }, [drawCanvas]);

    const handleAdjustmentChange = (key: keyof Adjustments, value: number | boolean) => {
        setAdjustments(prev => ({ ...prev, [key]: value }));
    };
    
    const applyFilterPreset = (preset: Partial<Adjustments>) => {
        setAdjustments(prev => ({...prev, ...preset}));
    }

    const handleAiEnhance = async () => {
        if (!canvasRef.current) return;
        setIsLoading(true);
        setLoadingMessage('AI is enhancing your image...');
        setError(null);
    
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const base64Data = canvasRef.current.toDataURL('image/jpeg').split(',')[1];
    
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image-preview',
                contents: {
                    parts: [
                        { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
                        { text: 'Slightly enhance this image. Improve brightness, contrast, and color balance for a natural, professional look. Do not crop or add any elements.' },
                    ],
                },
                config: {
                    responseModalities: [Modality.IMAGE, Modality.TEXT],
                },
            });
            
            const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);
            if (imagePart?.inlineData) {
                const resultBase64 = imagePart.inlineData.data;
                const enhancedImage = new Image();
                enhancedImage.onload = () => {
                    setOriginalImage(enhancedImage);
                    setAdjustments(defaultAdjustments);
                };
                enhancedImage.src = `data:image/png;base64,${resultBase64}`;
            } else {
                throw new Error("The AI could not enhance the image. Please try again.");
            }
        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred during AI enhancement.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (canvas && file) {
            canvas.toBlob((blob) => {
                if(blob) {
                    const fileName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                    saveAs(blob, `${fileName}-edited.png`);
                }
            }, 'image/png');
        }
    };

    const handleReset = () => {
        setFile(null);
        setOriginalImage(null);
        setAdjustments(defaultAdjustments);
        setError(null);
    };

    const renderEditor = () => (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-950 p-4 border border-slate-700 rounded-lg flex items-center justify-center min-h-[50vh]">
            <canvas ref={canvasRef} className="max-w-full max-h-[70vh] object-contain" />
          </div>
          <div className="lg:col-span-1 space-y-6">
              <div>
                  <h3 className="font-bold text-lg mb-2">Transform</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => handleAdjustmentChange('rotation', (adjustments.rotation + 90) % 360)} className="p-2 bg-slate-700 rounded-md hover:bg-slate-600">Rotate 90°</button>
                    <button onClick={() => handleAdjustmentChange('flipH', !adjustments.flipH)} className="p-2 bg-slate-700 rounded-md hover:bg-slate-600">Flip H</button>
                    <button onClick={() => handleAdjustmentChange('flipV', !adjustments.flipV)} className="p-2 bg-slate-700 rounded-md hover:bg-slate-600">Flip V</button>
                  </div>
              </div>
              <div>
                  <h3 className="font-bold text-lg mb-2">Adjustments</h3>
                  <div className="space-y-2">
                    <label className="block text-sm">Brightness: <input type="range" min="0" max="200" value={adjustments.brightness} onChange={e => handleAdjustmentChange('brightness', parseInt(e.target.value))} className="w-full" /></label>
                    <label className="block text-sm">Contrast: <input type="range" min="0" max="200" value={adjustments.contrast} onChange={e => handleAdjustmentChange('contrast', parseInt(e.target.value))} className="w-full" /></label>
                    <label className="block text-sm">Saturation: <input type="range" min="0" max="200" value={adjustments.saturate} onChange={e => handleAdjustmentChange('saturate', parseInt(e.target.value))} className="w-full" /></label>
                  </div>
              </div>
              <div>
                  <h3 className="font-bold text-lg mb-2">Filters</h3>
                  <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => applyFilterPreset({grayscale: 100, sepia: 0})} className="p-2 bg-slate-700 rounded-md hover:bg-slate-600">Grayscale</button>
                      <button onClick={() => applyFilterPreset({grayscale: 0, sepia: 100})} className="p-2 bg-slate-700 rounded-md hover:bg-slate-600">Sepia</button>
                      <button onClick={() => applyFilterPreset({invert: 100})} className="p-2 bg-slate-700 rounded-md hover:bg-slate-600">Invert</button>
                      <button onClick={() => applyFilterPreset({saturate: 150, contrast: 110})} className="p-2 bg-slate-700 rounded-md hover:bg-slate-600">Vivid</button>
                  </div>
              </div>
              <div className="space-y-4 pt-4 border-t border-slate-700">
                  <button onClick={handleAiEnhance} className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 font-semibold text-slate-900 bg-primary rounded-lg shadow-lg hover:bg-opacity-90"><WandIcon className="w-5 h-5" /> Auto Enhance (AI)</button>
                  <button onClick={handleDownload} className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 font-semibold text-primary bg-slate-800 border-2 border-primary rounded-lg hover:bg-slate-700"><DownloadIcon className="w-5 h-5"/> Download</button>
                  <button onClick={() => setAdjustments(defaultAdjustments)} className="w-full p-2 bg-slate-700 rounded-md hover:bg-slate-600">Reset Adjustments</button>
                  <button onClick={handleReset} className="w-full font-semibold text-slate-400 hover:text-primary">Change Image</button>
              </div>
          </div>
      </div>
    );

    return (
        <ToolPageLayout title="AI Image Editor" description="Resize, apply filters, and enhance your images with powerful, easy-to-use AI editing tools.">
            {isLoading && <Loader message={loadingMessage} />}
            <div style={{ display: isLoading ? 'none' : 'block' }}>
                {!file ? (
                    <FileDropzone onDrop={handleDrop} accept={{ 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] }} multiple={false} instructions="Drop an image file to start editing" />
                ) : (
                    renderEditor()
                )}
                {error && <p className="text-red-500 text-center mt-4 font-semibold">{error}</p>}
            </div>
        </ToolPageLayout>
    );
};

export default ImageEditorPage;
