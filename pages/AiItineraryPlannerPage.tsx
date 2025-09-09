
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import ToolPageLayout from '../components/ToolPageLayout';
import Loader from '../components/Loader';
import { ChevronDownIcon } from '../components/Icons';

type TravelStyle = 'Relaxation' | 'Adventure' | 'Cultural' | 'Family-friendly' | 'Foodie';
type Budget = 'Budget' | 'Mid-range' | 'Luxury';

interface Activity {
    time: string;
    description: string;
    location?: string;
}

interface ItineraryDay {
    day: number;
    title: string;
    activities: Activity[];
}

interface ItineraryResult {
    tripTitle: string;
    itinerary: ItineraryDay[];
}

const AiItineraryPlannerPage: React.FC = () => {
    const [destination, setDestination] = useState('');
    const [duration, setDuration] = useState(7);
    const [style, setStyle] = useState<TravelStyle>('Relaxation');
    const [budget, setBudget] = useState<Budget>('Mid-range');
    const [notes, setNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ItineraryResult | null>(null);
    const [openDay, setOpenDay] = useState<number | null>(0);

    const handleGenerate = async () => {
        if (!destination.trim()) {
            setError('Please enter a destination.');
            return;
        }

        if (!import.meta.env.VITE_API_KEY) {
            setError("AI features are disabled. Add VITE_API_KEY in Vercel settings.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        const prompt = `Create a travel itinerary for a trip to ${destination}.
        - Duration: ${duration} days.
        - Travel Style: ${style}.
        - Budget: ${budget}.
        - Additional Notes: ${notes || 'None'}.
        
        Generate a day-by-day plan. For each day, provide a thematic title and suggest activities for the morning, afternoon, and evening, including potential locations if applicable.`;

        try {
            const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ parts: [{ text: prompt }] }],
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            tripTitle: { type: Type.STRING, description: "A creative title for the trip itinerary." },
                            itinerary: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        day: { type: Type.NUMBER, description: "The day number of the itinerary." },
                                        title: { type: Type.STRING, description: "A thematic title for the day's activities." },
                                        activities: {
                                            type: Type.ARRAY,
                                            items: {
                                                type: Type.OBJECT,
                                                properties: {
                                                    time: { type: Type.STRING, description: 'e.g., Morning, Afternoon, Evening' },
                                                    description: { type: Type.STRING, description: "A description of the activity." },
                                                    location: { type: Type.STRING, description: "The specific location of the activity. Can be an empty string if not applicable." },
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                },
            });

            const parsedData: ItineraryResult = JSON.parse(response.text);
            setResult(parsedData);
            setOpenDay(0);

        } catch (e) {
            console.error(e);
            setError('An AI error occurred. Please check your request or try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ToolPageLayout
            title="AI Itinerary Planner"
            description="Plan your next voyage or business trip with an AI-powered itinerary generator."
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="md:col-span-1 space-y-4">
                    <h3 className="text-xl font-bold font-heading text-white">Trip Details</h3>
                    <div>
                        <label className="block font-semibold mb-1">Destination</label>
                        <input type="text" value={destination} onChange={e => setDestination(e.target.value)} placeholder="e.g., Paris, France" className="w-full p-2 border rounded-md bg-slate-800 border-slate-600" />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Duration (days)</label>
                        <input type="number" value={duration} onChange={e => setDuration(parseInt(e.target.value, 10))} min="1" max="30" className="w-full p-2 border rounded-md bg-slate-800 border-slate-600" />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Travel Style</label>
                        <select value={style} onChange={e => setStyle(e.target.value as TravelStyle)} className="w-full p-2 border rounded-md bg-slate-800 border-slate-600">
                            <option>Relaxation</option>
                            <option>Adventure</option>
                            <option>Cultural</option>
                            <option>Family-friendly</option>
                            <option>Foodie</option>
                        </select>
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Budget</label>
                        <select value={budget} onChange={e => setBudget(e.target.value as Budget)} className="w-full p-2 border rounded-md bg-slate-800 border-slate-600">
                            <option>Budget</option>
                            <option>Mid-range</option>
                            <option>Luxury</option>
                        </select>
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Additional Notes</label>
                        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="e.g., Must visit the Louvre, prefer vegetarian food" className="w-full p-2 border rounded-md bg-slate-800 border-slate-600"></textarea>
                    </div>
                    <button onClick={handleGenerate} disabled={isLoading} className="w-full px-8 py-3 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg disabled:bg-slate-600">
                        {isLoading ? 'Generating...' : 'Generate Itinerary'}
                    </button>
                    {error && <p className="text-red-500 text-center font-semibold mt-2">{error}</p>}
                </div>

                {/* Result Section */}
                <div className="md:col-span-2">
                    <h3 className="text-xl font-bold font-heading text-white mb-4">Your Custom Itinerary</h3>
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 min-h-[60vh]">
                        {isLoading && <Loader message="AI is crafting your perfect trip..." />}
                        {!isLoading && !result && <p className="text-slate-400 text-center py-10">Your generated itinerary will appear here.</p>}
                        {result && (
                            <div className="space-y-3">
                                <h2 className="text-2xl font-bold text-primary text-center mb-4">{result.tripTitle}</h2>
                                {result.itinerary.map((day, index) => (
                                    <div key={day.day} className="bg-slate-900 rounded-lg border border-slate-700">
                                        <button onClick={() => setOpenDay(openDay === index ? null : index)} className="w-full flex justify-between items-center p-4 text-left font-semibold">
                                            <span>Day {day.day}: {day.title}</span>
                                            <ChevronDownIcon className={`w-5 h-5 transition-transform ${openDay === index ? 'rotate-180' : ''}`} />
                                        </button>
                                        {openDay === index && (
                                            <div className="p-4 border-t border-slate-700 space-y-4">
                                                {day.activities.map(activity => (
                                                    <div key={activity.time} className="pl-4 border-l-2 border-primary/50">
                                                        <p className="font-bold text-primary">{activity.time}</p>
                                                        <p className="text-slate-300">{activity.description}</p>
                                                        {activity.location && <p className="text-xs text-slate-400">Location: {activity.location}</p>}
                                                    </div>
                                                ))}
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

export default AiItineraryPlannerPage;
