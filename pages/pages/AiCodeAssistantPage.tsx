import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import ToolPageLayout from '../components/ToolPageLayout';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const AiCodeAssistantPage: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // FIX: Use process.env.API_KEY as per the coding guidelines.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const newChat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `You are an expert code assistant. Your name is QUANZAB Code Helper. Provide clean, efficient, and well-explained code. When you provide code blocks, use markdown syntax with the appropriate language identifier (e.g., \`\`\`javascript).`,
      },
    });
    setChat(newChat);
    setMessages([{ role: 'model', text: "Hello! I'm your AI Code Assistant. How can I help you with your code today?" }]);
  }, []);
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !chat || isLoading) return;

    const userMessage: Message = { role: 'user', text: currentMessage };
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await chat.sendMessage({ message: userMessage.text });
      const modelMessage: Message = { role: 'model', text: response.text };
      setMessages(prev => [...prev, modelMessage]);
    } catch (e) {
      console.error(e);
      const errorMessage = "Sorry, I encountered an error and couldn't process your request. Please try again.";
      setError(errorMessage);
      setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // A simple markdown to HTML converter for code blocks
  const renderMessageContent = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      const codeBlockMatch = part.match(/^```(\w+)?\n([\s\S]+)```$/);
      if (codeBlockMatch) {
        const language = codeBlockMatch[1] || 'plaintext';
        const code = codeBlockMatch[2];
        return (
          <div key={index} className="bg-slate-900 rounded-md my-2">
            <div className="flex justify-between items-center px-4 py-1 bg-slate-800 rounded-t-md">
              <span className="text-xs font-sans text-gray-400">{language}</span>
              <button onClick={() => navigator.clipboard.writeText(code)} className="text-xs text-gray-400 hover:text-white">Copy</button>
            </div>
            <pre className="p-4 text-sm overflow-x-auto"><code className={`language-${language}`}>{code.trim()}</code></pre>
          </div>
        );
      }
      // FIX: Ensure that the part is not empty or just whitespace before rendering a <p> tag to prevent empty paragraphs from being created by the split.
      if (part.trim()) {
        return <p key={index} className="whitespace-pre-wrap">{part}</p>;
      }
      return null
    });
  };

  return (
    <ToolPageLayout
      title="AI Code Assistant"
      description="Get AI-powered help with coding tasks, from writing snippets to debugging."
    >
      <div className="flex flex-col h-[70vh] bg-slate-950 border border-slate-800 rounded-lg">
        <div className="flex-grow p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-4xl p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary text-slate-900' : 'bg-slate-800 text-gray-200'}`}>
                {renderMessageContent(msg.text)}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-prose p-3 rounded-lg bg-slate-800">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-slate-900 rounded-b-lg border-t border-slate-800">
          {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}
          <div className="flex gap-2">
            <textarea
              value={currentMessage}
              onChange={e => setCurrentMessage(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
              placeholder="Ask a coding question or paste a snippet..."
              className="flex-grow p-2 border rounded-md bg-slate-800 border-slate-700 resize-none"
              rows={2}
              aria-label="Code assistant message input"
            />
            <button onClick={handleSendMessage} disabled={isLoading || !currentMessage.trim()} className="px-6 py-2 font-semibold text-slate-900 bg-primary rounded-lg disabled:bg-slate-600 self-end">Send</button>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default AiCodeAssistantPage;