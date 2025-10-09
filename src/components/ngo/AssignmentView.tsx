import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ngoVolunteers } from '../../data/mockData';
import { Assignment, VolunteerReport } from '../../types';
import { MapPin, UserPlus, PlusCircle, Edit, Trash2, MessageSquare } from 'lucide-react';
import Modal from '../common/Modal';
import { format } from 'date-fns';

type AssignmentFormData = Omit<Assignment, 'id' | 'assignedVolunteers' | 'status'>;

interface AssignmentViewProps {
  assignments: Assignment[];
  volunteerReports: VolunteerReport[];
  onAddAssignment: (newAssignment: Omit<Assignment, 'id'>) => void;
  onUpdateAssignment: (updatedAssignment: Assignment) => void;
  setVolunteerReports: React.Dispatch<React.SetStateAction<VolunteerReport[]>>;
}

const AssignmentView: React.FC<AssignmentViewProps> = ({ assignments, volunteerReports, onAddAssignment, onUpdateAssignment, setVolunteerReports }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<AssignmentFormData>();

  const handleAssignVolunteer = (assignmentId: string, volunteerId: string) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (!assignment) return;

    const updatedVolunteers = assignment.assignedVolunteers.includes(volunteerId)
      ? assignment.assignedVolunteers.filter(vId => vId !== volunteerId)
      : [...assignment.assignedVolunteers, volunteerId];
    
    const newStatus = updatedVolunteers.length > 0 ? (assignment.status === 'Pending' ? 'Assigned' : assignment.status) : 'Pending';
    
    onUpdateAssignment({ ...assignment, assignedVolunteers: updatedVolunteers, status: newStatus });
  };

  const onSubmit = (data: AssignmentFormData) => {
    onAddAssignment({
      ...data,
      status: 'Pending',
      assignedVolunteers: [],
    });
    reset();
    setIsModalOpen(false);
  };
  
  const handleDeleteReport = (reportId: string) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
        setVolunteerReports(prev => prev.filter(r => r.id !== reportId));
    }
  };

  const getPriorityClass = (priority: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
      case 'High': return 'border-red-500 bg-red-50 text-red-700';
      case 'Medium': return 'border-orange-500 bg-orange-50 text-orange-700';
      case 'Low': return 'border-yellow-500 bg-yellow-50 text-yellow-700';
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2 space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Zone Assignments</h2>
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center transition-colors">
                <PlusCircle className="w-5 h-5 mr-2" /> Create Task
            </button>
        </div>
        {assignments.map(assignment => (
          <div key={assignment.id} className={`bg-white p-6 rounded-2xl shadow-lg border-l-4 ${getPriorityClass(assignment.priority).split(' ')[0]}`}>
            <div className="flex justify-between items-start">
              <div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getPriorityClass(assignment.priority).replace('border-red-500', '').replace('border-orange-500', '').replace('border-yellow-500', '')}`}>{assignment.priority} Priority</span>
                <h3 className="text-xl font-bold text-gray-800 mt-2">{assignment.title}</h3>
                <p className="text-sm font-medium text-gray-500 flex items-center"><MapPin className="w-4 h-4 mr-1"/>{assignment.area}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                assignment.status === 'Pending' ? 'bg-gray-100 text-gray-800' :
                assignment.status === 'Assigned' ? 'bg-yellow-100 text-yellow-800' :
                assignment.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {assignment.status}
              </span>
            </div>
            <p className="text-gray-600 mt-3">{assignment.description}</p>
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center"><UserPlus className="w-4 h-4 mr-2"/>Assign Volunteers</h4>
              <div className="flex flex-wrap gap-2">
                {ngoVolunteers.filter(v => v.status === 'active').map(volunteer => (
                  <label key={volunteer.id} className={`flex items-center px-3 py-1.5 border rounded-full cursor-pointer text-sm transition-colors ${assignment.assignedVolunteers.includes(volunteer.id) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-50'}`}>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={assignment.assignedVolunteers.includes(volunteer.id)}
                      onChange={() => handleAssignVolunteer(assignment.id, volunteer.id)}
                    />
                    {volunteer.name}
                  </label>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="xl:col-span-1">
        <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Live Volunteer Updates</h2>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                {volunteerReports.length > 0 ? volunteerReports.map(report => (
                    <div key={report.id} className="p-4 bg-gray-50 rounded-lg relative group">
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleDeleteReport(report.id)} className="p-1.5 bg-white rounded-full text-red-500 hover:bg-red-100 shadow-sm"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <div className="flex items-center mb-2">
                            <MessageSquare className="w-4 h-4 text-blue-600 mr-2" />
                            <p className="font-semibold text-gray-800 text-sm">{report.volunteerName}</p>
                        </div>
                        <p className="text-gray-700 text-sm">{report.reportText}</p>
                        {report.statusUpdate && (
                            <p className="text-xs text-blue-700 font-medium mt-1">Status updated to: {report.statusUpdate}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-2 text-right">{format(report.timestamp, "MMM d, h:mm a")}</p>
                    </div>
                )) : <p className="text-center text-gray-500 py-8">No reports from volunteers yet.</p>}
            </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Assignment">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register('title')} placeholder="Task Title" className="w-full p-3 border rounded-lg" required />
          <input {...register('area')} placeholder="District, Area, or Location" className="w-full p-3 border rounded-lg" required />
          <select {...register('priority')} className="w-full p-3 border rounded-lg bg-white" required>
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
          <textarea {...register('description')} placeholder="Task Description" rows={4} className="w-full p-3 border rounded-lg" required />
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Create Task</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AssignmentView;
