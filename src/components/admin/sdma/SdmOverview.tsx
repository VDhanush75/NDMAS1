import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Task, User, NgoData, ResourceRequest, SdmReport, SOSRequest } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { PlusCircle, Edit, Trash2, UserCog, ShieldCheck, Handshake, Activity, Package, Inbox, CheckCircle, XCircle, Clock } from 'lucide-react';
import Modal from '../../common/Modal';
import { format } from 'date-fns';

interface SdmOverviewProps {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    adminUsers: User[];
    rescueUsers: User[];
    ngoData: NgoData[];
    resourceRequests: ResourceRequest[];
    setResourceRequests: React.Dispatch<React.SetStateAction<ResourceRequest[]>>;
    sdmReports: SdmReport[];
    setSdmReports: React.Dispatch<React.SetStateAction<SdmReport[]>>;
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

const SdmOverview: React.FC<SdmOverviewProps> = ({ tasks, setTasks, adminUsers, rescueUsers, ngoData, resourceRequests, setResourceRequests }) => {
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
                createdBy: 'SDMA',
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
        if (task.assignedTo === 'DDMA') list = adminUsers;
        if (task.assignedTo === 'Rescue') list = rescueUsers;
        if (task.assignedTo === 'NGO') list = ngoData;
        const assignee = list.find(item => item.id === task.assignedToId);
        return assignee ? assignee.name : 'N/A';
    };
    
    const handleRequestStatus = (reqId: string, status: 'Approved' | 'Rejected') => {
        setResourceRequests(prev => prev.map(req => req.id === reqId ? {...req, status} : req));
    };

    const getStatusIcon = (status: 'Pending' | 'Approved' | 'Rejected') => {
        switch (status) {
            case 'Pending': return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'Approved': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'Rejected': return <XCircle className="w-5 h-5 text-red-500" />;
        }
    };

    const monitoredDDMAs = adminUsers.filter(u => u.adminLevel === 'DDMA' && u.state === user?.state);
    const deployedRescueTeams = rescueUsers.filter(u => u.state === user?.state);
    const partnerNGOs = ngoData.filter(n => n.state === user?.state && n.status === 'Approved');
    const incomingRequests = resourceRequests.filter(req => req.requestedBy === 'DDMA' && monitoredDDMAs.some(ddma => ddma.id === req.requesterId));

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard icon={<UserCog className="w-7 h-7 text-blue-600" />} title="Monitored DDMA's" value={monitoredDDMAs.length} color="bg-blue-100" />
                <StatCard icon={<ShieldCheck className="w-7 h-7 text-green-600" />} title="Deployed Rescue Teams" value={deployedRescueTeams.length} color="bg-green-100" />
                <StatCard icon={<Handshake className="w-7 h-7 text-yellow-600" />} title="Partner NGOs" value={partnerNGOs.length} color="bg-yellow-100" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">Task Assignment & Monitoring</h3>
                        <button onClick={() => openModal(null)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center text-sm">
                            <PlusCircle className="w-5 h-5 mr-2" /> Create Task
                        </button>
                    </div>
                    <div className="overflow-auto max-h-[400px]">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-700 sticky top-0">
                                <tr>
                                    <th scope="col" className="px-4 py-3">Task</th>
                                    <th scope="col" className="px-4 py-3">Assigned To</th>
                                    <th scope="col" className="px-4 py-3">Status</th>
                                    <th scope="col" className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.filter(t => t.creatorId === user?.id).map(task => (
                                    <tr key={task.id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900">{task.title}</td>
                                        <td className="px-4 py-3">{task.assignedTo} ({getAssigneeName(task)})</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                task.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => openModal(task)} className="p-2 text-blue-600 hover:text-blue-800"><Edit size={16} /></button>
                                            <button onClick={() => deleteTask(task.id)} className="p-2 text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Resource Requests from DDMAs</h3>
                     <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {incomingRequests.length > 0 ? incomingRequests.map(req => (
                            <div key={req.id} className="border-b pb-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium text-gray-800">{req.quantity} x <span className="capitalize">{req.resourceType}</span></p>
                                        <p className="text-xs text-gray-500">From: {req.requesterName}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {getStatusIcon(req.status)}
                                        <span className={`text-sm font-semibold ${req.status === 'Pending' ? 'text-yellow-600' : req.status === 'Approved' ? 'text-green-600' : 'text-red-600'}`}>{req.status}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mt-1 italic">"{req.justification}"</p>
                                <p className="text-xs text-gray-400 mt-1 text-right">{format(new Date(req.timestamp), 'MMM d, h:mm a')}</p>
                                {req.status === 'Pending' && (
                                     <div className="mt-2 flex items-center space-x-2 justify-end">
                                         <button onClick={() => handleRequestStatus(req.id, 'Approved')} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-md hover:bg-green-200">Approve</button>
                                         <button onClick={() => handleRequestStatus(req.id, 'Rejected')} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-md hover:bg-red-200">Reject</button>
                                     </div>
                                )}
                            </div>
                        )) : <p className="text-center text-gray-500 py-8">No resource requests from DDMAs.</p>}
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={editingTask ? 'Edit Task' : 'Create New Task'}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input {...register('title')} placeholder="Task Title" className="w-full p-3 border rounded-lg" required />
                    <textarea {...register('description')} placeholder="Task Description" rows={4} className="w-full p-3 border rounded-lg" required />
                    <select {...register('assignedTo')} className="w-full p-3 border rounded-lg bg-white" required>
                        <option value="">Assign to Role...</option>
                        <option value="DDMA">DDMA</option>
                        <option value="Rescue">Rescue Team</option>
                        <option value="NGO">NGO</option>
                    </select>
                    {assignedTo && (
                        <select {...register('assignedToId')} className="w-full p-3 border rounded-lg bg-white" required>
                            <option value="">Select specific assignee...</option>
                            {assignedTo === 'DDMA' && monitoredDDMAs.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                            {assignedTo === 'Rescue' && deployedRescueTeams.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                            {assignedTo === 'NGO' && partnerNGOs.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
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

export default SdmOverview;
