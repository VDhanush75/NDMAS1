import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Send, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Assignment, User, VolunteerReport } from '../../types';
import { useAuth } from '../../context/AuthContext';
import Modal from '../common/Modal';
import QrScanner from './QrScanner';

interface NgoVolunteerViewProps {
  assignments: Assignment[];
  citizens: User[];
  onUpdateCitizen: (updatedCitizen: User) => void;
  onAddReport: (newReport: Omit<VolunteerReport, 'id' | 'timestamp'>) => void;
}

const NgoVolunteerView: React.FC<NgoVolunteerViewProps> = ({ assignments, citizens, onUpdateCitizen, onAddReport }) => {
  const { user } = useAuth();
  const [isScannerOpen, setScannerOpen] = useState(false);
  const [reportText, setReportText] = useState('');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');

  // Mock: Assigning tasks to the logged-in volunteer (assuming user.id can be matched to volunteer ID)
  // In a real app, user.id would be linked to a volunteerId. Here we hardcode it.
  const volunteerId = 'VOL001'; 
  const myAssignments = assignments.filter(a => a.assignedVolunteers.includes(volunteerId));

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText || !selectedAssignmentId) {
        alert("Please select an assignment and write a report.");
        return;
    }
    onAddReport({
        assignmentId: selectedAssignmentId,
        volunteerId: volunteerId,
        volunteerName: user?.name || 'Volunteer',
        reportText: reportText,
    });
    setReportText('');
  };
  
  const handleStatusUpdate = (assignmentId: string, status: Assignment['status']) => {
    onAddReport({
        assignmentId: assignmentId,
        volunteerId: volunteerId,
        volunteerName: user?.name || 'Volunteer',
        reportText: `Task status changed to ${status}.`,
        statusUpdate: status,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        {/* My Tasks */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-2xl shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Active Tasks</h2>
          <div className="space-y-6">
            {myAssignments.length > 0 ? myAssignments.map(task => (
              <div key={task.id} className="p-5 border rounded-xl hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{task.title}</h3>
                    <p className="text-sm text-gray-500 font-medium">Area: {task.area}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    task.status === 'Assigned' ? 'bg-yellow-100 text-yellow-800' :
                    task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>
                </div>
                <p className="text-gray-600 mt-2">{task.description}</p>
                <div className="flex space-x-3 mt-4">
                  {task.status !== 'Completed' && (
                    <>
                      {task.status !== 'In Progress' && (
                        <button onClick={() => handleStatusUpdate(task.id, 'In Progress')} className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 flex items-center justify-center transition-colors">
                          <Clock className="w-4 h-4 mr-2"/> Start Task
                        </button>
                      )}
                      <button onClick={() => handleStatusUpdate(task.id, 'Completed')} className="flex-1 bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 flex items-center justify-center transition-colors">
                        <CheckCircle className="w-4 h-4 mr-2"/> Mark Complete
                      </button>
                    </>
                  )}
                  {task.status === 'Completed' && (
                    <div className="flex-1 text-center text-green-600 font-semibold p-2 bg-green-50 rounded-lg">Task Completed</div>
                  )}
                </div>
              </div>
            )) : (
              <p className="text-center text-gray-500 py-8">No tasks assigned at the moment. Stand by for assignments.</p>
            )}
          </div>
        </motion.div>

        {/* Submit Report */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-2xl shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Field Update</h2>
          <form onSubmit={handleReportSubmit} className="space-y-4">
            <select 
                value={selectedAssignmentId} 
                onChange={e => setSelectedAssignmentId(e.target.value)}
                className="w-full p-3 border rounded-lg bg-white"
                required
            >
                <option value="">-- Select Related Task --</option>
                {myAssignments.map(task => <option key={task.id} value={task.id}>{task.title}</option>)}
            </select>
            <textarea 
                value={reportText}
                onChange={e => setReportText(e.target.value)}
                placeholder="Write your update here... (e.g., resources used, situation details)" 
                rows={4} 
                className="w-full p-3 border rounded-lg"
                required
            />
            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 flex items-center justify-center transition-colors">
                <Send className="w-5 h-5 mr-2" /> Send Update to Admin
            </button>
          </form>
        </motion.div>
      </div>

      {/* QR Scanner Section */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center text-white sticky top-24"
      >
        <h3 className="text-2xl font-bold mb-4">Distribute Aid</h3>
        <p className="opacity-90 mb-8">Scan a citizen's QR code to quickly and accurately record aid distribution.</p>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setScannerOpen(true)}
          className="bg-white text-blue-600 font-bold py-5 px-8 rounded-2xl hover:bg-blue-50 transition-colors flex items-center text-xl shadow-xl"
        >
          <QrCode className="w-8 h-8 mr-4"/> Scan Citizen QR
        </motion.button>
        <p className="text-xs opacity-80 mt-6">Ensure you have camera permissions enabled in your browser.</p>
      </motion.div>

      <Modal isOpen={isScannerOpen} onClose={() => setScannerOpen(false)} title="Scan Citizen Relief ID">
        <QrScanner 
            citizens={citizens}
            onScanSuccess={(citizen) => {
                const updatedCitizen = { ...citizen, aidStatus: 'Received' as const };
                onUpdateCitizen(updatedCitizen);
            }}
            onClose={() => setScannerOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default NgoVolunteerView;
