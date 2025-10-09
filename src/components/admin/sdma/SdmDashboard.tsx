import React, { useState } from 'react';
import { BarChart3, MapPin, Truck, Send, FileText, AlertTriangle, Inbox } from 'lucide-react';
import { FloodZone, Resource, Alert, Task, ResourceRequest, User, NgoData, SdmReport, SOSRequest } from '../../../types';
import FloodMap from '../../map/FloodMap';
import SdmOverview from './SdmOverview';
import SdmResources from './SdmResources';
import SdmReportPublisher from './SdmReportPublisher';
import { useAuth } from '../../../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface SdmaDashboardProps {
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
    floodZones: FloodZone[]; setFloodZones: React.Dispatch<React.SetStateAction<FloodZone[]>>;
    sosRequests: SOSRequest[]; setSosRequests: React.Dispatch<React.SetStateAction<SOSRequest[]>>;
    resources: Resource[];
    alerts: Alert[];
    tasks: Task[]; setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    resourceRequests: ResourceRequest[]; setResourceRequests: React.Dispatch<React.SetStateAction<ResourceRequest[]>>;
    sdmReports: SdmReport[]; setSdmReports: React.Dispatch<React.SetStateAction<SdmReport[]>>;
    adminUsers: User[];
    rescueUsers: User[];
    ngoData: NgoData[];
    generalUsers: User[]; // Added for overview stats
}

const SdmaDashboard: React.FC<SdmaDashboardProps> = (props) => {
    const { user } = useAuth();
    const { activeTab, setActiveTab, floodZones, setFloodZones, alerts, sdmReports, setSdmReports } = props;

    // Filter data for the current SDMA's state
    const stateFloodZones = floodZones.filter(z => z.state === user?.state);
    const stateAlerts = alerts.filter(a => a.targetAreas.includes('all') || a.targetAreas.includes(user?.state || ''));

    const handleAddZone = (zone: Omit<FloodZone, 'id'>) => {
        setFloodZones(prev => [...prev, { ...zone, id: `zone-${Date.now()}`, parent: user?.id, state: user?.state }]);
    };
    const handleUpdateZone = (zone: FloodZone) => {
        setFloodZones(prev => prev.map(z => z.id === zone.id ? zone : z));
    };
    const handleDeleteZone = (zoneId: string) => {
        setFloodZones(prev => prev.filter(z => z.id !== zoneId));
    };

    const sidebarItems = [
        { id: 'overview', label: 'Overview & Tasks', icon: BarChart3 },
        { id: 'operations', label: 'Operations Map', icon: MapPin },
        { id: 'resources', label: 'Resources', icon: Truck },
        { id: 'alerts', label: 'View Alerts', icon: Send },
        { id: 'reports', label: 'Submit Report', icon: FileText },
        { id: 'updates', label: 'Updates Feed', icon: Inbox },
    ];

    const getSeverityClass = (severity: string) => {
        switch (severity) {
          case 'critical': return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-500' };
          case 'high': return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-500' };
          case 'warning': return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500' };
          default: return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-500' };
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <SdmOverview {...props} />;
            case 'operations': return <div className="h-[80vh]"><FloodMap zones={stateFloodZones} sosRequests={props.sosRequests.filter(s => s.state === user?.state)} showSOS={true} canEdit={true} onAddZone={handleAddZone} onUpdateZone={handleUpdateZone} onDeleteZone={handleDeleteZone} jurisdiction="district" /></div>;
            case 'resources': return <SdmResources {...props} />;
            case 'alerts': return (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">Alerts from NDMA</h2>
                    {stateAlerts.length > 0 ? stateAlerts.map(alert => (
                        <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${getSeverityClass(alert.severity as any).border} ${getSeverityClass(alert.severity as any).bg}`}>
                            <div className="flex items-start">
                                <AlertTriangle className={`w-6 h-5 mr-3 mt-1 flex-shrink-0 ${getSeverityClass(alert.severity as any).text}`} />
                                <div>
                                    <p className={`font-semibold ${getSeverityClass(alert.severity as any).text}`}>{alert.title}</p>
                                    <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                                    <p className="text-xs text-gray-500 mt-2">{new Date(alert.timestamp).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    )) : <p className="text-center text-gray-500 py-8">No alerts for your state at the moment.</p>}
                </div>
            );
            case 'reports': return <SdmReportPublisher sdmReports={sdmReports} setSdmReports={setSdmReports} />;
            case 'updates': return (
                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Updates from DDMA & Field Teams</h2>
                        <p className="text-gray-600">Live feed of reports from your state.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        {/* This would be populated by reports from DDMAs, Rescue Teams, NGOs */}
                        <p className="text-gray-500">No new updates at this time.</p>
                    </div>
                </div>
            );
            default: return <SdmOverview {...props} />;
        }
    };

    return (
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-64">
                    <nav className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
                        <div className="space-y-2">
                            {sidebarItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${activeTab === item.id ? 'bg-red-100 text-red-700' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </nav>
                </div>
                <div className="flex-1">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default SdmaDashboard;
