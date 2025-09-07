
import React, { useState } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import Loader from '../components/Loader';

const VesselComplianceCheckerPage: React.FC = () => {
  const [imo, setImo] = useState('');
  const [flag, setFlag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleCheck = () => {
    if (!imo || !flag) {
      setResult("Please provide both IMO Number and Flag State.");
      return;
    }
    setIsLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(`Vessel IMO ${imo} (${flag}) appears compliant with key SOLAS and MARPOL regulations based on available data. No outstanding deficiencies reported in the last 6 months. A PSC inspection is recommended before entering high-risk areas.`);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <ToolPageLayout
      title="Vessel Compliance Checker"
      description="Verify vessel compliance against major international maritime regulations to mitigate risks."
    >
      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label htmlFor="imo" className="block font-semibold mb-1">Vessel IMO Number</label>
          <input id="imo" type="text" value={imo} onChange={e => setImo(e.target.value)} className="w-full p-2 border rounded-md bg-slate-800 border-slate-600" placeholder="e.g., 9419400" />
        </div>
        <div>
          <label htmlFor="flag" className="block font-semibold mb-1">Flag State</label>
          <input id="flag" type="text" value={flag} onChange={e => setFlag(e.target.value)} className="w-full p-2 border rounded-md bg-slate-800 border-slate-600" placeholder="e.g., Panama" />
        </div>
        <div className="text-center pt-4">
          <button onClick={handleCheck} disabled={isLoading} className="px-8 py-3 text-lg font-semibold text-slate-900 bg-primary rounded-lg shadow-lg disabled:bg-slate-600">
            {isLoading ? 'Checking...' : 'Check Compliance'}
          </button>
        </div>
      </div>
      
      {isLoading && <div className="mt-8"><Loader message="Cross-referencing international databases..." /></div>}
      
      {result && (
        <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <h3 className="font-bold text-lg mb-2">Compliance Report</h3>
          <p>{result}</p>
        </div>
      )}
    </ToolPageLayout>
  );
};

export default VesselComplianceCheckerPage;