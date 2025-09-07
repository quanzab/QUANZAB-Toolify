
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import ToolPageLayout from '../components/ToolPageLayout';
import Loader from '../components/Loader';

type Tone = 'Neutral' | 'Formal' | 'Casual' | 'Creative' | 'Concise';

const ParaphraserRewriterPage: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [tone, setTone] = useState<Tone>('Neutral');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRewrite = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to rewrite.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setOutputText('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Paraphrase and rewrite the following text in a ${tone.toLowerCase()} tone:\n\n${inputText}`,
      });
      setOutputText(response.text);
    } catch (e) {
      console.error(e);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const tones: Tone[] = ['Neutral', 'Formal', 'Casual', 'Creative', 'Concise'];

  return (
    <ToolPageLayout
      title="Paraphraser & Rewriter"
      description="Rephrase sentences, improve clarity, and adjust the tone of your writing with AI."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="input-text" className="block font-semibold mb-2">Original Text</label>
            <textarea
              id="input-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={12}
              className="w-full p-3 border rounded-md bg-slate-800 border-slate-600"
              placeholder="Enter your text here..."
            ></textarea>
          </div>
          <div>
            <label htmlFor="output-text" className="block font-semibold mb-2">Rewritten Text</label>
            <div className="w-full h-full p-3 border rounded-md bg-slate-800/50 border-slate-600 whitespace-pre-wrap">
              {isLoading ? <Loader message="AI is rewriting..." /> : outputText}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-4">
          <div className="flex items-center gap-2">
            <label htmlFor="tone-select" className="font-semibold">Tone:</label>
            <select
              id="tone-select"
              value={tone}
              onChange={(e) => setTone(e.target.value as Tone)}
              className="p-2 border rounded-md bg-slate-700 border-slate-600"
            >
              {tones.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <button
            onClick={handleRewrite}
            disabled={isLoading || !inputText}
            className="w-full sm:w-auto px-12 py-3 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg hover:bg-opacity-90 disabled:bg-slate-600"
          >
            {isLoading ? 'Rewriting...' : 'Rewrite'}
          </button>
        </div>

        {error && <p className="text-red-500 text-center font-semibold">{error}</p>}
      </div>
    </ToolPageLayout>
  );
};

export default ParaphraserRewriterPage;