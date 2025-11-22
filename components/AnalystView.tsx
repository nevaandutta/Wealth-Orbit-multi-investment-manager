import React from 'react';
import { AppData, AssetType } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';

interface AnalystViewProps {
  data: AppData;
}

export const AnalystView: React.FC<AnalystViewProps> = ({ data }) => {
  
  // Risk Analysis Data
  const riskScatterData = data.clients.map(client => {
    const clientInvestments = data.investments.filter(i => i.clientId === client.id);
    const totalValue = clientInvestments.reduce((sum, i) => sum + (i.quantity * i.currentPrice), 0);
    
    // Simple risk score: Crypto=10, Stock=7, RealEstate=5, Fund=4, Bond=2, Cash=1
    let weightedRisk = 0;
    if (totalValue > 0) {
        clientInvestments.forEach(inv => {
            let weight = 1;
            if (inv.type === AssetType.CRYPTO) weight = 10;
            else if (inv.type === AssetType.STOCK) weight = 7;
            else if (inv.type === AssetType.REAL_ESTATE) weight = 5;
            else if (inv.type === AssetType.MUTUAL_FUND) weight = 4;
            else if (inv.type === AssetType.BOND) weight = 2;
            
            weightedRisk += (inv.quantity * inv.currentPrice * weight);
        });
        weightedRisk = weightedRisk / totalValue;
    }

    return {
        x: weightedRisk, // Risk Score
        y: totalValue,   // Portfolio Value
        z: client.name,
        name: client.name,
        profile: client.riskProfile
    };
  });

  // Sector Performance Mockup (derived from asset names roughly)
  const assets = data.investments.map(i => {
      const gain = (i.currentPrice - i.purchasePrice) / i.purchasePrice * 100;
      return {
          name: i.symbol,
          gain: gain,
          type: i.type
      }
  }).sort((a, b) => b.gain - a.gain);

  return (
    <div className="p-6 h-full overflow-y-auto space-y-8">
        <header>
            <h2 className="text-3xl font-bold text-slate-800">Analyst Workstation</h2>
            <p className="text-slate-500">Deep dive into portfolio metrics and risk analysis</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Risk vs Value Scatter */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold mb-2">Risk vs. Portfolio Size</h3>
                <p className="text-xs text-slate-400 mb-4">X: Risk Score (1-10), Y: AUM ($)</p>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid />
                            <XAxis type="number" dataKey="x" name="Risk" unit="" domain={[0, 10]} />
                            <YAxis type="number" dataKey="y" name="Value" unit="$" />
                            <ZAxis type="category" dataKey="name" name="Client" />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Scatter name="Clients" data={riskScatterData} fill="#8884d8">
                                {riskScatterData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.profile === 'High' ? '#ef4444' : entry.profile === 'Medium' ? '#eab308' : '#22c55e'} />
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2 text-xs">
                    <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500"></div> High Risk Profile</span>
                    <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-yellow-500"></div> Medium Risk Profile</span>
                    <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500"></div> Low Risk Profile</span>
                </div>
            </div>

             {/* Asset Performance */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold mb-4">Top Performing Assets (%)</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={assets.slice(0, 8)} layout="vertical" margin={{left: 20}}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={60} />
                            <Tooltip formatter={(val:number) => `${val.toFixed(2)}%`} />
                            <Bar dataKey="gain" fill="#10b981" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
             </div>
        </div>

        {/* Raw Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-semibold text-slate-700">Raw Asset Data</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-white text-slate-500 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-3">Symbol</th>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3">Current Price</th>
                            <th className="px-6 py-3">Purchase Price</th>
                            <th className="px-6 py-3">Spread</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {assets.map((asset, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                                <td className="px-6 py-3 font-medium text-slate-900">{asset.name}</td>
                                <td className="px-6 py-3 text-slate-500">{asset.type}</td>
                                <td className="px-6 py-3 text-slate-500">--</td> 
                                <td className="px-6 py-3 text-slate-500">--</td>
                                <td className={`px-6 py-3 font-medium ${asset.gain > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {asset.gain.toFixed(2)}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};
// Helper for ScatterChart
import { Cell } from 'recharts';
