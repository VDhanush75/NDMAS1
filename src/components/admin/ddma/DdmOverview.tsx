import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Task, User, NgoData, SOSRequest } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { PlusCircle, Edit, Trash2, Users, ShieldCheck, Handshake, AlertTriangle } from 'lucide-react';
import Modal from '../../common/Modal';

interface DdmOverviewProps {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    rescueUsers: User[];
    ngoData: NgoData[];
    generalUsers: User[];
    sosRequests: SOSRequest[];
}

type TaskFormData = Omit<Task, 'id' | 'status' | 'createdBy' | 'creatorId' | 'createdAt'>;

const StatCard: React.FC<{ icon: React.ReactNode, title: string, value: string | number, color: string }> = ({ icon, title, value, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md flex items-center space-x-4">
        <div className={`p-3 rounded-xl ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500">{title}</p>
        </div>
    </div>
);

const DdmOverview: React.FC<DdmOverviewProps> = ({ tasks, setTasks, rescueUsers, ngoData, generalUsers, sosRequests }) => {
    const { user } = useAuth();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const { register, handleSubmit, reset, setValue, watch } = useForm<TaskFormData>();

    const assignedTo = watch('assignedTo');

    const openModal = (task: Task | null) => {
        setEditingTask(task);
        if (task) {
            setValue('title', task.title);
            setValue('description', task.description);
            setValue('assignedTo', task.assignedTo);
            setValue('assignedToId', task.assignedToId);
        } else {
            reset();
        }
        setModalOpen(true);
    };

    const onSubmit = (data: TaskFormData) => {
        if (editingTask) {
            setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...editingTask, ...data } : t));
        } else {
            const newTask: Task = {
                id: `task-${Date.now()}`,
                status: 'Pending',
                createdBy: 'DDMA',
                creatorId: user!.id,
                createdAt: new Date(),
                ...data,
            };
            setTasks(prev => [newTask, ...prev]);
        }
        setModalOpen(false);
    };

    const deleteTask = (id: string) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            setTasks(prev => prev.filter(t => t.id !== id));
        }
    };

    const getAssigneeName = (task: Task) => {
        let list: (User | NgoData)[] = [];
        if (task.assignedTo === 'Rescue') list = rescueUsers;
        if (task.assignedTo === 'NGO') list = ngoData;
        const assignee = list.find(item => item.id === task.assignedToId);
        return assignee ? assignee.name : 'N/A';
    };

    const registeredCitizens = generalUsers.filter(u => u.district === user?.district).length;
    const activeSOS = sosRequests.filter(s => s.district === user?.district && s.status !== 'completed').length;
    const localRescueTeams = rescueUsers.filter(u => u.district === user?.district);
    const localNGOs = ngoData.filter(n => n.assignedDistrict === user?.district && n.status === 'Approved');

    return (
        <div className="space-y-8">
             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard icon={<Users className="w-7 h-7 text-blue-600" />} title="Registered Users" value={registeredCitizens || 0} color="bg-blue-100" />
                <StatCard icon={<AlertTriangle className="w-7 h-7 text-red-600" />} title="Active SOS Calls" value={activeSOS || 0} color="bg-red-100" />
                <StatCard icon={<ShieldCheck className="w-7 h-7 text-green-600" />} title="Local Rescue Teams" value={localRescueTeams.length} color="bg-green-100" />
                <StatCard icon={<Handshake className="w-7 h-7 text-yellow-600" />} title="Active NGOs" value={localNGOs.length} color="bg-yellow-100" />
            </div>

            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Ground-Level Tasking</h2>
                <button onClick={() => openModal(null)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center">
                    <PlusCircle className="w-5 h-5 mr-2" /> Create Task
                </button>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Task</th>
                                <th className="px-6 py-3">Assigned To</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.filter(t => t.creatorId === user?.id || t.assignedToId === user?.id).map(task => (
                                <tr key={task.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{task.title}</td>
                                    <td className="px-6 py-4">{task.assignedTo} ({getAssigneeName(task)})</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            task.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                            task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => openModal(task)} className="p-2 text-blue-600 hover:text-blue-800"><Edit size={16} /></button>
                                        <button onClick={() => deleteTask(task.id)} className="p-2 text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={editingTask ? 'Edit Task' : 'Create New Task'}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input {...register('title')} placeholder="Task Title" className="w-full p-3 border rounded-lg" required />
                    <textarea {...register('description')} placeholder="Task Description" rows={4} className="w-full p-3 border rounded-lg" required />
                    <select {...register('assignedTo')} className="w-full p-3 border rounded-lg bg-white" required>
                        <option value="">Assign to Role...</option>
                        <option value="Rescue">Rescue Team</option>
                        <option value="NGO">NGO</option>
                    </select>
                    {assignedTo && (
                        <select {...register('assignedToId')} className="w-full p-3 border rounded-lg bg-white" required>
                            <option value="">Select specific assignee...</option>
                            {assignedTo === 'Rescue' && localRescueTeams.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                            {assignedTo === 'NGO' && localNGOs.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                        </select>
                    )}
                    <div className="flex justify-end pt-4 space-x-2">
                        <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save Task</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default DdmOverview;
