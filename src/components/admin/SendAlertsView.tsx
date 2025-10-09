import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from '../../types';
import { indianStates } from '../../data/locations';
import { AlertTriangle, Send, PlusCircle, Edit, Trash2 } from 'lucide-react';
import Modal from '../common/Modal';

type Severity = 'critical' | 'high' | 'warning' | 'info';

const severityOptions: { value: Severity; label: string; color: string; }[] = [
    { value: 'critical', label: 'Critical', color: 'bg-red-500' },
    { value: 'high', label: 'High', color: 'bg-orange-500' },
    { value: 'warning', label: 'Warning', color: 'bg-yellow-500' },
    { value: 'info', label: 'Info', color: 'bg-blue-500' },
];

const getSeverityClass = (severity: Severity) => {
    switch (severity) {
      case 'critical': return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-500' };
      case 'high': return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-500' };
      case 'warning': return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500' };
      default: return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-500' };
    }
};

type AlertFormData = Omit<Alert, 'id' | 'timestamp' | 'language'>;

const SendAlertsView: React.FC<{ initialAlerts: Alert[], setAlerts: React.Dispatch<React.SetStateAction<Alert[]>> }> = ({ initialAlerts, setAlerts }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAlert, setEditingAlert] = useState<Alert | null>(null);

    const { register, handleSubmit, reset, setValue, watch } = useForm<AlertFormData>();

    const openModalForEdit = (alert: Alert) => {
        setEditingAlert(alert);
        setValue('title', alert.title);
        setValue('message', alert.message);
        setValue('severity', alert.severity as Severity);
        setValue('targetAreas', alert.targetAreas);
        setValue('targetRoles', alert.targetRoles);
        setIsModalOpen(true);
    };

    const openModalForNew = () => {
        setEditingAlert(null);
        reset({ title: '', message: '', severity: 'warning', targetAreas: ['all'], targetRoles: [] });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingAlert(null);
        reset();
    };

    const onSubmit = (data: AlertFormData) => {
        if (editingAlert) {
            const updatedAlert: Alert = { ...editingAlert, ...data };
            setAlerts(initialAlerts.map(a => a.id === editingAlert.id ? updatedAlert : a));
        } else {
            const newAlert: Alert = {
                id: `A${Date.now()}`,
                timestamp: new Date(),
                language: 'english',
                ...data,
            };
            setAlerts(prev => [newAlert, ...prev]);
        }
        closeModal();
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this alert?')) {
            setAlerts(initialAlerts.filter(a => a.id !== id));
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Alerts Management</h2>
                <button onClick={openModalForNew} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center transition-colors">
                    <PlusCircle className="w-5 h-5 mr-2" /> Create Alert
                </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Dispatched Alerts</h3>
                <div className="space-y-4">
                    {initialAlerts.map(alert => {
                        const severityClasses = getSeverityClass(alert.severity as Severity);
                        return (
                            <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${severityClasses.border} ${severityClasses.bg} group`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start">
                                        <AlertTriangle className={`w-6 h-5 mr-3 mt-1 flex-shrink-0 ${severityClasses.text}`} />
                                        <div>
                                            <p className={`font-semibold ${severityClasses.text}`}>{alert.title}</p>
                                            <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <p className="text-xs text-gray-500">{new Date(alert.timestamp).toLocaleString()}</p>
                                                <p className="text-xs text-gray-600 font-medium ml-4">Target Areas: {alert.targetAreas.join(', ')}</p>
                                                {alert.targetRoles && alert.targetRoles.length > 0 && <p className="text-xs text-gray-600 font-medium ml-4">Target Roles: {alert.targetRoles.join(', ')}</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openModalForEdit(alert)} className="p-1.5 bg-white rounded-full text-blue-600 hover:bg-blue-100 shadow-sm"><Edit className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(alert.id)} className="p-1.5 bg-white rounded-full text-red-600 hover:bg-red-100 shadow-sm"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingAlert ? 'Edit Alert' : 'Create New Alert'}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Severity Level</label>
                        <div className="grid grid-cols-2 gap-3">
                            {severityOptions.map(opt => (
                                <label key={opt.value} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${watch('severity') === opt.value ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}`}>
                                    <input {...register('severity')} type="radio" value={opt.value} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                    <div className={`w-3 h-3 rounded-full ml-3 ${opt.color}`}></div>
                                    <span className="ml-2 text-sm font-medium text-gray-800">{opt.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Alert Title</label>
                        <input {...register('title')} id="title" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Critical Flood Warning" />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea {...register('message')} id="message" rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Detailed information..." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Target Roles (Optional)</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['SDMA', 'Rescue', 'NGO'] as const).map(role => (
                                <label key={role} className="flex items-center space-x-2 p-2 border rounded-lg">
                                    <input type="checkbox" {...register('targetRoles')} value={role} />
                                    <span>{role}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Target State/District</label>
                        <select {...register('targetAreas')} multiple className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 h-32">
                            <option value="all">All India</option>
                            {Object.entries(indianStates).map(([state, districts]) => (
                                <optgroup label={state} key={state}>
                                    <option value={state}>{state} (Entire State)</option>
                                    {districts.map(district => <option key={`${state}-${district}`} value={district}>{district}</option>)}
                                </optgroup>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center">
                            <Send className="w-4 h-4 mr-2" /> {editingAlert ? 'Update Alert' : 'Dispatch Alert'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default SendAlertsView;
