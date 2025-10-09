import React, { useState } from 'react';
import { Send, Users, Package, Truck } from 'lucide-react';

const ReportForm: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`${title} submitted to Central Authority successfully!`);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      {children}
      <div className="flex justify-end">
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center transition-colors">
          <Send className="w-4 h-4 mr-2" /> Submit Report
        </button>
      </div>
    </form>
  );
};

const ReportingView: React.FC = () => {
  const [activeReport, setActiveReport] = useState('distribution');

  const reportTypes = [
    { id: 'distribution', label: 'Relief Distribution', icon: Truck },
    { id: 'inventory', label: 'Inventory Status', icon: Package },
    { id: 'volunteer', label: 'Volunteer Updates', icon: Users },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Reports to Central Authority</h2>
      <div className="flex space-x-2 mb-6 border-b">
        {reportTypes.map(report => (
          <button
            key={report.id}
            onClick={() => setActiveReport(report.id)}
            className={`flex items-center px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
              activeReport === report.id
                ? 'bg-white border border-b-0 text-blue-600'
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
          >
            <report.icon className="w-4 h-4 mr-2" />
            {report.label}
          </button>
        ))}
      </div>

      {activeReport === 'distribution' && (
        <ReportForm title="Relief Distribution Report">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="date" className="w-full p-3 border rounded-lg" required />
            <input type="text" placeholder="Reporting Zone/Area" className="w-full p-3 border rounded-lg" required />
            <input type="number" placeholder="Number of Families Aided" className="w-full p-3 border rounded-lg" required />
            <input type="number" placeholder="Food Kits Distributed" className="w-full p-3 border rounded-lg" required />
          </div>
          <textarea placeholder="Challenges or Notes..." rows={4} className="w-full p-3 border rounded-lg"></textarea>
        </ReportForm>
      )}

      {activeReport === 'inventory' && (
        <ReportForm title="Inventory Status Report">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder="Item Name (e.g., Medicine Pack)" className="w-full p-3 border rounded-lg" required />
            <input type="number" placeholder="Current Stock" className="w-full p-3 border rounded-lg" required />
            <input type="number" placeholder="Required Stock (Urgent)" className="w-full p-3 border rounded-lg" />
            <select className="w-full p-3 border rounded-lg">
              <option>Select Stock Status</option>
              <option>Sufficient</option>
              <option>Low</option>
              <option>Critically Low</option>
            </select>
          </div>
          <textarea placeholder="Additional inventory notes..." rows={4} className="w-full p-3 border rounded-lg"></textarea>
        </ReportForm>
      )}

      {activeReport === 'volunteer' && (
        <ReportForm title="Volunteer Activity Report">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="date" className="w-full p-3 border rounded-lg" required />
            <input type="number" placeholder="Number of Volunteers on Duty" className="w-full p-3 border rounded-lg" required />
            <input type="number" placeholder="Number of Volunteers on Standby" className="w-full p-3 border rounded-lg" required />
            <input type="text" placeholder="Overall Morale (e.g., High, Medium, Low)" className="w-full p-3 border rounded-lg" />
          </div>
          <textarea placeholder="Report any issues, challenges, or notable efforts by volunteers..." rows={4} className="w-full p-3 border rounded-lg"></textarea>
        </ReportForm>
      )}
    </div>
  );
};

export default ReportingView;
