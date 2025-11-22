import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ClientList } from './components/ClientList';
import { AnalystView } from './components/AnalystView';
import { ChatBot } from './components/ChatBot';
import { getMockData } from './services/mockData';
import { AppData } from './types';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [data, setData] = useState<AppData | null>(null);

  useEffect(() => {
    // Simulate fetching data
    const rawData = getMockData();
    setData(rawData);
  }, []);

  if (!data) return <div className="flex items-center justify-center h-screen bg-slate-100">Loading...</div>;

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans text-slate-900">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <main className="flex-1 flex flex-col min-w-0 bg-white/50 overflow-hidden relative">
        {activeView === 'dashboard' && <Dashboard data={data} />}
        {activeView === 'clients' && <ClientList data={data} />}
        {activeView === 'analytics' && <AnalystView data={data} />}

        {/* ChatBot Overlay - Available on all screens */}
        <ChatBot data={data} />
      </main>
    </div>
  );
}

export default App;