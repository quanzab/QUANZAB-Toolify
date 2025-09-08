
import React, { useState, useCallback, useRef } from 'react';
import { PDFDocument, PageSizes } from 'pdf-lib';
import saveAs from 'file-saver';
import ToolPageLayout from '../components/ToolPageLayout';
import FileDropzone from '../components/FileDropzone';
import Loader from '../components/Loader';

type PageSize = 'A4' | 'Letter';
type Orientation = 'Portrait' | 'Landscape';

interface ImageFile {
  file: File;
  preview: string;
}

const ImageToPdfPage: React.FC = () => {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<PageSize>('A4');
  const [orientation, setOrientation] = useState<Orientation>('Portrait');
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    const newImageFiles = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFiles(prev => [...prev, ...newImageFiles]);
  }, []);
  
  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleDragSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const newFiles = [...files];
    const draggedItemContent = newFiles.splice(dragItem.current, 1)[0];
    newFiles.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setFiles(newFiles);
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      setError('Please upload at least one image.');
      return;
    }
    setIsLoading(true);
    setError(null);
    
    try {
      const pdfDoc = await PDFDocument.create();
      
      for (const imageFile of files) {
        const fileBytes = await imageFile.file.arrayBuffer();
        let image;
        if (imageFile.file.type === 'image/png') {
            image = await pdfDoc.embedPng(fileBytes);
        } else { // Assume JPG/JPEG
            image = await pdfDoc.embedJpg(fileBytes);
        }

        let pageDims = PageSizes[pageSize];
        if (orientation === 'Landscape') {
            pageDims = [pageDims[1], pageDims[0]];
        }
        
        const page = pdfDoc.addPage(pageDims);
        const { width: pageWidth, height: pageHeight } = page.getSize();
        
        const imageAspectRatio = image.width / image.height;
        const pageAspectRatio = pageWidth / pageHeight;

        let scaledWidth, scaledHeight;
        if (imageAspectRatio > pageAspectRatio) {
            scaledWidth = pageWidth * 0.9;
            scaledHeight = scaledWidth / imageAspectRatio;
        } else {
            scaledHeight = pageHeight * 0.9;
            scaledWidth = scaledHeight * imageAspectRatio;
        }

        const x = (pageWidth - scaledWidth) / 2;
        const y = (pageHeight - scaledHeight) / 2;
        
        page.drawImage(image, { x, y, width: scaledWidth, height: scaledHeight });
      }

      const pdfBytes = await pdfDoc.save();
      saveAs(new Blob([pdfBytes], { type: 'application/pdf' }), 'converted_images.pdf');
      setFiles([]);
    } catch (e) {
      console.error(e);
      setError('An error occurred during conversion. Please ensure all files are valid images.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToolPageLayout
      title="Image to PDF Converter"
      description="Convert your JPG, PNG, and other images into a single, organized PDF document. Drag to reorder."
    >
      {isLoading ? (
        <Loader message="Converting images to PDF..." />
      ) : (
        <div className="space-y-6">
          <FileDropzone
            onDrop={handleDrop}
            accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }}
            multiple={true}
            instructions="Drag and drop image files here"
          />
          
          {files.length > 0 && (
            <div>
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <h3 className="font-bold text-lg mb-4">Uploaded Images ({files.length})</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {files.map((imageFile, index) => (
                    <div
                      key={`${imageFile.file.name}-${index}`}
                      className="relative group cursor-grab active:cursor-grabbing"
                      draggable
                      onDragStart={() => dragItem.current = index}
                      onDragEnter={() => dragOverItem.current = index}
                      onDragEnd={handleDragSort}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      <img src={imageFile.preview} alt={imageFile.file.name} className="w-full h-32 object-cover rounded-md" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs text-center p-1 break-all">{imageFile.file.name}</span>
                      </div>
                      <button onClick={() => handleRemoveFile(index)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm hover:bg-red-700">&times;</button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row gap-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div>
                    <label htmlFor="page-size" className="block font-semibold mb-1">Page Size</label>
                    <select id="page-size" value={pageSize} onChange={e => setPageSize(e.target.value as PageSize)} className="p-2 border rounded-md bg-slate-700 border-slate-600">
                      <option value="A4">A4</option>
                      <option value="Letter">Letter</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="orientation" className="block font-semibold mb-1">Orientation</label>
                    <select id="orientation" value={orientation} onChange={e => setOrientation(e.target.value as Orientation)} className="p-2 border rounded-md bg-slate-700 border-slate-600">
                      <option value="Portrait">Portrait</option>
                      <option value="Landscape">Landscape</option>
                    </select>
                  </div>
              </div>
            </div>
          )}
          
          {error && <p className="text-red-500 text-center font-semibold">{error}</p>}

          <div className="mt-6 text-center">
            <button
              onClick={handleConvert}
              disabled={files.length === 0}
              className="w-full sm:w-auto px-12 py-4 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg hover:bg-opacity-90 disabled:bg-slate-600"
            >
              Convert to PDF
            </button>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
};

export default ImageToPdfPage;
