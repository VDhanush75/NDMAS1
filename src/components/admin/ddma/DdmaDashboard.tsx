import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, MapPin, Truck, Send, AlertTriangle, Menu, X } from 'lucide-react';
import { FloodZone, Resource, Alert, Task, ResourceRequest, User, NgoData, SOSRequest } from '../../../types';
import FloodMap from '../../map/FloodMap';
import DdmOverview from './DdmOverview';
import DdmResources from './DdmResources';
import { useAuth } from '../../../context/AuthContext';
import AdminSidebar from '../AdminSidebar';

interface DdmaDashboardProps {
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
    isSidebarCollapsed: boolean;
    setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
    floodZones: FloodZone[]; setFloodZones: React.Dispatch<React.SetStateAction<FloodZone[]>>;
    sosRequests: SOSRequest[]; setSosRequests: React.Dispatch<React.SetStateAction<SOSRequest[]>>;
    resources: Resource[];
    setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
    alerts: Alert[];
    tasks: Task[]; setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    resourceRequests: ResourceRequest[]; setResourceRequests: React.Dispatch<React.SetStateAction<ResourceRequest[]>>;
    rescueUsers: User[];
    ngoData: NgoData[];
    generalUsers: User[];
}

const DdmaDashboard: React.FC<DdmaDashboardProps> = (props) => {
    const { user } = useAuth();
    const { activeTab, setActiveTab, floodZones, setFloodZones, alerts, sosRequests, setSosRequests, rescueUsers, ngoData, isSidebarCollapsed, setIsSidebarCollapsed } = props;
    const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const mapRef = useRef<any>(null);

    useEffect(() => {
        if (activeTab === 'operations') {
            setTimeout(() => mapRef.current?.invalidateSize(), 350);
        }
    }, [activeTab, isSidebarCollapsed, isMobileSidebarOpen]);

    const district = user?.district;
    const districtFloodZones = floodZones.filter(z => z.district === district || z.parent === user?.id);
    const districtAlerts = alerts.filter(a => a.targetAreas.includes('all') || a.targetAreas.includes(user?.state || '') || a.targetAreas.includes(user?.district || ''));
    const districtSosRequests = sosRequests.filter(s => s.district === district);
    const districtRescueTeams = rescueUsers.filter(u => u.district === district);
    const districtNgos = ngoData.filter(n => n.assignedDistrict === district);

    const handleAddZone = (zone: Omit<FloodZone, 'id'>) => {
        setFloodZones(prev => [...prev, { ...zone, id: `zone-${Date.now()}`, parent: user?.id, district: user?.district, state: user?.state }]);
    };
    const handleUpdateZone = (zone: FloodZone) => {
        setFloodZones(prev => prev.map(z => z.id === zone.id ? zone : z));
    };
    const handleDeleteZone = (zoneId: string) => {
        setFloodZones(prev => prev.filter(z => z.id !== zoneId));
    };
    
    const handleAssignSOS = (sosId: string, assigneeType: 'Rescue' | 'NGO', assigneeId: string) => {
        setSosRequests(prev => prev.map(sos => {
            if (sos.id === sosId) {
                return {
                    ...sos,
                    status: 'assigned',
                    assignedRescueTeam: assigneeType === 'Rescue' ? assigneeId : undefined,
                    assignedNgo: assigneeType === 'NGO' ? assigneeId : undefined,
                };
            }
            return sos;
        }));
    };

    const sidebarItems = [
        { id: 'overview', label: 'Overview & Tasks', icon: BarChart3 },
        { id: 'operations', label: 'Operations Map', icon: MapPin },
        { id: 'sos', label: 'SOS Requests', icon: AlertTriangle },
        { id: 'resources', label: 'Resources', icon: Truck },
        { id: 'alerts', label: 'View Alerts', icon: Send },
    ];

    const getSeverityClass = (severity: string) => {
        switch (severity) {
          case 'critical': return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-500' };
          case 'high': return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-500' };
          case 'medium': return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500' };
          default: return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-500' };
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <DdmOverview {...props} />;
            case 'operations': return <div className="h-[85vh]"><FloodMap mapRef={mapRef} zones={districtFloodZones} sosRequests={districtSosRequests} showSOS={true} canEdit={true} onAddZone={handleAddZone} onUpdateZone={handleUpdateZone} onDeleteZone={handleDeleteZone} jurisdiction="local" onExit={() => setActiveTab('overview')} /></div>;
            case 'sos': return (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">SOS Requests in {district}</h2>
                    {districtSosRequests.length === 0 ? <p className="text-gray-500">No active SOS requests in your district.</p> :
                    districtSosRequests.map((sos) => (
                        <div key={sos.id} className={`p-4 rounded-lg border-l-4 ${getSeverityClass(sos.severity).border} ${getSeverityClass(sos.severity).bg}`}>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-lg">{sos.userName} - <span className="font-medium">{sos.description}</span></p>
                                    <p className="text-sm text-gray-600">Location: {sos.location.join(', ')} | Status: <span className="font-semibold">{sos.status}</span></p>
                                    {sos.assignedRescueTeam && <p className="text-sm text-green-700">Assigned to Rescue: {rescueUsers.find(u => u.id === sos.assignedRescueTeam)?.name}</p>}
                                    {sos.assignedNgo && <p className="text-sm text-blue-700">Assigned to NGO: {ngoData.find(n => n.id === sos.assignedNgo)?.name}</p>}
                                </div>
                                <div className="flex-shrink-0 w-full sm:w-auto">
                                    {sos.status === 'pending' || sos.status === 'assigned' ? (
                                        <div className="flex items-center space-x-2">
                                            <select 
                                                className="p-2 border rounded-lg bg-white text-sm w-full"
                                                onChange={(e) => {
                                                    const [type, id] = e.target.value.split('-');
                                                    handleAssignSOS(sos.id, type as 'Rescue' | 'NGO', id);
                                                }}
                                                defaultValue=""
                                            >
                                                <option value="" disabled>Assign to...</option>
                                                <optgroup label="Rescue Teams">
                                                    {districtRescueTeams.map(team => <option key={team.id} value={`Rescue-${team.id}`}>{team.name}</option>)}
                                                </optgroup>
                                                <optgroup label="NGOs">
                                                    {districtNgos.map(ngo => <option key={ngo.id} value={`NGO-${ngo.id}`}>{ngo.name}</option>)}
                                                </optgroup>
                                            </select>
                                        </div>
                                    ) : <span className="text-sm font-semibold text-green-600">Actioned</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
            case 'resources': return <DdmResources {...props} />;
            case 'alerts': return (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">Alerts for {district}</h2>
                    {districtAlerts.map(alert => (
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
                    ))}
                </div>
            );
            default: return <DdmOverview {...props} />;
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
                        <h1 className="text-lg md:text-xl font-bold text-gray-800">DDMA Dashboard</h1>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default DdmaDashboard;
