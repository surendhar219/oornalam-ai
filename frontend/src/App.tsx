import React from 'react';
import { ComplaintForm } from './components/ComplaintForm';
import { Landmark, Users } from 'lucide-react';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-slate-100 flex flex-col justify-between">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center text-white font-black text-xl shadow-md">
              ஊ
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">OorNalam AI</h1>
              <p className="text-xs text-slate-500">Multimodal Community Grievance Assistant</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <span className="text-xs bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 font-medium flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-sky-600" />
              Byte Breakers (AARVAM-S-0004)
            </span>
            <span className="text-xs bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-lg text-sky-800 font-medium flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-sky-600" />
              Track: ARSW001
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
        <div className="text-center mb-8">
          <span className="inline-block text-xs font-bold uppercase tracking-wider bg-cyan-100 text-cyan-900 px-3 py-1 rounded-full mb-2">
            Civic AI Copilot for Tamil Nadu
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            A Better Town Begins with Your Voice.
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">
            Report waste accumulation, broken roads, or drainage issues using Tamil/English voice and photos. 
            OorNalam analyzes evidence, clarifies details, and guides you to the verified official portal.
          </p>
        </div>

        <ComplaintForm />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
          <div>
            <p className="text-slate-300 font-medium">OorNalam AI — Aarvam Cybernaut Hackathon 2026</p>
            <p className="text-slate-500">Built by Byte Breakers: Suriyakumaran A, Selvaganapathi A, Harivignesh K, Twin Kumar S, Surendhar R</p>
          </div>
          <div className="flex gap-4">
            <span className="text-slate-500">Pre-Filing Intelligence Layer</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-500">Official Municipal Handoff</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
