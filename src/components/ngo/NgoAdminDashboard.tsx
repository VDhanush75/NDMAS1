import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  MapPin, 
  FileText 
} from 'lucide-react';
import DashboardOverview from './DashboardOverview';
import VolunteerManagement from './VolunteerManagement';
import InventoryManagement from './InventoryManagement';
import AssignmentView from './AssignmentView';
import ReportingView from './ReportingView';
import { Assignment, VolunteerReport } from '../../types';

interface NgoAdminDashboardProps {
  assignments: Assignment[];
  volunteerReports: VolunteerReport[];
  onAddAssignment: (newAssignment: Omit<Assignment, 'id'>) => void;
  onUpdateAssignment: (updatedAssignment: Assignment) => void;
  setVolunteerReports: React.Dispatch<React.SetStateAction<VolunteerReport[]>>;
}

const NgoAdminDashboard: React.FC<NgoAdminDashboardProps> = (props) => {
  const [activeTab, setActiveTab] = useState('assignments');
  
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, component: <DashboardOverview /> },
    { id: 'volunteers', label: 'Volunteers', icon: Users, component: <VolunteerManagement /> },
    { id: 'inventory', label: 'Inventory', icon: Package, component: <InventoryManagement /> },
    { id: 'assignments', label: 'Assignments', icon: MapPin, component: <AssignmentView {...props} /> },
    { id: 'reports', label: 'Submit Reports', icon: FileText, component: <ReportingView /> },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="lg:w-64 flex-shrink-0">
        <nav className="bg-white rounded-2xl shadow-lg p-4 space-y-2 sticky top-24">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-5 h-5 mr-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-1 min-w-0">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {ActiveComponent}
        </motion.div>
      </main>
    </div>
  );
};

export default NgoAdminDashboard;
