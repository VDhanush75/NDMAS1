import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { newsReports as initialReports } from '../../data/mockData';
import { NewsReport } from '../../types';
import { Image as ImageIcon, Video, Send, PlusCircle, Edit, Trash2 } from 'lucide-react';

const NewsCard: React.FC<{ report: NewsReport, isPreview?: boolean }> = ({ report, isPreview }) => (
  <div className={`bg-white rounded-lg overflow-hidden shadow-lg ${isPreview ? 'border-2 border-blue-500' : ''}`}>
    <img 
      src={report.imageUrl || 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x400/E5E7EB/9CA3AF/png?text=Image+Preview'} 
      alt={report.title || 'Report Title'} 
      className="w-full h-48 object-cover" 
    />
    <div className="p-4">
      <p className="text-sm text-blue-600 font-semibold">{report.category || 'Category'}</p>
      <h3 className="font-bold text-gray-800 mt-1 text-lg">{report.title || 'Report Title'}</h3>
      <p className="text-gray-600 text-sm mt-2">{report.content || 'Report content will appear here...'}</p>
      <div className="flex justify-between items-center mt-4">
        <p className="text-xs text-gray-500">{new Date(report.timestamp).toLocaleString()}</p>
        {report.videoUrl && <Video className="w-5 h-5 text-red-600" />}
      </div>
    </div>
  </div>
);

const ReportsPublisher: React.FC = () => {
  const [reports, setReports] = useState<NewsReport[]>(initialReports);
  const [newReport, setNewReport] = useState<Partial<NewsReport>>({
    title: '',
    content: '',
    category: 'Response',
    imageUrl: '',
    videoUrl: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewReport(prev => ({ ...prev, [name]: value }));
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReport.title || !newReport.content || !newReport.imageUrl) {
      alert('Please fill in Title, Content, and Image URL.');
      return;
    }
    const reportToPublish: NewsReport = {
      id: `NEWS${Date.now()}`,
      timestamp: new Date(),
      ...newReport
    } as NewsReport;

    setReports(prev => [reportToPublish, ...prev]);
    alert('Report published successfully!');
    setNewReport({ title: '', content: '', category: 'Response', imageUrl: '', videoUrl: '' });
  };
  
  const inputBaseClasses = "block w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">News & Reports Publisher</h2>
        <p className="text-gray-600">Create, edit, and publish news reports for the citizen dashboard.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <form onSubmit={handlePublish} className="lg:col-span-3 bg-white p-6 rounded-lg shadow-sm space-y-6">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <PlusCircle className="w-6 h-6 mr-3 text-blue-600" />
            Create New Report
          </h3>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" name="title" id="title" value={newReport.title} onChange={handleInputChange} className={`mt-1 p-3 ${inputBaseClasses}`} placeholder="Enter report title" />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select name="category" id="category" value={newReport.category} onChange={handleInputChange} className={`mt-1 p-3 ${inputBaseClasses}`}>
              <option>Response</option>
              <option>Data Analysis</option>
              <option>Community</option>
              <option>Weather Update</option>
              <option>Infrastructure</option>
            </select>
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
            <textarea name="content" id="content" value={newReport.content} onChange={handleInputChange} rows={5} className={`mt-1 p-3 ${inputBaseClasses}`} placeholder="Write the main content of the report..."></textarea>
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
            <div className="relative mt-1">
              <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" name="imageUrl" id="imageUrl" value={newReport.imageUrl} onChange={handleInputChange} className={`pl-10 pr-3 py-3 ${inputBaseClasses}`} placeholder="https://example.com/image.png" />
            </div>
          </div>
          <div>
            <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700">Video URL (Optional)</label>
            <div className="relative mt-1">
              <Video className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" name="videoUrl" id="videoUrl" value={newReport.videoUrl} onChange={handleInputChange} className={`pl-10 pr-3 py-3 ${inputBaseClasses}`} placeholder="https://youtube.com/watch?v=..." />
            </div>
          </div>
          <button type="submit" className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Send className="w-5 h-5 mr-2" />
            Publish Report
          </button>
        </form>

        {/* Live Preview */}
        <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Live Preview</h3>
            <NewsCard report={{ ...newReport, timestamp: new Date() } as NewsReport} isPreview />
        </div>
      </div>

      {/* Existing Reports */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Published Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reports.map(report => (
                <div key={report.id} className="relative">
                    <NewsCard report={report} />
                    <div className="absolute top-2 right-2 flex space-x-2">
                        <button className="p-2 bg-white/80 rounded-full text-blue-600 hover:bg-white shadow-md">
                            <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-white/80 rounded-full text-red-600 hover:bg-white shadow-md">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsPublisher;
