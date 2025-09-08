
import React, { useState } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';

interface CrewMember {
  id: number;
  name: string;
  role: string;
}

const CrewRosterPlannerPage: React.FC = () => {
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([
    { id: 1, name: 'John Doe', role: 'Captain' },
    { id: 2, name: 'Jane Smith', role: 'First Mate' },
  ]);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');

  const addCrewMember = () => {
    if (newName && newRole) {
      setCrewMembers([...crewMembers, { id: Date.now(), name: newName, role: newRole }]);
      setNewName('');
      setNewRole('');
    }
  };

  const removeCrewMember = (id: number) => {
    setCrewMembers(crewMembers.filter(member => member.id !== id));
  };
  
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <ToolPageLayout
      title="Crew Roster Planner"
      description="A specialized tool to manage maritime crew schedules, assignments, and ensure compliance with rest hours."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Crew Management */}
        <div className="lg:col-span-1 bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg border border-transparent dark:border-slate-700 shadow-md dark:shadow-none">
          <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Manage Crew</h3>
          <div className="space-y-2 mb-4">
            {crewMembers.map(member => (
              <div key={member.id} className="flex justify-between items-center p-2 bg-white dark:bg-slate-700 rounded-md shadow-sm">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-gray-200">{member.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{member.role}</p>
                </div>
                <button onClick={() => removeCrewMember(member.id)} className="text-red-500 font-bold text-lg">&times;</button>
              </div>
            ))}
          </div>
          <div className="space-y-2 border-t pt-4 border-slate-200 dark:border-slate-600">
            <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Name" className="w-full p-2 border rounded-md bg-white dark:bg-slate-800 border-transparent dark:border-slate-600 shadow-sm focus:ring-2 focus:ring-primary" />
            <input type="text" value={newRole} onChange={e => setNewRole(e.target.value)} placeholder="Role" className="w-full p-2 border rounded-md bg-white dark:bg-slate-800 border-transparent dark:border-slate-600 shadow-sm focus:ring-2 focus:ring-primary" />
            <button onClick={addCrewMember} className="w-full px-4 py-2 bg-primary text-slate-900 font-semibold rounded-md shadow-sm">Add Crew Member</button>
          </div>
        </div>

        {/* Roster Grid */}
        <div className="lg:col-span-2">
            <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Weekly Roster</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-lg shadow-md">
                    <thead className="bg-slate-50 dark:bg-slate-900/50">
                        <tr>
                            <th className="p-2 border-b border-slate-200 dark:border-slate-600 text-left text-slate-800 dark:text-gray-200">Crew / Day</th>
                            {days.map(day => <th key={day} className="p-2 border-b border-slate-200 dark:border-slate-600 text-slate-800 dark:text-gray-200">{day}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {crewMembers.map(member => (
                            <tr key={member.id} className="text-slate-800 dark:text-gray-200">
                                <td className="p-2 border-b border-slate-200 dark:border-slate-600 font-semibold">{member.name}</td>
                                {days.map(day => (
                                    <td key={`${member.id}-${day}`} className="p-2 border-b border-slate-200 dark:border-slate-600 text-center">
                                        <select className="w-full p-1 border rounded-md bg-slate-100 dark:bg-slate-700 border-transparent dark:border-slate-600 text-sm shadow-sm focus:ring-2 focus:ring-primary">
                                            <option>Off</option>
                                            <option>On Watch (00-04)</option>
                                            <option>On Watch (04-08)</option>
                                            <option>On Watch (08-12)</option>
                                            <option>On Watch (12-16)</option>
                                            <option>On Watch (16-20)</option>
                                            <option>On Watch (20-24)</option>
                                            <option>Standby</option>
                                        </select>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="text-center mt-8">
                <button onClick={() => alert('Roster saved!')} className="px-8 py-3 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg">Save Roster</button>
            </div>
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default CrewRosterPlannerPage;
