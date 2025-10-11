import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, MapPin, Truck, Send, FileText, Inbox, Menu, X } from 'lucide-react';
import { FloodZone, Resource, Alert, Task, ResourceRequest, User, NgoData, SdmReport, SOSRequest } from '../../../types';
import FloodMap from '../../map/FloodMap';
import SdmOverview from './SdmOverview';
import SdmResources from './SdmResources';
import SdmReportPublisher from './SdmReportPublisher';
import { useAuth } from '../../../context/AuthContext';
import AdminSidebar from '../AdminSidebar';

interface SdmaDashboardProps {
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
    isSidebarCollapsed: boolean;
    setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
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
    generalUsers: User[];
}

const SdmaDashboard: React.FC<SdmaDashboardProps> = (props) => {
    const { user } = useAuth();
    const { activeTab, setActiveTab, floodZones, setFloodZones, alerts, sdmReports, setSdmReports, isSidebarCollapsed, setIsSidebarCollapsed } = props;
    const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
            case 'operations': return <div className="h-[85vh]"><FloodMap zones={stateFloodZones} sosRequests={props.sosRequests.filter(s => s.state === user?.state)} showSOS={true} canEdit={true} onAddZone={handleAddZone} onUpdateZone={handleUpdateZone} onDeleteZone={handleDeleteZone} jurisdiction="district" onExit={() => setActiveTab('overview')} /></div>;
            case 'resources': return <SdmResources {...props} />;
            case 'alerts': return (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">Alerts from NDMA</h2>
                    {stateAlerts.length > 0 ? stateAlerts.map(alert => (
                        <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${getSeverityClass(alert.severity as any).border} ${getSeverityClass(alert.severity as any).bg}`}>
                            <div className="flex items-start">
                                <Send className={`w-6 h-5 mr-3 mt-1 flex-shrink-0 ${getSeverityClass(alert.severity as any).text}`} />
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
                        <p className="text-gray-500">No new updates at this time.</p>
                    </div>
                </div>
            );
            default: return <SdmOverview {...props} />;
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
                        <h1 className="text-lg md:text-xl font-bold text-gray-800">SDMA Dashboard</h1>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default SdmaDashboard;
