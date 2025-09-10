
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import ToolPageLayout from '../components/ToolPageLayout';
import FileDropzone from '../components/FileDropzone';
import Loader from '../components/Loader';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const AiDocumentAnalyzerPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const currentFile = acceptedFiles[0];
      setFile(currentFile);
      setError(null);

      if (!import.meta.env.VITE_API_KEY) {
        const errorMessage = "VITE_API_KEY is not configured. This AI feature is currently unavailable.";
        setError(errorMessage);
        setMessages([{ role: 'model', text: errorMessage }]);
        return;
      }
      
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
      const newChat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: `You are an expert document analyzer. The user has uploaded a file named '${currentFile.name}'. Answer their questions about this document. Be helpful and thorough.`,
        },
      });
      setChat(newChat);
      setMessages([{ role: 'model', text: `I'm ready to answer your questions about "${currentFile.name}". What would you like to know?` }]);
    }
  }, []);
  
  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !chat) return;

    const userMessage: Message = { role: 'user', text: currentMessage };
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const response = await chat.sendMessage({ message: currentMessage });
      const modelMessage: Message = { role: 'model', text: response.text };
      setMessages(prev => [...prev, modelMessage]);
    } catch (e) {
      console.error(e);
      setError("Sorry, I couldn't process that request. Please try again.");
      setMessages(prev => [...prev, { role: 'model', text: "An error occurred." }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setFile(null);
    setChat(null);
    setMessages([]);
    setError(null);
  };

  return (
    <ToolPageLayout
      title="AI Document Analyzer"
      description="Upload a document and ask questions to get insights, summaries, and answers in a conversational way."
    >
      {!file ? (
        <FileDropzone onDrop={handleFileDrop} accept={{ 'application/pdf': ['.pdf'], 'text/plain': ['.txt'] }} multiple={false} instructions="Drop a document (PDF, TXT) to start" />
      ) : (
        <div className="flex flex-col h-[70vh]">
          <div className="flex justify-between items-center p-2 bg-slate-100 dark:bg-slate-800 rounded-t-lg border-b border-slate-200 dark:border-slate-700 text-slate-800 dark:text-gray-200">
            <p>Analyzing: <strong>{file.name}</strong></p>
            <button onClick={handleReset} className="px-3 py-1 bg-red-500 text-white text-sm rounded-md">Start Over</button>
          </div>
          
          <div className="flex-grow p-4 overflow-y-auto bg-white dark:bg-slate-900 border-x border-slate-200 dark:border-slate-700">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className={`max-w-prose p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary text-slate-900' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-gray-200'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                  <div className="max-w-prose p-3 rounded-lg bg-slate-200 dark:bg-slate-700">
                     <span className="animate-pulse">...</span>
                  </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-b-lg border-t border-slate-200 dark:border-slate-700">
            {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}
            <div className="flex gap-2">
              <input
                type="text"
                value={currentMessage}
                onChange={e => setCurrentMessage(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && !isLoading && handleSendMessage()}
                placeholder="Ask a question about your document..."
                className="flex-grow p-2 border rounded-md bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 shadow-sm dark:shadow-none focus:ring-2 focus:ring-primary"
                disabled={!chat}
              />
              <button onClick={handleSendMessage} disabled={isLoading || !currentMessage || !chat} className="px-6 py-2 font-semibold text-slate-900 bg-primary rounded-lg disabled:bg-slate-600">Send</button>
            </div>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
};

export default AiDocumentAnalyzerPage;
