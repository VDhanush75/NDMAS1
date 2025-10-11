import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, LogOut, Menu, X } from 'lucide-react';
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const renderDashboardByRole = () => {
    const dashboardProps = { ...props, activeTab, setActiveTab, isSidebarCollapsed, setIsSidebarCollapsed };
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
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {renderDashboardByRole()}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
