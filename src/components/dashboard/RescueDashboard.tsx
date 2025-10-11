import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCheck, 
  MapPin, 
  AlertTriangle, 
  FileText,
  LogOut,
  Navigation,
  Users,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import FloodMap from '../map/FloodMap';
import { FloodZone, SOSRequest } from '../../types';

interface RescueDashboardProps {
  floodZones: FloodZone[];
  sosRequests: SOSRequest[];
}

const RescueDashboard: React.FC<RescueDashboardProps> = ({ floodZones, sosRequests }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('assignments');
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const myAssignments = sosRequests.filter(sos => 
    sos.assignedRescueTeam === user?.serviceId || (sos.status === 'pending' && sos.district === user?.district)
  );

  const updateSOSStatus = (sosId: string, newStatus: string) => {
    alert(`SOS ${sosId} status updated to: ${newStatus}`);
    // In a real app, this would be a state update:
    // setSosRequests(prev => prev.map(s => s.id === sosId ? {...s, status: newStatus} : s));
  };
  
  const sidebarItems = [
    { id: 'assignments', label: 'Active Assignments', icon: AlertTriangle },
    { id: 'map', label: 'Operations Map', icon: MapPin },
    { id: 'reports', label: 'Field Reports', icon: FileText },
    { id: 'team', label: 'Team Status', icon: Users }
  ];

  const SidebarContent = () => (
    <nav className="bg-white rounded-lg shadow-sm p-4 h-full flex flex-col">
      <div className="space-y-2">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
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
      <div className="mt-auto">
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Today's Stats</h3>
          <div className="space-y-3 text-sm">
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
    </nav>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'map':
        return (
          <motion.div
            key="map"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-4 sm:p-6 shadow-sm h-[75vh]"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Rescue Operations Map</h2>
            <FloodMap zones={floodZones} sosRequests={sosRequests} showSOS={true} onExit={() => setActiveTab('assignments')} />
          </motion.div>
        );
      case 'reports':
        return (
          <motion.div key="reports" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Field Reports</h2>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center text-sm">
                <FileText className="w-4 h-4 mr-2" />
                New Report
              </button>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Field Report</h3>
              <div className="space-y-4">
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option>Select Active Mission</option>
                  {myAssignments.map(sos => <option key={sos.id} value={sos.id}>Emergency {sos.id}</option>)}
                </select>
                <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" rows={4} placeholder="Describe current situation..."></textarea>
                <button className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">Submit Report</button>
              </div>
            </div>
          </motion.div>
        );
      case 'team':
        return (
          <motion.div key="team" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Team Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[
                { id: 'TEAM_001', name: 'Alpha Squad', members: 6, status: 'active', location: 'Kolkata Sector 1' },
                { id: 'TEAM_002', name: 'Bravo Squad', members: 5, status: 'deployed', location: 'Howrah Sector 2' },
                { id: 'TEAM_003', name: 'Charlie Squad', members: 4, status: 'standby', location: 'Base Station' }
              ].map((team) => (
                <div key={team.id} className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{team.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between"><span>Members:</span><span className="font-medium">{team.members}</span></div>
                    <div className="flex justify-between"><span>Status:</span><span className={`font-medium px-2 py-1 text-xs rounded-full ${team.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{team.status}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 'assignments':
      default:
        return (
          <motion.div key="assignments" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Active Rescue Assignments</h2>
            {myAssignments.map((sos) => (
              <div key={sos.id} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border-l-4 border-l-red-500">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-lg text-gray-900">Emergency {sos.id}</p>
                    <p className="text-gray-700 mt-1">{sos.description}</p>
                    <p className="text-sm text-gray-500 mt-2">Location: {sos.location[0].toFixed(4)}, {sos.location[1].toFixed(4)}</p>
                  </div>
                  <div className="flex flex-col space-y-2 w-full sm:w-auto flex-shrink-0">
                    <span className="px-3 py-1 rounded-full text-sm font-medium text-center bg-yellow-100 text-yellow-800">{sos.status.replace('-', ' ')}</span>
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 flex items-center justify-center">
                      <Navigation className="w-4 h-4 mr-1" /> Navigate
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden mr-3 p-2 text-gray-600">
                  <Menu className="w-6 h-6" />
              </button>
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Rescue Operations</h1>
                <p className="text-xs sm:text-sm text-gray-500">{user?.name} - {user?.rescueLevel?.replace('-', ' ')}</p>
              </div>
            </div>
            <button onClick={logout} className="flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-700">
              <LogOut className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>
      
      <AnimatePresence>
        {isMobileMenuOpen && (
            <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
                <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed top-0 left-0 h-full w-64 bg-white z-50 lg:hidden p-4">
                    <SidebarContent />
                </motion.div>
            </>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <SidebarContent />
            </div>
          </aside>
          <main className="flex-1 min-w-0">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default RescueDashboard;
