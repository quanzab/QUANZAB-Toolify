import React from 'react';
import { useDropzone, FileRejection, Accept } from 'react-dropzone';

interface FileDropzoneProps {
  onDrop: (acceptedFiles: File[], fileRejections: FileRejection[]) => void;
  accept: Accept;
  multiple?: boolean;
  instructions: string;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ onDrop, accept, multiple = false, instructions }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
  });

  return (
    <div
      {...getRootProps()}
      className={`p-10 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors duration-300 ${
        isDragActive
          ? 'border-primary bg-primary/10'
          : 'border-slate-600 hover:border-primary/70 hover:bg-slate-800/50'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center">
        <svg className="w-16 h-16 text-slate-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
        <p className="text-xl font-semibold text-gray-200">
          {isDragActive ? 'Drop the files here...' : instructions}
        </p>
        <p className="text-slate-400 mt-2">or click to select files</p>
      </div>
    </div>
  );
};

export default FileDropzone;