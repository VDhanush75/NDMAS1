import React, { useState } from 'react';
import { 
  BarChart3, AlertTriangle, MapPin, Truck, Send, Newspaper, Users, Inbox, CheckCircle, XCircle, FileText
} from 'lucide-react';
import { FloodZone, SOSRequest, Resource, Alert, NewsReport, User, NgoData, Task, ResourceRequest, SdmReport } from '../../../types';
import FloodMap from '../../map/FloodMap';
import SendAlertsView from '../SendAlertsView';
import ReportsPublisher from '../ReportsPublisher';
import UserStats from './UserStats';
import ResourceManagement from './ResourceManagement';
import RoleManagement from './RoleManagement';
import UpdatesFeed from './UpdatesFeed';

interface NdmaDashboardProps {
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
    floodZones: FloodZone[]; setFloodZones: React.Dispatch<React.SetStateAction<FloodZone[]>>;
    sosRequests: SOSRequest[]; setSosRequests: React.Dispatch<React.SetStateAction<SOSRequest[]>>;
    resources: Resource[]; setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
    alerts: Alert[]; setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
    newsReports: NewsReport[]; setNewsReports: React.Dispatch<React.SetStateAction<NewsReport[]>>;
    adminUsers: User[]; setAdminUsers: React.Dispatch<React.SetStateAction<User[]>>;
    rescueUsers: User[]; setRescueUsers: React.Dispatch<React.SetStateAction<User[]>>;
    ngoData: NgoData[]; setNgoData: React.Dispatch<React.SetStateAction<NgoData[]>>;
    generalUsers: User[];
    sdmReports: SdmReport[];
    resourceRequests: ResourceRequest[];
    setResourceRequests: React.Dispatch<React.SetStateAction<ResourceRequest[]>>;
}

const NdmaDashboard: React.FC<NdmaDashboardProps> = (props) => {
    const { activeTab, setActiveTab, floodZones, setFloodZones, sosRequests, setSosRequests, adminUsers, setResourceRequests } = props;

    const handleAssignSdm = (sosId: string, sdmId: string) => {
        setSosRequests(prev => prev.map(sos => sos.id === sosId ? { ...sos, assignedSdm: sdmId, status: 'assigned' } : sos));
    };

    const handleAddZone = (zone: Omit<FloodZone, 'id'>) => {
        setFloodZones(prev => [...prev, { ...zone, id: `zone-${Date.now()}` }]);
    };
    const handleUpdateZone = (zone: FloodZone) => {
        setFloodZones(prev => prev.map(z => z.id === zone.id ? zone : z));
    };
    const handleDeleteZone = (zoneId: string) => {
        setFloodZones(prev => prev.filter(z => z.id !== zoneId));
    };
    
    const handleUpdateRequestStatus = (requestId: string, status: 'Approved' | 'Rejected') => {
        setResourceRequests(prev => 
            prev.map(req => req.id === requestId ? { ...req, status } : req)
        );
    };

    const sidebarItems = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'updates', label: 'Updates Feed', icon: Inbox },
        { id: 'operations', label: 'Operations Map', icon: MapPin },
        { id: 'sos', label: 'SOS Requests', icon: AlertTriangle },
        { id: 'resources', label: 'Resource Mgmt', icon: Truck },
        { id: 'alerts', label: 'Send Alerts', icon: Send },
        { id: 'reports', label: 'Publish Reports', icon: Newspaper },
        { id: 'roles', label: 'Role Management', icon: Users },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <UserStats users={props.generalUsers} sosRequests={sosRequests} resources={props.resources} />;
            case 'updates': return <UpdatesFeed 
                                        sdmReports={props.sdmReports} 
                                        resourceRequests={props.resourceRequests}
                                        sosRequests={props.sosRequests}
                                        onUpdateRequestStatus={handleUpdateRequestStatus} 
                                    />;
            case 'operations': return <div className="h-[80vh]"><FloodMap zones={floodZones} sosRequests={sosRequests} showSOS={true} canEdit={true} onAddZone={handleAddZone} onUpdateZone={handleUpdateZone} onDeleteZone={handleDeleteZone} jurisdiction="state" /></div>;
            case 'sos': return (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">SOS Request Management</h2>
                    {sosRequests.map((sos) => (
                        <div key={sos.id} className="bg-white rounded-lg p-4 shadow-sm flex justify-between items-center">
                            <div>
                                <p className="font-bold">{sos.userName} - {sos.description}</p>
                                <p className="text-sm text-gray-500">{sos.state}, {sos.district}</p>
                                <p className="text-sm text-gray-500">Status: {sos.status} {sos.assignedSdm && `(Assigned to ${props.adminUsers.find(u=>u.id === sos.assignedSdm)?.name})`}</p>
                            </div>
                            {sos.status === 'pending' && (
                                <select onChange={(e) => handleAssignSdm(sos.id, e.target.value)} className="p-2 border rounded-lg bg-white" defaultValue="">
                                    <option value="" disabled>Assign to SDMA</option>
                                    {adminUsers.filter(u => u.adminLevel === 'SDMA').map(sdm => <option key={sdm.id} value={sdm.id}>{sdm.name}</option>)}
                                </select>
                            )}
                        </div>
                    ))}
                </div>
            );
            case 'resources': return <ResourceManagement resources={props.resources} setResources={props.setResources} />;
            case 'alerts': return <SendAlertsView initialAlerts={props.alerts} setAlerts={props.setAlerts} />;
            case 'reports': return <ReportsPublisher initialReports={props.newsReports} setNewsReports={props.setNewsReports} />;
            case 'roles': return <RoleManagement adminUsers={props.adminUsers} setAdminUsers={props.setAdminUsers} rescueUsers={props.rescueUsers} setRescueUsers={props.setRescueUsers} ngoData={props.ngoData} setNgoData={props.setNgoData} />;
            default: return <div>Overview</div>;
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

export default NdmaDashboard;
