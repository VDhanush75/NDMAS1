import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Camera, 
  Mic, 
  Bell,
  Cloud,
  LogOut,
  Users,
  Search,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  LifeBuoy,
  LayoutDashboard,
  Newspaper,
  Settings,
  Map,
  User as UserIcon,
  Languages,
  Save,
  Download
} from 'lucide-react';
import { 
  ComposedChart, 
  Line, 
  Area,
  Bar,
  BarChart,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import FloodMap from '../map/FloodMap';
import { alerts, floodZones, historicalData, regionalRiskData, sosRequests, yearlyImpactData, stateWiseImpactData } from '../../data/mockData';
import { User } from '../../types';

const getSeverityClass = (severity: 'critical' | 'high' | 'warning' | 'info') => {
    switch (severity) {
      case 'critical': return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-500' };
      case 'high': return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-500' };
      case 'warning': return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500' };
      default: return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-500' };
    }
};

const StatCard = ({ icon, title, value, trend, trendValue, colorClass }: { icon: React.ReactNode, title: string, value: string | number, trend: 'up' | 'down', trendValue: string, colorClass: { bg: string } }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl ${colorClass.bg}`}>
          {icon}
        </div>
        <div className="flex items-center text-sm font-medium">
          {trend === 'up' ? <TrendingUp className="w-5 h-5 text-green-500" /> : <TrendingDown className="w-5 h-5 text-red-500" />}
          <span className={`ml-1 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>{trendValue}</span>
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-800 mt-4">{value}</p>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
    </div>
);

const DashboardView: React.FC = () => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                <StatCard 
                    icon={<MapPin className="w-7 h-7 text-blue-600" />}
                    title="Affected Areas"
                    value={floodZones.filter(z => z.riskLevel === 'red' || z.riskLevel === 'orange').length}
                    trend="up"
                    trendValue="+3 this week"
                    colorClass={{bg: 'bg-blue-100'}}
                />
                <StatCard 
                    icon={<AlertTriangle className="w-7 h-7 text-orange-600" />}
                    title="Active SOS Requests"
                    value={sosRequests.filter(s => s.status !== 'completed').length}
                    trend="down"
                    trendValue="-1 since yesterday"
                    colorClass={{bg: 'bg-orange-100'}}
                />
                <StatCard 
                    icon={<LifeBuoy className="w-7 h-7 text-green-600" />}
                    title="Rescues Completed"
                    value={sosRequests.filter(s => s.status === 'completed').length}
                    trend="up"
                    trendValue="+2 today"
                    colorClass={{bg: 'bg-green-100'}}
                />
                <StatCard 
                    icon={<Cloud className="w-7 h-7 text-red-600" />}
                    title="Current Alert Level"
                    value="High"
                    trend="up"
                    trendValue="Raised 2h ago"
                    colorClass={{bg: 'bg-red-100'}}
                />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6"
                >
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Historical Flood Risk Analysis (Last 10 Years)</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <ComposedChart data={historicalData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis dataKey="year" tick={{ fill: '#6B7280' }} />
                            <YAxis yAxisId="left" label={{ value: 'Rainfall (mm)', angle: -90, position: 'insideLeft', fill: '#6B7280' }} tick={{ fill: '#6B7280' }} />
                            <YAxis yAxisId="right" orientation="right" label={{ value: 'River Level (m)', angle: 90, position: 'insideRight', fill: '#6B7280' }} tick={{ fill: '#6B7280' }} />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(5px)', border: '1px solid #ddd', borderRadius: '1rem' }} />
                            <Legend />
                            <defs>
                                <linearGradient id="colorRainfall" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorRiver" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#84cc16" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#84cc16" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="rainfall" yAxisId="left" stroke="#3B82F6" strokeWidth={2} fill="url(#colorRainfall)" name="Avg. Rainfall" />
                            <Area type="monotone" dataKey="riverLevel" yAxisId="right" stroke="#84cc16" strokeWidth={2} fill="url(#colorRiver)" name="Peak River Level" />
                            <Line type="monotone" dataKey={() => 7.5} yAxisId="right" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" name="Danger Threshold" dot={false} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-2xl shadow-md p-6"
                >
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Regional Risk Breakdown</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={regionalRiskData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} innerRadius={70} paddingAngle={3}>
                                {regionalRiskData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                        <p className="text-sm text-gray-600">This data represents the historical probability of flood events based on the last 10 years of data.</p>
                    </div>
                </motion.div>
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-md p-6"
            >
                <h2 className="text-xl font-bold text-gray-900 mb-4">Yearly Flood Impact Analysis (All India)</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={yearlyImpactData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="year" tick={{ fill: '#6B7280' }} />
                        <YAxis yAxisId="left" label={{ value: 'Affected Districts', angle: -90, position: 'insideLeft', fill: '#6B7280' }} tick={{ fill: '#6B7280' }} />
                        <YAxis yAxisId="right" orientation="right" label={{ value: 'Population Impact (M)', angle: 90, position: 'insideRight', fill: '#6B7280' }} tick={{ fill: '#6B7280' }} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(5px)', border: '1px solid #ddd', borderRadius: '1rem' }} />
                        <Legend />
                        <Bar yAxisId="left" dataKey="critical" stackId="a" fill="#EF4444" name="Critical" />
                        <Bar yAxisId="left" dataKey="high" stackId="a" fill="#F97316" name="High" />
                        <Bar yAxisId="left" dataKey="moderate" stackId="a" fill="#F59E0B" name="Moderate" />
                        <Bar yAxisId="left" dataKey="low" stackId="a" fill="#10B981" name="Low" />
                        <Line yAxisId="right" type="monotone" dataKey="populationImpact" stroke="#3B82F6" strokeWidth={3} name="Population Impact (M)" />
                    </ComposedChart>
                </ResponsiveContainer>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl shadow-md p-6"
            >
                <h2 className="text-xl font-bold text-gray-900 mb-4">State-wise Flood Impact (High-Risk Districts)</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        layout="vertical"
                        data={stateWiseImpactData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis type="number" tick={{ fill: '#6B7280' }} />
                        <YAxis dataKey="state" type="category" tick={{ fill: '#6B7280' }} width={100} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(5px)', border: '1px solid #ddd', borderRadius: '1rem' }} />
                        <Legend />
                        <Bar dataKey="critical" stackId="a" fill="#EF4444" name="Critical" />
                        <Bar dataKey="high" stackId="a" fill="#F97316" name="High" />
                        <Bar dataKey="moderate" stackId="a" fill="#F59E0B" name="Moderate" />
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>
        </div>
    );
};

const MapView: React.FC = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-md p-6 h-[85vh]">
        <FloodMap showSOS={true} />
    </motion.div>
);

const AlertsView: React.FC = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">All Alerts</h2>
        <div className="space-y-4">
            {alerts.map((alert) => {
                const severityClasses = getSeverityClass(alert.severity as any);
                return (
                    <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${severityClasses.border} ${severityClasses.bg}`}>
                        <div className="flex items-start">
                            <AlertTriangle className={`w-6 h-5 mr-3 mt-1 flex-shrink-0 ${severityClasses.text}`} />
                            <div>
                                <p className={`font-semibold ${severityClasses.text}`}>{alert.title}</p>
                                <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                                <p className="text-xs text-gray-500 mt-2">{new Date(alert.timestamp).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </motion.div>
);

const NewsView: React.FC = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Latest News & Updates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
                { title: "Government Deploys NDRF Teams to Assam", img: "https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x400/3B82F6/FFFFFF/png?text=News", category: "Response", time: "2 hours ago" },
                { title: "Understanding Flood Patterns: A 10-Year Analysis", img: "https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x400/10B981/FFFFFF/png?text=Analysis", category: "Data", time: "1 day ago" },
                { title: "Community-led Relief Efforts Praised in Kerala", img: "https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x400/F97316/FFFFFF/png?text=Community", category: "Community", time: "3 days ago" }
            ].map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow">
                    <img src={item.img} alt={item.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                        <p className="text-sm text-blue-600 font-semibold">{item.category}</p>
                        <h3 className="font-bold text-gray-800 mt-1">{item.title}</h3>
                        <p className="text-xs text-gray-500 mt-2">{item.time}</p>
                    </div>
                </div>
            ))}
        </div>
    </motion.div>
);

const SettingsView: React.FC<{ user: User | null }> = ({ user }) => {
    const handleDownloadQR = () => {
        if (!user?.qrCodeDataUrl) return;
        const link = document.createElement('a');
        link.href = user.qrCodeDataUrl;
        link.download = `FloodRelief_QR_${user.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile & Settings</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Column 1: Relief ID Card */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center">
                    <img src={user?.profilePhoto || `https://i.pravatar.cc/150?u=${user?.id}`} alt="Profile" className="w-32 h-32 rounded-full border-4 border-blue-200 object-cover mb-4" />
                    <h3 className="text-xl font-bold text-gray-800">{user?.name}</h3>
                    <p className="text-sm text-gray-500">{user?.mobile}</p>
                    <p className="text-sm text-gray-500">{`${user?.district}, ${user?.state}`}</p>
                    
                    {user?.qrCodeDataUrl && (
                        <div className="mt-6 w-full">
                            <img src={user.qrCodeDataUrl} alt="Your Relief QR Code" className="w-40 h-40 mx-auto border-4 border-white shadow-md" />
                            <p className="text-xs text-gray-500 mt-2">Show this QR at relief camps.</p>
                            <button onClick={handleDownloadQR} className="mt-3 w-full bg-gray-700 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 flex items-center justify-center">
                                <Download className="w-4 h-4 mr-2" /> Download QR
                            </button>
                        </div>
                    )}
    
                    <div className="mt-4 w-full pt-4 border-t">
                        <p className="font-semibold text-gray-700">Aid Status</p>
                        <div className={`mt-1 p-2 rounded-lg font-bold text-sm ${user?.aidStatus === 'Received' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {user?.aidStatus || 'Not Received'}
                        </div>
                    </div>
                </div>
    
                {/* Column 2: Editable Settings */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Edit Information</h3>
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <UserIcon className="w-6 h-6 text-gray-500" />
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" defaultValue={user?.name} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Languages className="w-6 h-6 text-gray-500" />
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">Preferred Language</label>
                                <select defaultValue={user?.language} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                    <option value="english">English</option>
                                    <option value="hindi">Hindi</option>
                                    <option value="telugu">Telugu</option>
                                    <option value="kannada">Kannada</option>
                                    <option value="tamil">Tamil</option>
                                </select>
                            </div>
                        </div>
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
                            <div className="mt-4 space-y-3">
                                <label className="flex items-center">
                                    <input type="checkbox" defaultChecked={user?.permissions.sms} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                    <span className="ml-3 text-sm text-gray-600">SMS Alerts</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" defaultChecked={user?.permissions.notifications} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                    <span className="ml-3 text-sm text-gray-600">Push Notifications</span>
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center">
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const UserDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const [sosModalOpen, setSOSModalOpen] = useState(false);
    const [activeView, setActiveView] = useState('dashboard');

    const submitSOS = () => {
        alert('SOS request sent successfully! Emergency services have been notified.');
        setSOSModalOpen(false);
    };

    const sidebarItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'map', label: 'India Map', icon: Map },
        { id: 'alerts', label: 'Alerts', icon: Bell },
        { id: 'news', label: 'News', icon: Newspaper },
        { id: 'settings', label: 'Profile', icon: Settings },
    ];

    const viewTitles: { [key: string]: string } = {
        dashboard: 'Dashboard Overview',
        map: 'Live India Map',
        alerts: 'Alerts & Notifications',
        news: 'Latest News',
        settings: 'Profile & Settings',
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans flex">
            <aside className="w-64 bg-white shadow-lg flex-shrink-0 flex flex-col">
                <div className="h-20 flex items-center justify-center border-b px-4">
                    <div className="bg-blue-600 p-2 rounded-lg mr-3">
                        <ShieldCheck className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">Flood Watch</h1>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {sidebarItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                                activeView === item.id
                                    ? 'bg-blue-100 text-blue-700 font-semibold'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        >
                            <item.icon className="w-5 h-5 mr-4" />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
                <div className="px-4 py-6 border-t">
                    <button
                        onClick={logout}
                        className="w-full flex items-center px-4 py-3 text-left rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600"
                    >
                        <LogOut className="w-5 h-5 mr-4" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow-sm sticky top-0 z-40 h-20 flex-shrink-0">
                    <div className="px-8 h-full flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">{viewTitles[activeView]}</h1>
                        <div className="flex items-center space-x-5">
                            <button
                                onClick={() => setSOSModalOpen(true)}
                                className="bg-red-600 text-white px-5 py-3 rounded-full font-semibold hover:bg-red-700 transition-colors flex items-center shadow-lg"
                            >
                                <Phone className="w-5 h-5 mr-2" />
                                SEND SOS
                            </button>
                            <button className="p-2 text-gray-500 hover:text-gray-700 relative">
                                <Bell className="w-6 h-6" />
                                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>
                            <div className="flex items-center space-x-3">
                                <img src={user?.profilePhoto || `https://i.pravatar.cc/150?u=${user?.id}`} alt="User" className="w-12 h-12 rounded-full border-2 border-blue-200" />
                                <div>
                                    <p className="font-semibold text-gray-800">{user?.name}</p>
                                    <p className="text-sm text-gray-500">{user?.mobile}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-8 overflow-y-auto">
                    {activeView === 'dashboard' && <DashboardView />}
                    {activeView === 'map' && <MapView />}
                    {activeView === 'alerts' && <AlertsView />}
                    {activeView === 'news' && <NewsView />}
                    {activeView === 'settings' && <SettingsView user={user} />}
                </main>
            </div>

            {sosModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-lg p-6 w-full max-w-md"
                    >
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Send Emergency SOS</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Type</label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                                    <option>Trapped - Need Immediate Rescue</option>
                                    <option>Medical Emergency</option>
                                    <option>Missing Person</option>
                                    <option>Structural Damage</option>
                                    <option>Other Emergency</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Information</label>
                                <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" rows={3} placeholder="Describe your emergency situation..."></textarea>
                            </div>
                            <div className="flex space-x-4">
                                <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
                                    <Camera className="w-4 h-4 mr-2" />Add Photo
                                </button>
                                <button className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center">
                                    <Mic className="w-4 h-4 mr-2" />Record Audio
                                </button>
                            </div>
                            <div className="flex space-x-4 pt-4">
                                <button onClick={() => setSOSModalOpen(false)} className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors">Cancel</button>
                                <button onClick={submitSOS} className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">Send SOS</button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
