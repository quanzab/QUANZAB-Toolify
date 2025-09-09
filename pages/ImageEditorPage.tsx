import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import saveAs from 'file-saver';
import ToolPageLayout from '../components/ToolPageLayout';
import FileDropzone from '../components/FileDropzone';
import Loader from '../components/Loader';
import { WandIcon, DownloadIcon, WatermarkIcon } from '../components/Icons';

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

    // States for resize and crop
    const [isCropping, setIsCropping] = useState(false);
    const [cropBox, setCropBox] = useState({ x: 50, y: 50, width: 200, height: 150 });
    const [resizeWidth, setResizeWidth] = useState(0);
    const [resizeHeight, setResizeHeight] = useState(0);
    
    // States for watermarking
    const [watermarkMode, setWatermarkMode] = useState<'text' | 'image'>('text');
    const [watermarkText, setWatermarkText] = useState('QUANZAB');
    const [watermarkImage, setWatermarkImage] = useState<HTMLImageElement | null>(null);
    const [watermarkOpacity, setWatermarkOpacity] = useState(0.5);
    const [watermarkScale, setWatermarkScale] = useState(0.2);
    const [watermarkPosition, setWatermarkPosition] = useState('center');
    const [watermarkFontSize, setWatermarkFontSize] = useState(48);
    const [watermarkColor, setWatermarkColor] = useState('#ffffff');


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
                    setResizeWidth(img.width);
                    setResizeHeight(img.height);
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
        canvas.width = width;
        canvas.height = height;

        ctx.filter = `
            brightness(${adjustments.brightness}%)
            contrast(${adjustments.contrast}%)
            saturate(${adjustments.saturate}%)
            grayscale(${adjustments.grayscale}%)
            sepia(${adjustments.sepia}%)
            invert(${adjustments.invert}%)
        `;
        
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate(adjustments.rotation * Math.PI / 180);
        ctx.scale(adjustments.flipH ? -1 : 1, adjustments.flipV ? -1 : 1);
        ctx.drawImage(originalImage, -width / 2, -height / 2, width, height);
        ctx.restore();

    }, [originalImage, adjustments]);

    useEffect(() => {
        drawCanvas();
    }, [drawCanvas]);
    
    useEffect(() => {
        if (originalImage) {
            setResizeWidth(originalImage.width);
            setResizeHeight(originalImage.height);
        }
    }, [originalImage]);

    const handleAdjustmentChange = (key: keyof Adjustments, value: number | boolean) => {
        setAdjustments(prev => ({ ...prev, [key]: value }));
    };
    
    const applyFilterPreset = (preset: Partial<Adjustments>) => {
        setAdjustments(prev => ({...defaultAdjustments, ...preset}));
    }
    
    const updateImageFromCanvas = (sourceCanvas: HTMLCanvasElement) => {
        const dataUrl = sourceCanvas.toDataURL('image/png');
        const img = new Image();
        img.onload = () => {
            setOriginalImage(img);
        };
        img.src = dataUrl;
    };

    const handleApplyResize = () => {
        if (!originalImage || !resizeWidth || !resizeHeight) return;
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = resizeWidth;
        tempCanvas.height = resizeHeight;
        const ctx = tempCanvas.getContext('2d');
        ctx?.drawImage(originalImage, 0, 0, resizeWidth, resizeHeight);
        updateImageFromCanvas(tempCanvas);
    };

    const handleApplyCrop = () => {
        if (!originalImage) return;
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = cropBox.width;
        tempCanvas.height = cropBox.height;
        const ctx = tempCanvas.getContext('2d');
        ctx?.drawImage(originalImage, cropBox.x, cropBox.y, cropBox.width, cropBox.height, 0, 0, cropBox.width, cropBox.height);
        updateImageFromCanvas(tempCanvas);
        setIsCropping(false);
    };

    const handleWatermarkImageDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => setWatermarkImage(img);
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(acceptedFiles[0]);
        }
    }, []);

    const handleApplyWatermark = () => {
        const sourceCanvas = canvasRef.current;
        if (!sourceCanvas) return;
    
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = sourceCanvas.width;
        tempCanvas.height = sourceCanvas.height;
        const ctx = tempCanvas.getContext('2d');
        if (!ctx) return;
    
        ctx.drawImage(sourceCanvas, 0, 0);
    
        ctx.globalAlpha = watermarkOpacity;
    
        if (watermarkMode === 'text' && watermarkText) {
            ctx.fillStyle = watermarkColor;
            ctx.font = `${watermarkFontSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
    
            if (watermarkPosition === 'center') {
                ctx.fillText(watermarkText, tempCanvas.width / 2, tempCanvas.height / 2);
            } else if (watermarkPosition === 'bottom-right') {
                ctx.textAlign = 'right';
                ctx.textBaseline = 'bottom';
                ctx.fillText(watermarkText, tempCanvas.width - 20, tempCanvas.height - 20);
            } else if (watermarkPosition === 'tile') {
                for (let y = 0; y < tempCanvas.height + watermarkFontSize; y += watermarkFontSize * 2) {
                    for (let x = 0; x < tempCanvas.width + 200; x += watermarkText.length * (watermarkFontSize / 2)) {
                        ctx.save();
                        ctx.translate(x, y);
                        ctx.rotate(-0.25); // ~15 degrees
                        ctx.fillText(watermarkText, 0, 0);
                        ctx.restore();
                    }
                }
            }
        } else if (watermarkMode === 'image' && watermarkImage) {
            const scale = watermarkScale;
            const imgWidth = watermarkImage.width * scale;
            const imgHeight = watermarkImage.height * scale;
    
            if (watermarkPosition === 'center') {
                ctx.drawImage(watermarkImage, (tempCanvas.width - imgWidth) / 2, (tempCanvas.height - imgHeight) / 2, imgWidth, imgHeight);
            } else if (watermarkPosition === 'bottom-right') {
                ctx.drawImage(watermarkImage, tempCanvas.width - imgWidth - 20, tempCanvas.height - imgHeight - 20, imgWidth, imgHeight);
            } else if (watermarkPosition === 'tile') {
                for (let y = 0; y < tempCanvas.height; y += imgHeight + 50) {
                    for (let x = 0; x < tempCanvas.width; x += imgWidth + 50) {
                        ctx.drawImage(watermarkImage, x, y, imgWidth, imgHeight);
                    }
                }
            }
        }
    
        updateImageFromCanvas(tempCanvas);
        setAdjustments(defaultAdjustments);
    };
    
    const handleAiEnhance = async () => {
        if (!canvasRef.current) return;
        setIsLoading(true);
        setLoadingMessage('AI is enhancing your image...');
        setError(null);
    
        try {
            // FIX: Use process.env.API_KEY as per guidelines.
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
        setIsCropping(false);
    };

    const renderEditor = () => (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-950 p-4 border border-slate-700 rounded-lg flex items-center justify-center min-h-[50vh] relative">
            <canvas ref={canvasRef} className="max-w-full max-h-[70vh] object-contain" />
            {isCropping && (
                <div 
                    className="absolute border-2 border-dashed border-primary bg-primary/20 cursor-move"
                    style={{ left: cropBox.x, top: cropBox.y, width: cropBox.width, height: cropBox.height }}
                >
                </div>
            )}
          </div>
          <div className="lg:col-span-1 space-y-4">
              <div>
                  <h3 className="font-bold text-lg mb-2">Transform</h3>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <button onClick={() => handleAdjustmentChange('rotation', (adjustments.rotation + 90) % 360)} className="p-2 bg-slate-700 rounded-md hover:bg-slate-600">Rotate 90°</button>
                    <button onClick={() => handleAdjustmentChange('flipH', !adjustments.flipH)} className="p-2 bg-slate-700 rounded-md hover:bg-slate-600">Flip H</button>
                    <button onClick={() => setIsCropping(!isCropping)} className={`p-2 rounded-md ${isCropping ? 'bg-primary text-slate-900' : 'bg-slate-700 hover:bg-slate-600'}`}>Crop</button>
                    <button onClick={() => handleAdjustmentChange('flipV', !adjustments.flipV)} className="p-2 bg-slate-700 rounded-md hover:bg-slate-600">Flip V</button>
                  </div>
                  {isCropping && <button onClick={handleApplyCrop} className="w-full p-2 bg-accent text-white rounded-md">Apply Crop</button>}
                  <div className="space-y-2">
                    <div className="flex gap-2 items-center">
                        <input type="number" value={resizeWidth} onChange={e => setResizeWidth(parseInt(e.target.value))} className="w-full p-1 bg-slate-800 border border-slate-600 rounded-md" />
                        <span>x</span>
                        <input type="number" value={resizeHeight} onChange={e => setResizeHeight(parseInt(e.target.value))} className="w-full p-1 bg-slate-800 border border-slate-600 rounded-md" />
                    </div>
                    <button onClick={handleApplyResize} className="w-full p-2 bg-slate-700 rounded-md hover:bg-slate-600">Apply Resize</button>
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
              
              {/* Watermark Section */}
              <div>
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><WatermarkIcon className="w-5 h-5"/>Watermark</h3>
                <div className="p-2 bg-slate-800/50 rounded-md space-y-3">
                    <div className="flex gap-1 bg-slate-700 p-1 rounded-md">
                        <button onClick={() => setWatermarkMode('text')} className={`w-1/2 p-1 rounded-sm text-sm font-semibold ${watermarkMode === 'text' ? 'bg-primary text-slate-900' : 'hover:bg-slate-600'}`}>Text</button>
                        <button onClick={() => setWatermarkMode('image')} className={`w-1/2 p-1 rounded-sm text-sm font-semibold ${watermarkMode === 'image' ? 'bg-primary text-slate-900' : 'hover:bg-slate-600'}`}>Image</button>
                    </div>
                    {watermarkMode === 'text' ? (
                        <div className="space-y-2">
                            <input type="text" value={watermarkText} onChange={e => setWatermarkText(e.target.value)} placeholder="Watermark Text" className="w-full p-1 bg-slate-800 border border-slate-600 rounded-md" />
                            <div className="flex gap-2">
                                <input type="number" value={watermarkFontSize} onChange={e => setWatermarkFontSize(parseInt(e.target.value))} className="w-1/2 p-1 bg-slate-800 border border-slate-600 rounded-md" placeholder="Size"/>
                                <input type="color" value={watermarkColor} onChange={e => setWatermarkColor(e.target.value)} className="w-1/2 p-1 bg-slate-800 border border-slate-600 rounded-md" />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {!watermarkImage && <FileDropzone onDrop={handleWatermarkImageDrop} accept={{ 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'] }} multiple={false} instructions="Drop logo"/>}
                            {watermarkImage && <div className="text-center p-2 bg-slate-700 rounded-md"><img src={watermarkImage.src} className="max-h-16 mx-auto" alt="Watermark preview" /></div>}
                            <label className="block text-xs">Scale: <input type="range" min="0.05" max="1" step="0.05" value={watermarkScale} onChange={e => setWatermarkScale(parseFloat(e.target.value))} className="w-full" /></label>
                        </div>
                    )}
                    <label className="block text-xs">Opacity: <input type="range" min="0.1" max="1" step="0.1" value={watermarkOpacity} onChange={e => setWatermarkOpacity(parseFloat(e.target.value))} className="w-full" /></label>
                    <select value={watermarkPosition} onChange={e => setWatermarkPosition(e.target.value)} className="w-full p-1 bg-slate-800 border border-slate-600 rounded-md text-sm">
                        <option value="center">Center</option>
                        <option value="bottom-right">Bottom Right</option>
                        <option value="tile">Tile</option>
                    </select>
                    <button onClick={handleApplyWatermark} className="w-full p-2 bg-slate-700 rounded-md hover:bg-slate-600 text-sm font-semibold">Apply Watermark</button>
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