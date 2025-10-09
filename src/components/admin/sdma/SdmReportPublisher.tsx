import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { SdmReport } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { PlusCircle, Edit, Trash2, Send } from 'lucide-react';
import Modal from '../../common/Modal';

interface SdmReportPublisherProps {
    sdmReports: SdmReport[];
    setSdmReports: React.Dispatch<React.SetStateAction<SdmReport[]>>;
}

type ReportFormData = Omit<SdmReport, 'id' | 'timestamp' | 'submittedBy' | 'submittedByName'>;

const SdmReportPublisher: React.FC<SdmReportPublisherProps> = ({ sdmReports, setSdmReports }) => {
    const { user } = useAuth();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingReport, setEditingReport] = useState<SdmReport | null>(null);
    const { register, handleSubmit, reset, setValue } = useForm<ReportFormData>();

    const openModal = (report: SdmReport | null) => {
        setEditingReport(report);
        if (report) {
            setValue('title', report.title);
            setValue('content', report.content);
            setValue('category', report.category);
        } else {
            reset({ category: 'Work Update' });
        }
        setModalOpen(true);
    };

    const onSubmit = (data: ReportFormData) => {
        if (editingReport) {
            setSdmReports(prev => prev.map(r => r.id === editingReport.id ? { ...editingReport, ...data, timestamp: new Date() } : r));
        } else {
            const newReport: SdmReport = {
                id: `SDR-${Date.now()}`,
                timestamp: new Date(),
                submittedBy: user!.id,
                submittedByName: user!.name,
                ...data,
            };
            setSdmReports(prev => [newReport, ...prev]);
        }
        setModalOpen(false);
    };

    const deleteReport = (id: string) => {
        if (window.confirm('Are you sure you want to delete this report?')) {
            setSdmReports(prev => prev.filter(r => r.id !== id));
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Submit Reports to NDMA</h2>
                <button onClick={() => openModal(null)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center transition-colors">
                    <PlusCircle className="w-5 h-5 mr-2" /> Create Report
                </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Submitted Reports</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Title</th>
                                <th scope="col" className="px-6 py-3">Category</th>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sdmReports.filter(r => r.submittedBy === user?.id).map(report => (
                                <tr key={report.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{report.title}</td>
                                    <td className="px-6 py-4">{report.category}</td>
                                    <td className="px-6 py-4">{new Date(report.timestamp).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => openModal(report)} className="p-2 text-blue-600 hover:text-blue-800"><Edit size={16} /></button>
                                        <button onClick={() => deleteReport(report.id)} className="p-2 text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={editingReport ? 'Edit Report' : 'Create New Report'}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Report Title</label>
                        <input {...register('title')} id="title" placeholder="e.g., Weekly Status Update" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                        <select {...register('category')} id="category" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white" required>
                            <option value="Work Update">Work Update</option>
                            <option value="Resource Request">Resource Request</option>
                            <option value="General Info">General Info</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                        <textarea {...register('content')} id="content" placeholder="Detailed content of the report..." rows={5} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div className="flex justify-end pt-4 space-x-3">
                        <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center">
                            <Send className="w-4 h-4 mr-2" />{editingReport ? 'Update Report' : 'Submit Report'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default SdmReportPublisher;
