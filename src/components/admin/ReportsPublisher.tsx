import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { NewsReport } from '../../types';
import { Image as ImageIcon, Video, Send, PlusCircle, Edit, Trash2, Users, MapPin } from 'lucide-react';
import Modal from '../common/Modal';
import { indianStates } from '../../data/locations';

const NewsCard: React.FC<{ report: NewsReport, onEdit: () => void, onDelete: () => void }> = ({ report, onEdit, onDelete }) => (
  <div className="bg-white rounded-lg overflow-hidden shadow-lg relative group">
    <img 
      src={report.imageUrl || 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x400/E5E7EB/9CA3AF/png?text=Image+Preview'} 
      alt={report.title} 
      className="w-full h-48 object-cover" 
    />
    <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="p-2 bg-white/80 rounded-full text-blue-600 hover:bg-white shadow-md"><Edit className="w-4 h-4" /></button>
        <button onClick={onDelete} className="p-2 bg-white/80 rounded-full text-red-600 hover:bg-white shadow-md"><Trash2 className="w-4 h-4" /></button>
    </div>
    <div className="p-4">
      <p className="text-sm text-blue-600 font-semibold">{report.category}</p>
      <h3 className="font-bold text-gray-800 mt-1 text-lg">{report.title}</h3>
      <p className="text-gray-600 text-sm mt-2 line-clamp-3">{report.content}</p>
      <div className="flex justify-between items-center mt-4">
        <p className="text-xs text-gray-500">{new Date(report.timestamp).toLocaleString()}</p>
        <div className="flex items-center space-x-2">
            {report.targetRoles && <Users className="w-4 h-4 text-gray-500" title={`Roles: ${report.targetRoles.join(', ')}`} />}
            {report.targetAreas && <MapPin className="w-4 h-4 text-gray-500" title={`Areas: ${report.targetAreas.join(', ')}`} />}
            {report.videoUrl && <Video className="w-5 h-5 text-red-600" />}
        </div>
      </div>
    </div>
  </div>
);

type ReportFormData = Omit<NewsReport, 'id' | 'timestamp'>;

const ReportsPublisher: React.FC<{ initialReports: NewsReport[], setNewsReports: React.Dispatch<React.SetStateAction<NewsReport[]>> }> = ({ initialReports, setNewsReports }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<NewsReport | null>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm<ReportFormData>();

  const openModalForEdit = (report: NewsReport) => {
    setEditingReport(report);
    setValue('title', report.title);
    setValue('content', report.content);
    setValue('category', report.category);
    setValue('imageUrl', report.imageUrl);
    setValue('videoUrl', report.videoUrl);
    setValue('targetRoles', report.targetRoles);
    setValue('targetAreas', report.targetAreas);
    setIsModalOpen(true);
  };

  const openModalForNew = () => {
    setEditingReport(null);
    reset({ title: '', content: '', category: 'Response', imageUrl: '', videoUrl: '', targetRoles: [], targetAreas: [] });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingReport(null);
    reset();
  };

  const onSubmit = (data: ReportFormData) => {
    if (editingReport) {
      const updatedReport: NewsReport = { ...editingReport, ...data };
      setNewsReports(initialReports.map(r => r.id === editingReport.id ? updatedReport : r));
    } else {
      const newReport: NewsReport = {
        id: `NEWS${Date.now()}`,
        timestamp: new Date(),
        ...data
      };
      setNewsReports(prev => [newReport, ...prev]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      setNewsReports(initialReports.filter(r => r.id !== id));
    }
  };
  
  const inputBaseClasses = "block w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3";

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">News & Reports Publisher</h2>
        <button onClick={openModalForNew} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center transition-colors">
          <PlusCircle className="w-5 h-5 mr-2" /> Create Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {initialReports.map(report => (
              <NewsCard 
                key={report.id} 
                report={report} 
                onEdit={() => openModalForEdit(report)}
                onDelete={() => handleDelete(report.id)}
              />
          ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingReport ? 'Edit Report' : 'Create New Report'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register('title')} placeholder="Enter report title" className={inputBaseClasses} />
          <select {...register('category')} className={inputBaseClasses}>
            <option>Response</option>
            <option>Data Analysis</option>
            <option>Community</option>
            <option>Weather Update</option>
            <option>Infrastructure</option>
          </select>
          <textarea {...register('content')} rows={5} className={inputBaseClasses} placeholder="Write the main content..."></textarea>
          <div className="relative"><ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" /><input {...register('imageUrl')} className={`pl-10 ${inputBaseClasses}`} placeholder="https://example.com/image.png" /></div>
          <div className="relative"><Video className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" /><input {...register('videoUrl')} className={`pl-10 ${inputBaseClasses}`} placeholder="https://youtube.com/watch?v=..." /></div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Roles</label>
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
            <select {...register('targetAreas')} multiple className={`${inputBaseClasses} h-32`}>
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
              <Send className="w-4 h-4 mr-2" /> {editingReport ? 'Update Report' : 'Publish Report'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ReportsPublisher;
