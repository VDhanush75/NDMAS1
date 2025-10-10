import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { LogOut, Handshake } from 'lucide-react';
import NgoAdminDashboard from './NgoAdminDashboard';
import NgoVolunteerView from './NgoVolunteerView';
import { Assignment, VolunteerReport, User } from '../../types';
import { assignments as initialAssignments, volunteerReports as initialVolunteerReports } from '../../data/mockData';

interface NgoDashboardProps {
  citizens: User[];
  setCitizens: React.Dispatch<React.SetStateAction<User[]>>;
}

const NgoDashboard: React.FC<NgoDashboardProps> = ({ citizens, setCitizens }) => {
  const { user, logout } = useAuth();
  
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [volunteerReports, setVolunteerReports] = useState<VolunteerReport[]>(initialVolunteerReports);

  const handleAddAssignment = (newAssignment: Omit<Assignment, 'id'>) => {
    const assignmentToAdd: Assignment = {
      ...newAssignment,
      id: `ASGN${Date.now()}`,
    };
    setAssignments(prev => [assignmentToAdd, ...prev]);
  };

  const handleUpdateAssignment = (updatedAssignment: Assignment) => {
    setAssignments(prev => prev.map(a => a.id === updatedAssignment.id ? updatedAssignment : a));
  };
  
  const handleAddReport = (newReport: Omit<VolunteerReport, 'id' | 'timestamp'>) => {
    const reportToAdd: VolunteerReport = {
      ...newReport,
      id: `VR${Date.now()}`,
      timestamp: new Date(),
    };
    setVolunteerReports(prev => [reportToAdd, ...prev]);
    // Also update the assignment status if provided
    if (newReport.statusUpdate) {
        setAssignments(prev => prev.map(a => a.id === newReport.assignmentId ? {...a, status: newReport.statusUpdate!} : a));
    }
  };

  const handleUpdateCitizen = (updatedCitizen: User) => {
    setCitizens(prev => prev.map(c => c.id === updatedCitizen.id ? updatedCitizen : c));
  };

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
          {user?.ngoLevel === 'admin' ? (
            <NgoAdminDashboard 
              assignments={assignments}
              volunteerReports={volunteerReports}
              onAddAssignment={handleAddAssignment}
              onUpdateAssignment={handleUpdateAssignment}
              setVolunteerReports={setVolunteerReports}
            />
          ) : (
            <NgoVolunteerView 
              assignments={assignments}
              citizens={citizens}
              onUpdateCitizen={handleUpdateCitizen}
              onAddReport={handleAddReport}
            />
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default NgoDashboard;
