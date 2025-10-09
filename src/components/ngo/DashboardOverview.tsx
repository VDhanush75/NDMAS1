import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Users, Package, CheckCircle } from 'lucide-react';
import StatCard from '../common/StatCard';
import { ngoVolunteers, reliefGoods, assignments, alerts } from '../../data/mockData';

const aidDistributionData = [
  { name: 'Food Kits', distributed: 450, remaining: 50 },
  { name: 'Med Packs', distributed: 800, remaining: 200 },
  { name: 'Blankets', distributed: 650, remaining: 150 },
  { name: 'Jackets', distributed: 150, remaining: 100 },
];

const DashboardOverview: React.FC = () => {
  const activeVolunteers = ngoVolunteers.filter(v => v.status === 'active').length;
  const totalInventory = reliefGoods.reduce((acc, item) => acc + item.quantity, 0);
  const completedAssignments = assignments.filter(a => a.status === 'Completed').length;
  const highPriorityAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'high');

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <StatCard 
          icon={<Users className="w-8 h-8 text-blue-600" />}
          title="Active Volunteers"
          value={activeVolunteers}
          description={`${ngoVolunteers.length} total volunteers`}
          colorClass="bg-blue-100"
        />
        <StatCard 
          icon={<Package className="w-8 h-8 text-green-600" />}
          title="Inventory Items"
          value={totalInventory.toLocaleString()}
          description={`${reliefGoods.length} types of goods`}
          colorClass="bg-green-100"
        />
        <StatCard 
          icon={<CheckCircle className="w-8 h-8 text-purple-600" />}
          title="Completed Tasks"
          value={completedAssignments}
          description={`${assignments.length} total assignments`}
          colorClass="bg-purple-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Aid Distribution Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={aidDistributionData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip cursor={{fill: 'rgba(243, 244, 246, 0.5)'}} contentStyle={{background: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}/>
              <Legend />
              <Bar dataKey="distributed" stackId="a" fill="#3b82f6" name="Distributed" />
              <Bar dataKey="remaining" stackId="a" fill="#e5e7eb" name="Remaining" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">High Priority Alerts</h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {highPriorityAlerts.map(alert => (
              <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${alert.severity === 'critical' ? 'border-red-500 bg-red-50' : 'border-orange-500 bg-orange-50'}`}>
                <div className="flex items-start">
                  <AlertTriangle className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${alert.severity === 'critical' ? 'text-red-600' : 'text-orange-600'}`} />
                  <div>
                    <p className={`font-semibold ${alert.severity === 'critical' ? 'text-red-800' : 'text-orange-800'}`}>{alert.title}</p>
                    <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
