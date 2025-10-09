import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FloodZone, SOSRequest, Resource, Alert, NewsReport, User, NgoData, Task, ResourceRequest, SdmReport } from '../../types';
import NdmaDashboard from '../admin/ndma/NdmaDashboard';
import SdmaDashboard from '../admin/sdma/SdmaDashboard';
import DdmaDashboard from '../admin/ddma/DdmaDashboard';

interface AdminDashboardProps {
  floodZones: FloodZone[];
  setFloodZones: React.Dispatch<React.SetStateAction<FloodZone[]>>;
  sosRequests: SOSRequest[];
  setSosRequests: React.Dispatch<React.SetStateAction<SOSRequest[]>>;
  resources: Resource[];
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
  alerts: Alert[];
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
  newsReports: NewsReport[];
  setNewsReports: React.Dispatch<React.SetStateAction<NewsReport[]>>;
  adminUsers: User[];
  setAdminUsers: React.Dispatch<React.SetStateAction<User[]>>;
  rescueUsers: User[];
  setRescueUsers: React.Dispatch<React.SetStateAction<User[]>>;
  ngoData: NgoData[];
  setNgoData: React.Dispatch<React.SetStateAction<NgoData[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  resourceRequests: ResourceRequest[];
  setResourceRequests: React.Dispatch<React.SetStateAction<ResourceRequest[]>>;
  sdmReports: SdmReport[];
  setSdmReports: React.Dispatch<React.SetStateAction<SdmReport[]>>;
  generalUsers: User[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const renderDashboardByRole = () => {
    const dashboardProps = { ...props, activeTab, setActiveTab };
    switch (user?.adminLevel) {
      case 'NDMA':
        return <NdmaDashboard {...dashboardProps} />;
      case 'SDMA':
        return <SdmaDashboard {...dashboardProps} />;
      case 'DDMA':
        return <DdmaDashboard {...dashboardProps} />;
      default:
        return <div className="p-8 text-center text-red-500">Error: Invalid admin level or user data missing.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-red-100 p-2 rounded-lg mr-3"><Shield className="w-6 h-6 text-red-600" /></div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Control Center</h1>
                <p className="text-sm text-gray-500">{user?.name}</p>
              </div>
            </div>
            <button onClick={logout} className="flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-700"><LogOut className="w-4 h-4 mr-1" />Logout</button>
          </div>
        </div>
      </header>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {renderDashboardByRole()}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
