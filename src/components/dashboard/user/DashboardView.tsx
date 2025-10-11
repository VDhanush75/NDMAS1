import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { AlertTriangle, Shield, Droplets, Phone } from 'lucide-react';
import { FloodZone, SOSRequest } from '../../../types';
import { historicalData, regionalRiskData, stateWiseImpactData } from '../../../data/mockData';
import { useTranslation } from 'react-i18next';

interface DashboardViewProps {
  floodZones: FloodZone[];
  sosRequests: SOSRequest[];
}

const StatCard: React.FC<{ title: string, value: string | number, icon: React.ReactNode, color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-4 rounded-xl shadow-md flex items-center">
    <div className={`p-3 rounded-full mr-4 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const DashboardView: React.FC<DashboardViewProps> = ({ floodZones, sosRequests }) => {
  const { t } = useTranslation();
  const activeAlerts = floodZones.filter(z => z.riskLevel === 'red' || z.riskLevel === 'orange').length;
  const activeSOS = sosRequests.filter(s => s.status !== 'completed').length;

  const stateColors: { [key: string]: string } = {
    'Assam': '#8884d8',
    'Bihar': '#82ca9d',
    'West Bengal': '#ffc658',
    'Kerala': '#ff8042',
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title={t('active_alerts')} value={activeAlerts} icon={<AlertTriangle className="text-red-500" />} color="bg-red-100" />
        <StatCard title={t('active_sos')} value={activeSOS} icon={<Phone className="text-blue-500" />} color="bg-blue-100" />
        <StatCard title={t('safe_shelters')} value="12" icon={<Shield className="text-green-500" />} color="bg-green-100" />
        <StatCard title={t('water_level')} value="6.8m" icon={<Droplets className="text-cyan-500" />} color="bg-cyan-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('statewise_impact')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stateWiseImpactData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis label={{ value: t('population_in_millions'), angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="Assam" stackId="1" stroke={stateColors.Assam} fill={stateColors.Assam} fillOpacity={0.6} />
              <Area type="monotone" dataKey="Bihar" stackId="1" stroke={stateColors.Bihar} fill={stateColors.Bihar} fillOpacity={0.6} />
              <Area type="monotone" dataKey="West Bengal" stackId="1" stroke={stateColors['West Bengal']} fill={stateColors['West Bengal']} fillOpacity={0.6} />
              <Area type="monotone" dataKey="Kerala" stackId="1" stroke={stateColors.Kerala} fill={stateColors.Kerala} fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('regional_risk_distribution')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={regionalRiskData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={110}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {regionalRiskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
       <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('historical_data')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={historicalData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" label={{ value: 'Rainfall (mm)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" label={{ value: 'River Level (m)', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="rainfall" fill="#8884d8" name="Annual Rainfall (mm)" />
              <Bar yAxisId="right" dataKey="riverLevel" fill="#82ca9d" name="Max River Level (m)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
    </div>
  );
};

export default DashboardView;
