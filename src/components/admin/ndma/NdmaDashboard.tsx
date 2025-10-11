import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, AlertTriangle, MapPin, Truck, Send, Newspaper, Users, Inbox, Menu, X
} from 'lucide-react';
import { FloodZone, SOSRequest, User, NgoData, SdmReport, ResourceRequest } from '../../../types';
import FloodMap from '../../map/FloodMap';
import SendAlertsView from '../SendAlertsView';
import ReportsPublisher from '../ReportsPublisher';
import UserStats from './UserStats';
import ResourceManagement from './ResourceManagement';
import RoleManagement from './RoleManagement';
import UpdatesFeed from './UpdatesFeed';
import AdminSidebar from '../AdminSidebar';

interface NdmaDashboardProps {
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
    isSidebarCollapsed: boolean;
    setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
    floodZones: FloodZone[]; setFloodZones: React.Dispatch<React.SetStateAction<FloodZone[]>>;
    sosRequests: SOSRequest[]; setSosRequests: React.Dispatch<React.SetStateAction<SOSRequest[]>>;
    resources: any[]; setResources: React.Dispatch<React.SetStateAction<any[]>>;
    alerts: any[]; setAlerts: React.Dispatch<React.SetStateAction<any[]>>;
    newsReports: any[]; setNewsReports: React.Dispatch<React.SetStateAction<any[]>>;
    adminUsers: User[]; setAdminUsers: React.Dispatch<React.SetStateAction<User[]>>;
    rescueUsers: User[]; setRescueUsers: React.Dispatch<React.SetStateAction<User[]>>;
    ngoData: NgoData[]; setNgoData: React.Dispatch<React.SetStateAction<NgoData[]>>;
    generalUsers: User[];
    sdmReports: SdmReport[];
    resourceRequests: ResourceRequest[];
    setResourceRequests: React.Dispatch<React.SetStateAction<ResourceRequest[]>>;
}

const NdmaDashboard: React.FC<NdmaDashboardProps> = (props) => {
    const { activeTab, setActiveTab, floodZones, setFloodZones, sosRequests, setSosRequests, adminUsers, setResourceRequests, isSidebarCollapsed, setIsSidebarCollapsed } = props;
    const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
            case 'operations': return <div className="h-[85vh]"><FloodMap zones={floodZones} sosRequests={sosRequests} showSOS={true} canEdit={true} onAddZone={handleAddZone} onUpdateZone={handleUpdateZone} onDeleteZone={handleDeleteZone} jurisdiction="state" onExit={() => setActiveTab('overview')} /></div>;
            case 'sos': return (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">SOS Request Management</h2>
                    {sosRequests.map((sos) => (
                        <div key={sos.id} className="bg-white rounded-lg p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <p className="font-bold">{sos.userName} - {sos.description}</p>
                                <p className="text-sm text-gray-500">{sos.state}, {sos.district}</p>
                                <p className="text-sm text-gray-500">Status: {sos.status} {sos.assignedSdm && `(Assigned to ${props.adminUsers.find(u=>u.id === sos.assignedSdm)?.name})`}</p>
                            </div>
                            {sos.status === 'pending' && (
                                <select onChange={(e) => handleAssignSdm(sos.id, e.target.value)} className="p-2 border rounded-lg bg-white w-full sm:w-auto" defaultValue="">
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

    const SidebarComponent = () => (
        <AdminSidebar 
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
            sidebarItems={sidebarItems}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
        />
    );

    return (
        <div className="flex h-screen">
            <div className="hidden lg:flex flex-shrink-0">
                <SidebarComponent />
            </div>
            
            <AnimatePresence>
                {isMobileSidebarOpen && (
                     <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                            onClick={() => setMobileSidebarOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed top-0 left-0 h-full w-64 bg-white z-50 lg:hidden"
                        >
                            <AdminSidebar 
                                isCollapsed={false}
                                setIsCollapsed={() => {}}
                                sidebarItems={sidebarItems}
                                activeTab={activeTab}
                                setActiveTab={(tab) => {
                                    setActiveTab(tab);
                                    setMobileSidebarOpen(false);
                                }}
                            />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <main className="flex-1 flex flex-col">
                <header className="flex-shrink-0 bg-white shadow-sm h-16 flex items-center justify-between px-4 lg:px-8">
                    <div className="flex items-center">
                        <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden mr-3 p-2 text-gray-600">
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-lg md:text-xl font-bold text-gray-800">NDMA Dashboard</h1>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default NdmaDashboard;
