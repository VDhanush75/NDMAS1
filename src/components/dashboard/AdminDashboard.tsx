import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  BarChart3, 
  AlertTriangle, 
  MapPin, 
  LogOut,
  Truck,
  Activity,
  Send,
  Eye,
  Newspaper
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import FloodMap from '../map/FloodMap';
import { weatherData, sosRequests, resources, floodZones } from '../../data/mockData';
import { FloodZone, SOSRequest } from '../../types';
import SendAlertsView from '../admin/SendAlertsView';
import ReportsPublisher from '../admin/ReportsPublisher';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const { filteredZones, filteredSOS } = useMemo(() => {
    if (!user) return { filteredZones: [], filteredSOS: [] };

    const allZones: FloodZone[] = floodZones;
    const allSOS: SOSRequest[] = sosRequests;

    switch (user.adminLevel) {
      case 'state':
        const stateZones = allZones.filter(zone => zone.id === user.state || zone.parent === user.state);
        const stateSOS = allSOS.filter(sos => sos.state === user.state);
        return { filteredZones: stateZones, filteredSOS: stateSOS };
      case 'district':
        const districtChildrenIds: string[] = allZones
            .filter(zone => zone.parent === user.district)
            .map(zone => zone.id);
        const districtZoneIds = [user.district, ...districtChildrenIds];

        const districtZones = allZones.filter(zone => districtZoneIds.includes(zone.id));
        const districtSOS = allSOS.filter(sos => sos.district === user.district);
        return { filteredZones: districtZones, filteredSOS: districtSOS };
      case 'central':
      default:
        return { filteredZones: allZones, filteredSOS: allSOS };
    }
  }, [user]);

  const statusCounts = filteredSOS.reduce((acc, sos) => {
    acc[sos.status] = (acc[sos.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count,
    color: status === 'pending' ? '#EF4444' : status === 'assigned' ? '#F59E0B' : 
           status === 'in-progress' ? '#3B82F6' : '#10B981'
  }));

  const criticalSOSCount = filteredSOS.filter(s => s.severity === 'critical').length;
  const activeOperationsCount = filteredSOS.filter(s => s.status === 'in-progress').length;
  const highRiskZonesCount = filteredZones.filter(z => z.riskLevel === 'red' || z.riskLevel === 'orange').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-red-100 p-2 rounded-lg mr-3">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Control Center</h1>
                <p className="text-sm text-gray-500">
                  {user?.adminLevel?.charAt(0).toUpperCase() + user?.adminLevel?.slice(1)} Authority - {user?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Access Level: <span className="font-semibold text-red-600 capitalize">{user?.adminLevel}</span>
              </div>
              <button 
                onClick={logout}
                className="flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-700"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-lg shadow-sm p-4">
              <div className="space-y-2">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'operations', label: 'Operations Map', icon: MapPin },
                  { id: 'sos', label: 'SOS Requests', icon: AlertTriangle },
                  { id: 'resources', label: 'Resources', icon: Truck },
                  { id: 'alerts', label: 'Send Alerts', icon: Send },
                  { id: 'reports', label: 'Publish Reports', icon: Newspaper }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === item.id 
                        ? 'bg-red-100 text-red-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Critical Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-red-500">
                    <div className="flex items-center">
                      <AlertTriangle className="w-8 h-8 text-red-500" />
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-500">Critical SOS</h3>
                        <p className="text-3xl font-bold text-red-600">
                          {criticalSOSCount}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-orange-500">
                    <div className="flex items-center">
                      <Eye className="w-8 h-8 text-orange-500" />
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-500">Active Operations</h3>
                        <p className="text-3xl font-bold text-orange-600">
                          {activeOperationsCount}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-yellow-500">
                    <div className="flex items-center">
                      <MapPin className="w-8 h-8 text-yellow-500" />
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-500">High Risk Zones</h3>
                        <p className="text-3xl font-bold text-yellow-600">
                          {highRiskZonesCount}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-green-500">
                    <div className="flex items-center">
                      <Truck className="w-8 h-8 text-green-500" />
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-500">Available Resources</h3>
                        <p className="text-3xl font-bold text-green-600">
                          {resources.reduce((sum, r) => sum + r.available, 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">SOS Request Status</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="count"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Weather Prediction</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={weatherData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="rainfall" stroke="#EF4444" strokeWidth={3} />
                        <Line type="monotone" dataKey="waterLevel" stroke="#3B82F6" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {filteredSOS.slice(0, 5).map((sos) => (
                      <div key={sos.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${
                            sos.severity === 'critical' ? 'bg-red-500' :
                            sos.severity === 'high' ? 'bg-orange-500' :
                            sos.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}></div>
                          <div>
                            <p className="font-medium text-gray-900">SOS Request {sos.id}</p>
                            <p className="text-sm text-gray-600">{sos.description}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          sos.status === 'pending' ? 'bg-red-100 text-red-800' :
                          sos.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
                          sos.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {sos.status.replace('-', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'operations' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg p-6 shadow-sm h-[75vh]"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Operations Command Center</h2>
                <FloodMap zones={filteredZones} sosRequests={filteredSOS} showSOS={true} />
              </motion.div>
            )}

            {activeTab === 'sos' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold text-gray-900">SOS Request Management</h2>
                {filteredSOS.map((sos) => (
                  <div key={sos.id} className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="font-semibold text-lg text-gray-900">Request {sos.id}</span>
                          <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                            sos.severity === 'critical' ? 'bg-red-100 text-red-800' :
                            sos.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                            sos.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {sos.severity} priority
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{sos.description}</p>
                        <div className="text-sm text-gray-500">
                          <p>Location: {sos.location[0].toFixed(4)}, {sos.location[1].toFixed(4)}</p>
                          <p>Time: {sos.timestamp.toLocaleString()}</p>
                          {sos.assignedRescueTeam && <p>Assigned to: {sos.assignedRescueTeam}</p>}
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          sos.status === 'pending' ? 'bg-red-100 text-red-800' :
                          sos.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
                          sos.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {sos.status.replace('-', ' ')}
                        </span>
                        {sos.status === 'pending' && (
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                            Assign Team
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'resources' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-900">Resource Management</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resources.map((resource) => (
                    <div key={resource.id} className="bg-white rounded-lg p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 capitalize">
                          {resource.type}s
                        </h3>
                        <Truck className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total:</span>
                          <span className="font-medium">{resource.quantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Available:</span>
                          <span className="font-medium text-green-600">{resource.available}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Deployed:</span>
                          <span className="font-medium text-blue-600">{resource.quantity - resource.available}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium text-sm">{resource.location}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(resource.available / resource.quantity) * 100}%` }}
                          ></div>
                        </div>
                        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                          Deploy Resources
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {activeTab === 'alerts' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <SendAlertsView />
              </motion.div>
            )}

            {activeTab === 'reports' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {user?.adminLevel === 'central' ? (
                  <ReportsPublisher />
                ) : (
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
                      <Eye className="w-6 h-6 text-blue-600 mr-3" />
                      <div>
                        <h2 className="text-lg font-semibold text-blue-800">Report Publishing</h2>
                        <p className="text-blue-700">Report and news publishing is handled by the Central Authority. You can view published reports on the citizen dashboard.</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
