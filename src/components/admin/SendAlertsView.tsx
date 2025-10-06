import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { alerts as allAlerts } from '../../data/mockData';
import { indianStates } from '../../data/locations';
import { AlertTriangle, Send, Info, Eye } from 'lucide-react';

type Severity = 'critical' | 'high' | 'warning' | 'info';

const severityOptions: { value: Severity; label: string; color: string; textColor: string; ringColor: string; }[] = [
    { value: 'critical', label: 'Critical (Danger)', color: 'bg-red-500', textColor: 'text-red-500', ringColor: 'focus:ring-red-500' },
    { value: 'high', label: 'High Risk', color: 'bg-orange-500', textColor: 'text-orange-500', ringColor: 'focus:ring-orange-500' },
    { value: 'warning', label: 'Warning (Low Risk)', color: 'bg-yellow-500', textColor: 'text-yellow-500', ringColor: 'focus:ring-yellow-500' },
    { value: 'info', label: 'Safe / Info', color: 'bg-blue-500', textColor: 'text-blue-500', ringColor: 'focus:ring-blue-500' },
];

const getSeverityClass = (severity: Severity) => {
    switch (severity) {
      case 'critical': return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-500' };
      case 'high': return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-500' };
      case 'warning': return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500' };
      default: return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-500' };
    }
};

const SendAlertsView: React.FC = () => {
    const { user } = useAuth();
    
    // State for Central Admin Form
    const [severity, setSeverity] = useState<Severity>('warning');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [targetScope, setTargetScope] = useState('all'); // 'all', 'state', 'district'
    const [selectedState, setSelectedState] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');

    const handleSendAlert = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !message) {
            alert('Please fill in the title and message for the alert.');
            return;
        }

        let target = 'All India';
        if (targetScope === 'state' && selectedState) {
            target = selectedState;
        } else if (targetScope === 'district' && selectedState && selectedDistrict) {
            target = `${selectedDistrict}, ${selectedState}`;
        }

        const newAlert = {
            id: `A${Date.now()}`,
            title,
            message,
            severity,
            targetAreas: [target],
            language: 'english',
            timestamp: new Date(),
        };

        // In a real app, this would be an API call. Here we just log it.
        console.log('Sending Alert:', newAlert);
        alert(`Alert Sent!\nSeverity: ${severity}\nTarget: ${target}\nTitle: ${title}`);
        
        // Reset form
        setTitle('');
        setMessage('');
    };

    if (user?.adminLevel !== 'central') {
        // Monitoring view for State and District Admins
        return (
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md mb-6">
                    <Eye className="w-6 h-6 text-blue-600 mr-3" />
                    <div>
                        <h2 className="text-lg font-semibold text-blue-800">Alert Monitoring Mode</h2>
                        <p className="text-blue-700">You are viewing alerts for your jurisdiction. Alert dispatch is managed by the Central Authority.</p>
                    </div>
                </div>
                <div className="space-y-4">
                    {allAlerts.map((alert) => {
                        const severityClasses = getSeverityClass(alert.severity as any);
                        return (
                            <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${severityClasses.border} ${severityClasses.bg}`}>
                                <div className="flex items-start">
                                    <AlertTriangle className={`w-6 h-5 mr-3 mt-1 flex-shrink-0 ${severityClasses.text}`} />
                                    <div>
                                        <p className={`font-semibold ${severityClasses.text}`}>{alert.title}</p>
                                        <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <p className="text-xs text-gray-500">{new Date(alert.timestamp).toLocaleString()}</p>
                                            <p className="text-xs text-gray-600 font-medium">Target: {alert.targetAreas.join(', ')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Form for Central Admin
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Alert Composer */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Dispatch New Alert</h2>
                <form onSubmit={handleSendAlert} className="space-y-6">
                    {/* Severity */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Severity Level</label>
                        <div className="grid grid-cols-2 gap-3">
                            {severityOptions.map(opt => (
                                <label key={opt.value} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${severity === opt.value ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}`}>
                                    <input
                                        type="radio"
                                        name="severity"
                                        value={opt.value}
                                        checked={severity === opt.value}
                                        onChange={() => setSeverity(opt.value)}
                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <div className={`w-3 h-3 rounded-full ml-3 ${opt.color}`}></div>
                                    <span className="ml-2 text-sm font-medium text-gray-800">{opt.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Title & Message */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Alert Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Critical Flood Warning"
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Detailed information about the alert..."
                        />
                    </div>

                    {/* Targeting */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                        <div className="flex flex-col space-y-4">
                            <select value={targetScope} onChange={e => { setTargetScope(e.target.value); setSelectedState(''); setSelectedDistrict(''); }} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                <option value="all">All India</option>
                                <option value="state">Specific State</option>
                                <option value="district">Specific District</option>
                            </select>
                            {targetScope === 'state' && (
                                <select value={selectedState} onChange={e => setSelectedState(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                    <option value="">-- Select State --</option>
                                    {Object.keys(indianStates).map(state => <option key={state} value={state}>{state}</option>)}
                                </select>
                            )}
                            {targetScope === 'district' && (
                                <div className="flex space-x-2">
                                    <select value={selectedState} onChange={e => { setSelectedState(e.target.value); setSelectedDistrict(''); }} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                        <option value="">-- Select State --</option>
                                        {Object.keys(indianStates).map(state => <option key={state} value={state}>{state}</option>)}
                                    </select>
                                    <select value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)} disabled={!selectedState} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100">
                                        <option value="">-- Select District --</option>
                                        {selectedState && indianStates[selectedState]?.map(district => <option key={district} value={district}>{district}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        <Send className="w-5 h-5 mr-2" />
                        Dispatch Alert
                    </button>
                </form>
            </div>

            {/* Live Preview */}
            <div className="bg-gray-100 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Live Preview</h3>
                <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className={`p-4 rounded-lg border-l-4 ${getSeverityClass(severity).border} ${getSeverityClass(severity).bg}`}>
                        <div className="flex items-start">
                            <AlertTriangle className={`w-6 h-5 mr-3 mt-1 flex-shrink-0 ${getSeverityClass(severity).text}`} />
                            <div>
                                <p className={`font-semibold ${getSeverityClass(severity).text}`}>{title || 'Alert Title...'}</p>
                                <p className="text-sm text-gray-700 mt-1">{message || 'Alert message will appear here...'}</p>
                                <p className="text-xs text-gray-500 mt-2">{new Date().toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SendAlertsView;
