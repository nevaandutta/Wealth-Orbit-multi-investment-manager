import React, { useMemo } from 'react';
import { AppData, AssetType } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users } from 'lucide-react';

interface DashboardProps {
  data: AppData;
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const stats = useMemo(() => {
    const totalClients = data.clients.length;
    let totalAUM = 0; // Assets Under Management
    let totalInvested = 0;

    const assetAllocation: Record<string, number> = {};

    data.investments.forEach(inv => {
      const value = inv.quantity * inv.currentPrice;
      const cost = inv.quantity * inv.purchasePrice;
      
      totalAUM += value;
      totalInvested += cost;

      assetAllocation[inv.type] = (assetAllocation[inv.type] || 0) + value;
    });

    const totalReturn = totalAUM - totalInvested;
    const returnPercentage = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

    return {
      totalClients,
      totalAUM,
      totalReturn,
      returnPercentage,
      assetAllocation
    };
  }, [data]);

  const pieData = Object.keys(stats.assetAllocation).map(key => ({
    name: key,
    value: stats.assetAllocation[key]
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const clientPerformance = data.clients.map(client => {
    const clientInvestments = data.investments.filter(i => i.clientId === client.id);
    const value = clientInvestments.reduce((acc, curr) => acc + (curr.quantity * curr.currentPrice), 0);
    return {
      name: client.name.split(' ')[0], // First name
      value: value
    };
  }).sort((a, b) => b.value - a.value);

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-slate-500">Overview of your firm's performance</p>
      </header>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total AUM</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                ${stats.totalAUM.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
             <span className="text-green-600 font-medium flex items-center">
               <TrendingUp size={16} className="mr-1" /> +2.4%
             </span>
             <span className="text-slate-400 ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Profit</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                ${stats.totalReturn.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </h3>
            </div>
            <div className={`p-2 rounded-lg ${stats.totalReturn >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {stats.totalReturn >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            </div>
          </div>
           <div className="mt-4 flex items-center text-sm">
             <span className={`${stats.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
               {stats.returnPercentage.toFixed(2)}%
             </span>
             <span className="text-slate-400 ml-2">all time return</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Clients</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.totalClients}</h3>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
             <span className="text-green-600 font-medium">+1</span>
             <span className="text-slate-400 ml-2">new this month</span>
          </div>
        </div>

         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Top Asset Class</p>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {pieData.sort((a,b) => b.value - a.value)[0]?.name || 'N/A'}
              </h3>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
              <PieChart size={20} />
            </div>
          </div>
           <div className="mt-4 text-sm text-slate-400">
             Dominant portfolio strategy
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Allocation */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Asset Allocation</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Clients */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Top Clients by Portfolio Value</h3>
          <div className="h-80">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={clientPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" tickFormatter={(val) => `$${val/1000}k`} />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                <Bar dataKey="value" fill="#4F46E5" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};