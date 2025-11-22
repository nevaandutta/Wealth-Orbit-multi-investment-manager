import React, { useState } from 'react';
import { AppData, Client, Investment } from '../types';
import { ChevronRight, Search, ArrowUpRight, ArrowDownRight, Briefcase, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface ClientListProps {
  data: AppData;
}

export const ClientList: React.FC<ClientListProps> = ({ data }) => {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = data.clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getClientValue = (clientId: string) => {
    return data.investments
      .filter(i => i.clientId === clientId)
      .reduce((sum, i) => sum + (i.quantity * i.currentPrice), 0);
  };

  const getClientReturn = (clientId: string) => {
      const investments = data.investments.filter(i => i.clientId === clientId);
      if (investments.length === 0) return 0;
      
      const currentVal = investments.reduce((sum, i) => sum + (i.quantity * i.currentPrice), 0);
      const costBasis = investments.reduce((sum, i) => sum + (i.quantity * i.purchasePrice), 0);
      
      return costBasis > 0 ? ((currentVal - costBasis) / costBasis) * 100 : 0;
  };

  return (
    <div className="flex h-full">
      {/* Left Panel: Client List */}
      <div className={`${selectedClient ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 flex-col border-r border-slate-200 bg-white`}>
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search clients..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg outline-none text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-y-auto flex-1">
          {filteredClients.map(client => {
            const totalValue = getClientValue(client.id);
            const returnPct = getClientReturn(client.id);
            
            return (
              <div 
                key={client.id}
                onClick={() => setSelectedClient(client.id)}
                className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${selectedClient === client.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <img src={client.avatarUrl} alt={client.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 truncate">{client.name}</h4>
                    <p className="text-xs text-slate-500 truncate">{client.email}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-sm font-bold text-slate-700">${(totalValue/1000).toFixed(1)}k</p>
                     <p className={`text-xs flex items-center justify-end ${returnPct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                       {returnPct >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                       {Math.abs(returnPct).toFixed(1)}%
                     </p>
                  </div>
                  <ChevronRight size={16} className="text-slate-300" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Panel: Detail View */}
      <div className={`${selectedClient ? 'flex' : 'hidden md:flex'} w-full md:w-2/3 flex-col bg-slate-50`}>
        {selectedClient ? (
            <ClientDetailView clientId={selectedClient} data={data} onBack={() => setSelectedClient(null)} />
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <Briefcase size={64} className="mb-4 text-slate-300" />
                <p>Select a client to view their portfolio</p>
            </div>
        )}
      </div>
    </div>
  );
};

const ClientDetailView: React.FC<{ clientId: string, data: AppData, onBack: () => void }> = ({ clientId, data, onBack }) => {
  const client = data.clients.find(c => c.id === clientId);
  const investments = data.investments.filter(i => i.clientId === clientId);
  
  if (!client) return null;

  const totalValue = investments.reduce((sum, i) => sum + (i.quantity * i.currentPrice), 0);
  const totalCost = investments.reduce((sum, i) => sum + (i.quantity * i.purchasePrice), 0);
  const totalReturn = totalValue - totalCost;
  const returnPercentage = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;

  return (
    <div className="flex flex-col h-full overflow-hidden">
        <div className="p-6 bg-white border-b border-slate-200 shadow-sm shrink-0">
             <button onClick={onBack} className="md:hidden mb-4 text-sm text-blue-600 hover:underline">&larr; Back to List</button>
             <div className="flex items-center gap-6">
                 <img src={client.avatarUrl} alt={client.name} className="w-20 h-20 rounded-full border-4 border-slate-100 shadow-sm" />
                 <div>
                     <h2 className="text-2xl font-bold text-slate-900">{client.name}</h2>
                     <div className="flex flex-wrap items-center gap-3 mt-2">
                         {/* Prominent Risk Profile Badge */}
                         <span className={`px-3 py-1 text-sm font-bold rounded-full border shadow-sm flex items-center gap-1.5
                            ${client.riskProfile === 'High' ? 'bg-red-50 text-red-700 border-red-200' : 
                              client.riskProfile === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                            {client.riskProfile === 'High' && <TrendingUp size={14} />}
                            {client.riskProfile === 'Medium' && <Briefcase size={14} />}
                            {client.riskProfile === 'Low' && <Briefcase size={14} />}
                            {client.riskProfile} Risk Profile
                         </span>
                         <span className="text-slate-500 text-sm flex items-center gap-1 ml-2">
                            <Briefcase size={14} className="text-slate-400" />
                            Joined {new Date(client.joinedDate).toLocaleDateString()}
                         </span>
                     </div>
                 </div>
             </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
            {/* Portfolio Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                        <DollarSign size={48} className="text-blue-600" />
                    </div>
                    <p className="text-sm text-slate-500 font-medium mb-1">Total Portfolio Value</p>
                    <p className="text-3xl font-bold text-slate-900">${totalValue.toLocaleString()}</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                        {totalReturn >= 0 ? <TrendingUp size={48} className="text-green-600" /> : <TrendingDown size={48} className="text-red-600" />}
                    </div>
                    <p className="text-sm text-slate-500 font-medium mb-1">Total Return ($)</p>
                    <p className={`text-3xl font-bold ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {totalReturn >= 0 ? '+' : ''}${Math.abs(totalReturn).toLocaleString()}
                    </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-3 opacity-10">
                        <Briefcase size={48} className="text-purple-600" />
                    </div>
                     <p className="text-sm text-slate-500 font-medium mb-1">Overall Return (%)</p>
                     <div className="flex items-center gap-2">
                        <span className={`text-3xl font-bold ${returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {returnPercentage >= 0 ? '+' : ''}{returnPercentage.toFixed(2)}%
                        </span>
                     </div>
                </div>
            </div>

            <h3 className="text-lg font-semibold mb-4 text-slate-800">Holdings</h3>
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-4">Asset</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4 text-right">Qty</th>
                            <th className="px-6 py-4 text-right">Avg Price</th>
                            <th className="px-6 py-4 text-right">Cur. Price</th>
                            <th className="px-6 py-4 text-right">Value</th>
                            <th className="px-6 py-4 text-right">Return</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {investments.map(inv => {
                            const val = inv.quantity * inv.currentPrice;
                            const cost = inv.quantity * inv.purchasePrice;
                            const ret = val - cost;
                            const retPct = (ret / cost) * 100;
                            
                            return (
                                <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-medium text-slate-900">{inv.symbol}</div>
                                            <div className="text-xs text-slate-500">{inv.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700">
                                            {inv.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-slate-600">{inv.quantity.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right text-slate-600">${inv.purchasePrice.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right font-medium text-slate-900">${inv.currentPrice.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-900">${val.toLocaleString()}</td>
                                    <td className={`px-6 py-4 text-right font-medium ${ret >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {ret >= 0 ? '+' : ''}{retPct.toFixed(2)}%
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {investments.length === 0 && (
                    <div className="p-8 text-center text-slate-500">No investments found for this client.</div>
                )}
            </div>
        </div>
    </div>
  );
};