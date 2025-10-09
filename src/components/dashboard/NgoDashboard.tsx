import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { LogOut, Handshake } from 'lucide-react';
import NgoAdminDashboard from '../ngo/NgoAdminDashboard';
import NgoVolunteerView from '../ngo/NgoVolunteerView';

const NgoDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <Handshake className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">NGO Operations</h1>
                <p className="text-sm text-gray-500">{user?.name} - {user?.state}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {user?.ngoLevel === 'admin' ? <NgoAdminDashboard /> : <NgoVolunteerView />}
        </motion.div>
      </main>
    </div>
  );
};

export default NgoDashboard;
