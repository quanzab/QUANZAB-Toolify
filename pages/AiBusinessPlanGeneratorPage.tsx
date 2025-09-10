
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import ToolPageLayout from '../components/ToolPageLayout';
import Loader from '../components/Loader';
import { WandIcon, ChevronDownIcon } from '../components/Icons';

interface BusinessPlan {
    executiveSummary: string;
    companyDescription: string;
    marketAnalysis: string;
    organizationAndManagement: string;
    productsOrServices: string;
    marketingAndSalesStrategy: string;
}

const sectionTitles: { [key in keyof BusinessPlan]: string } = {
    executiveSummary: "Executive Summary",
    companyDescription: "Company Description",
    marketAnalysis: "Market Analysis",
    organizationAndManagement: "Organization and Management",
    productsOrServices: "Products or Services",
    marketingAndSalesStrategy: "Marketing and Sales Strategy",
};

const AiBusinessPlanGeneratorPage: React.FC = () => {
    const [idea, setIdea] = useState('');
    const [audience, setAudience] = useState('');
    const [services, setServices] = useState('');
    
    const [result, setResult] = useState<BusinessPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [openSection, setOpenSection] = useState<keyof BusinessPlan | null>('executiveSummary');

    const handleGenerate = async () => {
        if (!idea.trim() || !audience.trim() || !services.trim()) {
            setError('Please fill in all the business details.');
            return;
        }
        if (!import.meta.env.VITE_API_KEY) {
            setError("VITE_API_KEY is not configured. This AI feature is currently unavailable.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        const prompt = `Generate a comprehensive business plan for the following concept:
        - Business Idea/Name: ${idea}
        - Target Audience: ${audience}
        - Key Products/Services: ${services}

        Structure the output with the following sections: Executive Summary, Company Description, Market Analysis, Organization and Management, Products or Services, and Marketing and Sales Strategy. Each section should contain detailed, professional content.`;

        try {
            const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ parts: [{ text: prompt }] }],
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            executiveSummary: { type: Type.STRING },
                            companyDescription: { type: Type.STRING },
                            marketAnalysis: { type: Type.STRING },
                            organizationAndManagement: { type: Type.STRING },
                            productsOrServices: { type: Type.STRING },
                            marketingAndSalesStrategy: { type: Type.STRING },
                        }
                    },
                },
            });
            const parsedData: BusinessPlan = JSON.parse(response.text);
            setResult(parsedData);
            setOpenSection('executiveSummary');
        } catch (e) {
            console.error(e);
            setError('An AI error occurred while generating the business plan. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const formatPlanForCopy = () => {
        if (!result) return '';
        let text = `# Business Plan: ${idea}\n\n`;
        for (const key in result) {
            const sectionKey = key as keyof BusinessPlan;
            text += `## ${sectionTitles[sectionKey]}\n`;
            text += `${result[sectionKey]}\n\n`;
        }
        return text;
    };
    
    const handleCopy = () => {
        const textToCopy = formatPlanForCopy();
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        }
    };

    const planSections = result ? Object.keys(result) as Array<keyof BusinessPlan> : [];

    return (
        <ToolPageLayout
            title="AI Business Plan Generator"
            description="Generate a structured business plan from a few key details about your idea."
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="md:col-span-1 space-y-4">
                    <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">Your Business Idea</h3>
                    <div>
                        <label className="block font-semibold mb-1 text-slate-700 dark:text-gray-300">Business Name / Idea</label>
                        <input type="text" value={idea} onChange={e => setIdea(e.target.value)} placeholder="e.g., 'Artisan Coffee Roasters'" className="w-full p-2 border rounded-md bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-600" />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1 text-slate-700 dark:text-gray-300">Target Audience</label>
                        <input type="text" value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g., 'Young professionals, students'" className="w-full p-2 border rounded-md bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-600" />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1 text-slate-700 dark:text-gray-300">Key Products/Services</label>
                        <textarea value={services} onChange={e => setServices(e.target.value)} rows={3} placeholder="e.g., 'Single-origin coffee beans, espresso drinks, pastries'" className="w-full p-2 border rounded-md bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-600"></textarea>
                    </div>
                    <button onClick={handleGenerate} disabled={isLoading} className="w-full inline-flex items-center justify-center gap-2 px-8 py-3 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg disabled:bg-slate-600">
                        <WandIcon className="w-5 h-5"/>
                        {isLoading ? 'Generating...' : 'Generate Plan'}
                    </button>
                    {error && <p className="text-red-500 text-center font-semibold mt-2">{error}</p>}
                </div>

                {/* Result Section */}
                <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">Generated Business Plan</h3>
                        {result && (
                             <button onClick={handleCopy} className="px-3 py-1.5 text-sm font-semibold text-slate-800 dark:text-gray-200 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600">
                                {copied ? 'Copied!' : 'Copy Plan'}
                            </button>
                        )}
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 min-h-[60vh]">
                        {isLoading && <Loader message="AI is drafting your business plan..." />}
                        {!isLoading && !result && <p className="text-slate-500 dark:text-slate-400 text-center py-10">Your generated plan will appear here.</p>}
                        {result && (
                            <div className="space-y-3">
                                {planSections.map((key, index) => (
                                    <div key={key} className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <button onClick={() => setOpenSection(openSection === key ? null : key)} className="w-full flex justify-between items-center p-4 text-left font-semibold text-slate-800 dark:text-gray-200">
                                            <span>{sectionTitles[key]}</span>
                                            <ChevronDownIcon className={`w-5 h-5 transition-transform ${openSection === key ? 'rotate-180' : ''}`} />
                                        </button>
                                        {openSection === key && (
                                            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                                                <p className="whitespace-pre-wrap text-slate-600 dark:text-slate-300">{result[key]}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ToolPageLayout>
    );
};

export default AiBusinessPlanGeneratorPage;
