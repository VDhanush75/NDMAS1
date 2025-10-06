import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCheck, 
  MapPin, 
  AlertTriangle, 
  Clock, 
  CheckCircle,
  Camera,
  FileText,
  LogOut,
  Navigation,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import FloodMap from '../map/FloodMap';
import { sosRequests } from '../../data/mockData';

const RescueDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('assignments');

  const myAssignments = sosRequests.filter(sos => 
    sos.assignedRescueTeam === 'TEAM_001' || sos.status === 'pending'
  );

  const updateSOSStatus = (sosId: string, newStatus: string) => {
    alert(`SOS ${sosId} status updated to: ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Rescue Operations Center</h1>
                <p className="text-sm text-gray-500">Team Leader - {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Status: <span className="font-semibold text-green-600">On Duty</span>
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
                  { id: 'assignments', label: 'Active Assignments', icon: AlertTriangle },
                  { id: 'map', label: 'Operations Map', icon: MapPin },
                  { id: 'reports', label: 'Field Reports', icon: FileText },
                  { id: 'team', label: 'Team Status', icon: Users }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === item.id 
                        ? 'bg-green-100 text-green-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                ))}
              </div>
            </nav>

            {/* Quick Stats */}
            <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Today's Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Assigned:</span>
                  <span className="font-semibold text-orange-600">
                    {myAssignments.filter(s => s.status === 'assigned').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">In Progress:</span>
                  <span className="font-semibold text-blue-600">
                    {myAssignments.filter(s => s.status === 'in-progress').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-semibold text-green-600">
                    {myAssignments.filter(s => s.status === 'completed').length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'assignments' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-900">Active Rescue Assignments</h2>
                
                {myAssignments.map((sos) => (
                  <div key={sos.id} className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-l-red-500">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <span className="font-semibold text-xl text-gray-900">Emergency {sos.id}</span>
                          <span className={`ml-3 px-3 py-1 rounded-full text-sm font-medium ${
                            sos.severity === 'critical' ? 'bg-red-100 text-red-800' :
                            sos.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                            sos.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {sos.severity} priority
                          </span>
                        </div>
                        
                        <p className="text-gray-700 mb-3 text-lg">{sos.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>Location: {sos.location[0].toFixed(4)}, {sos.location[1].toFixed(4)}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>Reported: {sos.timestamp.toLocaleString()}</span>
                          </div>
                        </div>

                        {sos.media && sos.media.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600 mb-2">Attached Media:</p>
                            <div className="flex space-x-2">
                              {sos.media.map((media, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                  {media}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium text-center ${
                          sos.status === 'pending' ? 'bg-red-100 text-red-800' :
                          sos.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
                          sos.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {sos.status.replace('-', ' ')}
                        </span>
                        
                        {sos.status === 'pending' && (
                          <button 
                            onClick={() => updateSOSStatus(sos.id, 'assigned')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                          >
                            Accept Mission
                          </button>
                        )}
                        
                        {sos.status === 'assigned' && (
                          <button 
                            onClick={() => updateSOSStatus(sos.id, 'in-progress')}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700"
                          >
                            Start Rescue
                          </button>
                        )}
                        
                        {sos.status === 'in-progress' && (
                          <button 
                            onClick={() => updateSOSStatus(sos.id, 'completed')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                          >
                            Mark Complete
                          </button>
                        )}
                        
                        <button className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 flex items-center">
                          <Navigation className="w-4 h-4 mr-1" />
                          Navigate
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'map' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg p-6 shadow-sm h-[75vh]"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Rescue Operations Map</h2>
                <FloodMap showSOS={true} />
              </motion.div>
            )}

            {activeTab === 'reports' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Field Reports</h2>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    New Report
                  </button>
                </div>

                {/* Report Form */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Field Report</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mission ID
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option>Select Active Mission</option>
                        {myAssignments.map(sos => (
                          <option key={sos.id} value={sos.id}>Emergency {sos.id}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Report Details
                      </label>
                      <textarea 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        rows={4}
                        placeholder="Describe current situation, actions taken, resources used..."
                      ></textarea>
                    </div>

                    <div className="flex space-x-4">
                      <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
                        <Camera className="w-4 h-4 mr-2" />
                        Add Photos
                      </button>
                      <button className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                        Submit Report
                      </button>
                    </div>
                  </div>
                </div>

                {/* Previous Reports */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-900">Emergency SOS001 - Complete</span>
                        <span className="text-sm text-gray-500">2 hours ago</span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Successfully evacuated family of 4 from rooftop. Used rescue boat and life jackets. 
                        All members safe and transported to relief center.
                      </p>
                      <div className="flex items-center mt-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-green-600">Mission Completed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'team' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-900">Team Status</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { id: 'TEAM_001', name: 'Alpha Squad', members: 6, status: 'active', location: 'Kolkata Sector 1' },
                    { id: 'TEAM_002', name: 'Bravo Squad', members: 5, status: 'deployed', location: 'Howrah Sector 2' },
                    { id: 'TEAM_003', name: 'Charlie Squad', members: 4, status: 'standby', location: 'Base Station' }
                  ].map((team) => (
                    <div key={team.id} className="bg-white rounded-lg p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          team.status === 'active' ? 'bg-green-100 text-green-800' :
                          team.status === 'deployed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {team.status}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Team ID:</span>
                          <span className="font-medium">{team.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Members:</span>
                          <span className="font-medium">{team.members}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Location:</span>
                          <span className="font-medium">{team.location}</span>
                        </div>
                      </div>
                      <button className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                        Contact Team
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RescueDashboard;
