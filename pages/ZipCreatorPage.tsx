
import React, { useState, useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import ToolPageLayout from '../components/ToolPageLayout';
import Loader from '../components/Loader';
import { UploadIcon, ZipIcon } from '../components/Icons';

const ZipCreatorPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zipName, setZipName] = useState('archive.zip');

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    setError(null);
    if (fileRejections.length > 0) {
      setError('Some files were rejected. Please check file types and sizes.');
    }
    if (acceptedFiles.length > 0) {
      setFiles(prevFiles => [...prevFiles, ...acceptedFiles].filter(
        (file, index, self) => index === self.findIndex(f => f.name === file.name && f.size === file.size)
      ));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: true,
    noClick: true,
  });

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  
  const handleCreateZip = async () => {
    if (files.length === 0) {
      setError('Please add at least one file to create a ZIP archive.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const zip = new JSZip();
      for (const file of files) {
        zip.file(file.name, file);
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, zipName.endsWith('.zip') ? zipName : `${zipName}.zip`);
      setFiles([]); // Clear files after successful creation
    } catch (e) {
      console.error(e);
      setError('An error occurred while creating the ZIP file.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToolPageLayout
      title="ZIP File Creator"
      description="Create ZIP archives from multiple files directly in your browser for easy sharing and storage."
    >
      {isLoading ? (
        <Loader message="Creating your ZIP file..." />
      ) : (
        <>
          <div
            {...getRootProps()}
            className={`p-10 border-2 border-dashed rounded-xl text-center transition-colors duration-300 ${
              isDragActive
                ? 'border-primary bg-primary/10'
                : 'border-slate-600 hover:border-primary/70'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center">
              <UploadIcon className="w-16 h-16 text-slate-500 mb-4" />
              <p className="text-xl font-semibold text-gray-200 mb-2">
                {isDragActive ? 'Drop files to add' : "Drag and drop files to create a ZIP"}
              </p>
              <p className="text-slate-400 mb-4">or</p>
              <button
                type="button"
                onClick={open}
                className="px-8 py-3 font-semibold text-slate-900 bg-primary rounded-lg shadow-md hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
              >
                Select Files
              </button>
            </div>
          </div>
          
          {files.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-200 mb-4">Files to ZIP ({files.length}):</h3>
              <ul className="space-y-3 max-h-60 overflow-y-auto p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                {files.map((file, index) => (
                  <li key={`${file.name}-${index}`} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                    <span className="font-medium text-gray-300 truncate pr-4">{file.name}</span>
                    <button onClick={() => handleRemoveFile(index)} className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-900/50 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                  <label htmlFor="zipname" className="block font-semibold text-gray-200 mb-1">ZIP file name:</label>
                  <input id="zipname" type="text" value={zipName} onChange={(e) => setZipName(e.target.value)} className="w-full sm:w-1/2 p-2 border rounded-md bg-slate-800 border-slate-600" />
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-center my-4 font-semibold">{error}</p>}
          
          <div className="mt-8 text-center">
            <button
              onClick={handleCreateZip}
              disabled={files.length === 0}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-12 py-4 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg shadow-primary/20 hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100"
            >
              <ZipIcon className="w-6 h-6"/>
              Create ZIP
            </button>
          </div>
        </>
      )}
    </ToolPageLayout>
  );
};

export default ZipCreatorPage;
