import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, Phone, Camera, Mic, Bell, LogOut,
  LayoutDashboard, Newspaper, Settings, Map,
  User as UserIcon, Languages, Save, Download, Menu, X, Volume2, ShieldCheck, Home, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import FloodMap from '../map/FloodMap';
import { User, FloodZone, SOSRequest, Alert, NewsReport, SafeShelter } from '../../types';
import { useTranslation } from 'react-i18next';
import { openDB } from 'idb';
import Modal from '../common/Modal';
import WeatherWidget from './WeatherWidget';
import DashboardView from './user/DashboardView';
import qrGenerator from 'qrcode-generator';
import SOSStatusTracker from './SOSStatusTracker';
import { safeShelters as allSafeShelters } from '../../data/mockData';

const dbPromise = openDB('sos-db', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('sos-requests')) {
        db.createObjectStore('sos-requests', { keyPath: 'id' });
    }
  },
});

const saveSOSToDB = async (sosRequest: any) => {
  const db = await dbPromise;
  await db.put('sos-requests', sosRequest);
  console.log('SOS request saved to IndexedDB');
};

const syncSOSRequests = async () => {
  const db = await dbPromise;
  const allReqs = await db.getAll('sos-requests');
  if (allReqs.length === 0) {
    return;
  }
  
  console.log('Syncing SOS requests...', allReqs);
  // In a real app, you would post these to your API server.
  // For this demo, we'll just log them and clear the store.
  allReqs.forEach(req => {
    console.log('Successfully synced:', req);
    db.delete('sos-requests', req.id);
  });
  alert(`${allReqs.length} offline SOS request(s) have been sent.`);
};

window.addEventListener('online', syncSOSRequests);


const MapView: React.FC<{ zones: FloodZone[], sos: SOSRequest[], onExit: () => void }> = ({ zones, sos, onExit }) => {
    const mapRef = useRef<any>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            mapRef.current?.invalidateSize();
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-lg shadow-md h-full w-full">
            <FloodMap 
                zones={zones} 
                sosRequests={sos} 
                showSOS={true} 
                mapRef={mapRef}
                onExit={onExit}
            />
        </motion.div>
    );
};

const speak = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        const langMap: { [key: string]: string } = { 'en': 'en-US', 'hi': 'hi-IN', 'ta': 'ta-IN', 'te': 'te-IN', 'kn': 'kn-IN' };
        utterance.lang = langMap[lang] || 'en-US';
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
    } else {
        alert('Text-to-speech is not supported in your browser.');
    }
};

const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'critical': return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-500' };
      case 'high': return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-500' };
      case 'warning': return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500' };
      default: return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-500' };
    }
};

const AlertsView: React.FC<{ alerts: Alert[], safeShelters: SafeShelter[], user: User | null }> = ({ alerts, safeShelters, user }) => {
    const { t, i18n } = useTranslation();
    
    const getNearbyShelters = (targetAreas: string[]) => {
        return safeShelters.filter(shelter => 
            targetAreas.includes(shelter.state) || targetAreas.includes(shelter.district) || (user && (shelter.state === user.state || shelter.district === user.district))
        );
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('alerts_notifications')}</h2>
            <div className="space-y-4">
                {alerts.map((alert) => {
                    const severityClasses = getSeverityClass(alert.severity);
                    const nearbyShelters = getNearbyShelters(alert.targetAreas);
                    return (
                        <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${severityClasses.border} ${severityClasses.bg}`}>
                            <div className="flex items-start justify-between">
                                <div className="flex items-start flex-grow">
                                    <AlertTriangle className={`w-6 h-5 mr-3 mt-1 flex-shrink-0 ${severityClasses.text}`} />
                                    <div>
                                        <p className={`font-semibold ${severityClasses.text}`}>{t(alert.id + '_title', alert.title)}</p>
                                        <p className="text-sm text-gray-700 mt-1">{t(alert.id + '_message', alert.message)}</p>
                                        <p className="text-xs text-gray-500 mt-2">{new Date(alert.timestamp).toLocaleString()}</p>
                                    </div>
                                </div>
                                <button onClick={() => speak(t(alert.id + '_message', alert.message), i18n.language)} className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                                    <Volume2 className="w-5 h-5" />
                                </button>
                            </div>
                            {nearbyShelters.length > 0 && (
                                <div className="mt-4 pt-3 border-t border-gray-300/50">
                                    <h4 className="text-sm font-semibold text-gray-800 mb-2">{t('nearby_shelters')}</h4>
                                    <div className="space-y-2">
                                        {nearbyShelters.map(shelter => (
                                            <div key={shelter.id} className="flex items-center text-sm text-gray-700">
                                                <Home className="w-4 h-4 mr-2 text-green-600"/>
                                                <span>{shelter.name}, {shelter.district} (Capacity: {shelter.capacity})</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
};

const NewsView: React.FC<{ newsReports: NewsReport[] }> = ({ newsReports }) => {
    const { t, i18n } = useTranslation();
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{t('latest_news')}</h2>
            <div className="space-y-6">
                {newsReports.map((item) => (
                    <div key={item.id} className="flex flex-col md:flex-row gap-4 border-b pb-4 last:border-b-0">
                        <img src={item.imageUrl} alt={item.title} className="w-full md:w-48 h-32 object-cover rounded-lg" />
                        <div className="flex-1">
                            <p className="text-xs text-blue-600 font-semibold uppercase">{t(item.category)}</p>
                            <h3 className="font-bold text-gray-800 mt-1">{t(item.id + '_title', item.title)}</h3>
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{t(item.id + '_content', item.content)}</p>
                            <div className="flex justify-between items-center mt-3">
                                <p className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleString()}</p>
                                <button onClick={() => speak(t(item.id + '_content', item.content), i18n.language)} className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                                    <Volume2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

const SettingsView: React.FC<{ user: User | null }> = ({ user }) => {
    const { t, i18n } = useTranslation();
    const { logout } = useAuth();
    const [qrUrl, setQrUrl] = useState(user?.qrCodeDataUrl);
    
    useEffect(() => {
        if (!user?.qrCodeDataUrl && user) {
            const qrData = JSON.stringify({
                id: user.id, name: user.name, mobile: user.mobile,
                location: `${user.area}, ${user.district}, ${user.state}`,
                aidStatus: user.aidStatus,
            });
            const qr = qrGenerator(0, 'M');
            qr.addData(qrData);
            qr.make();
            const dataUrl = qr.createDataURL(4, 4);
            setQrUrl(dataUrl);
        }
    }, [user]);

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        i18n.changeLanguage(e.target.value);
    };

    const handleDownloadQR = () => {
        if (!qrUrl) return;
        const link = document.createElement('a');
        link.href = qrUrl;
        link.download = `FloodRelief_QR_${user?.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('profile_title')}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center">
                    <img src={user?.profilePhoto || `https://ui-avatars.com/api/?name=${user?.name}&background=random`} alt="Profile" className="w-32 h-32 rounded-full border-4 border-blue-200 object-cover mb-4" />
                    <h3 className="text-xl font-bold text-gray-800">{user?.name}</h3>
                    <p className="text-sm text-gray-500">{user?.mobile}</p>
                    <p className="text-sm text-gray-500">{`${user?.area}, ${user?.district}, ${user?.state}`}</p>
                    
                    {qrUrl && (
                        <div className="mt-6 w-full">
                            <p className="font-semibold text-gray-700 mb-2">{t('relief_id_card')}</p>
                            <img src={qrUrl} alt="Your Relief QR Code" className="w-40 h-40 mx-auto border-4 border-white shadow-md" />
                            <p className="text-xs text-gray-500 mt-2">{t('show_qr')}</p>
                            <button onClick={handleDownloadQR} className="mt-3 w-full bg-gray-700 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 flex items-center justify-center">
                                <Download className="w-4 h-4 mr-2" /> {t('download_qr')}
                            </button>
                        </div>
                    )}
    
                    <div className="mt-4 w-full pt-4 border-t">
                        <p className="font-semibold text-gray-700">{t('aid_status')}</p>
                        <div className={`mt-1 p-2 rounded-lg font-bold text-sm ${user?.aidStatus === 'Received' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {user?.aidStatus || 'Not Received'}
                        </div>
                    </div>
                </div>
    
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">{t('edit_info')}</h3>
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <UserIcon className="w-6 h-6 text-gray-500" />
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">{t('full_name')}</label>
                                <input type="text" defaultValue={user?.name} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Languages className="w-6 h-6 text-gray-500" />
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">{t('preferred_language')}</label>
                                <select defaultValue={i18n.language} onChange={handleLanguageChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                    <option value="en">English</option>
                                    <option value="hi">हिंदी (Hindi)</option>
                                    <option value="ta">தமிழ் (Tamil)</option>
                                    <option value="te">తెలుగు (Telugu)</option>
                                    <option value="kn">ಕನ್ನಡ (Kannada)</option>
                                </select>
                            </div>
                        </div>
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-medium text-gray-900">{t('notification_settings')}</h3>
                            <div className="mt-4 space-y-3">
                                <label className="flex items-center">
                                    <input type="checkbox" defaultChecked={user?.permissions.sms} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                    <span className="ml-3 text-sm text-gray-600">{t('sms_alerts')}</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" defaultChecked={user?.permissions.notifications} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                    <span className="ml-3 text-sm text-gray-600">{t('push_notifications')}</span>
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center">
                                <Save className="w-4 h-4 mr-2" />
                                {t('save_changes')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

interface UserDashboardProps {
  floodZones: FloodZone[];
  sosRequests: SOSRequest[];
  alerts: Alert[];
  newsReports: NewsReport[];
  safeShelters: SafeShelter[];
  setSosRequests: React.Dispatch<React.SetStateAction<SOSRequest[]>>;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ floodZones, sosRequests, alerts, newsReports, safeShelters, setSosRequests }) => {
    const { user, logout } = useAuth();
    const { t } = useTranslation();
    const [sosModalOpen, setSOSModalOpen] = useState(false);
    const [activeView, setActiveView] = useState('dashboard');
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [sosMessage, setSosMessage] = useState('');
    const [sosMedia, setSosMedia] = useState<File | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [sosModalError, setSosModalError] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const [isTrackerVisible, setTrackerVisible] = useState(true);

    const activeSOS = user ? sosRequests.find(req => req.userId === user.id && req.status !== 'completed') : undefined;

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSosMedia(e.target.files[0]);
        }
    };

    const handleAudioRecord = async () => {
        setSosModalError(null);
        if (isRecording) {
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorderRef.current = new MediaRecorder(stream);
                audioChunksRef.current = [];
                mediaRecorderRef.current.ondataavailable = (event) => {
                    audioChunksRef.current.push(event.data);
                };
                mediaRecorderRef.current.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    const audioFile = new File([audioBlob], `audio_${Date.now()}.webm`, { type: 'audio/webm' });
                    setSosMedia(audioFile);
                    stream.getTracks().forEach(track => track.stop());
                };
                mediaRecorderRef.current.start();
                setIsRecording(true);
            } catch (err: any) {
                if (err.name === 'NotFoundError') {
                    setSosModalError("No microphone found. This feature may not be supported in your current environment.");
                } else if (err.name === 'NotAllowedError') {
                    setSosModalError("Microphone access was denied. Please check your browser permissions and try again.");
                } else {
                    setSosModalError("Could not access the microphone. Please ensure it is connected and permissions are granted.");
                }
            }
        }
    };

    const submitSOS = async () => {
        const sosData = {
            id: `sos_${Date.now()}`,
            userId: user?.id,
            userName: user?.name,
            location: [22.5, 88.4],
            timestamp: new Date(),
            status: 'pending',
            severity: 'critical',
            description: sosMessage || 'Trapped - Need Immediate Rescue',
            media: sosMedia ? [sosMedia.name] : [],
            state: user?.state,
            district: user?.district
        };

        if (!navigator.onLine && 'serviceWorker' in navigator && 'SyncManager' in window) {
            try {
                const sw = await navigator.serviceWorker.ready;
                await saveSOSToDB(sosData);
                await sw.sync.register('sync-sos-requests');
                alert('You are offline. SOS request saved and will be sent automatically when you are back online.');
            } catch (error) {
                console.error('Background sync registration failed:', error);
                setSosRequests(prev => [sosData as SOSRequest, ...prev]);
                alert('SOS request saved locally. It will be sent when you are online.');
            }
        } else {
            console.log("Sending SOS request:", sosData);
            setSosRequests(prev => [sosData as SOSRequest, ...prev]);
            alert('SOS request sent successfully! Emergency services have been notified.');
        }
        setTrackerVisible(true);
        closeSosModal();
    };

    const closeSosModal = () => {
        setSOSModalOpen(false);
        setSosModalError(null);
        setSosMessage('');
        setSosMedia(null);
        if (isRecording) {
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
        }
    };

    const sidebarItems = [
        { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
        { id: 'map', label: t('map'), icon: Map },
        { id: 'alerts', label: t('alerts'), icon: Bell },
        { id: 'news', label: t('news'), icon: Newspaper },
        { id: 'settings', label: t('profile'), icon: Settings },
    ];
    
    const viewTitles: { [key: string]: string } = {
        dashboard: t('dashboard_overview'),
        map: t('live_map'),
        alerts: t('alerts_notifications'),
        news: t('latest_news'),
        settings: t('profile_title'),
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="h-20 flex items-center justify-center border-b px-4">
                <div className="bg-blue-600 p-2 rounded-lg mr-3">
                    <ShieldCheck className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">FloodSafe</h1>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {sidebarItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => { setActiveView(item.id); setSidebarOpen(false); }}
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
                <div className="pt-4 border-t border-gray-200">
                    <WeatherWidget />
                </div>
            </nav>
            <div className="px-4 py-6 border-t">
                <button
                    onClick={logout}
                    className="w-full flex items-center px-4 py-3 text-left rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600"
                >
                    <LogOut className="w-5 h-5 mr-4" />
                    <span>{t('logout')}</span>
                </button>
            </div>
        </div>
    );

    const renderContent = () => {
        if (activeSOS && isTrackerVisible) return <SOSStatusTracker sosRequest={activeSOS} onExit={() => setTrackerVisible(false)} />;
        switch (activeView) {
            case 'dashboard': return <DashboardView floodZones={floodZones} sosRequests={sosRequests} />;
            case 'map': return <div className="flex-1 min-h-0"><MapView zones={floodZones} sos={sosRequests} onExit={() => setActiveView('dashboard')} /></div>;
            case 'alerts': return <AlertsView alerts={alerts} safeShelters={safeShelters} user={user} />;
            case 'news': return <NewsView newsReports={newsReports} />;
            case 'settings': return <SettingsView user={user} />;
            default: return <DashboardView floodZones={floodZones} sosRequests={sosRequests} />;
        }
    };

    return (
        <div className="h-screen w-screen bg-gray-100 flex">
            <aside className="w-72 bg-white shadow-lg flex-shrink-0 flex-col hidden lg:flex">
                <SidebarContent />
            </aside>

            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50 flex flex-col"
                        >
                             <button
                                onClick={() => setSidebarOpen(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10"
                                aria-label="Close menu"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm sticky top-0 z-30 h-20 flex-shrink-0">
                    <div className="px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
                        <div className="flex items-center">
                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-4 p-2 rounded-md text-gray-500 hover:bg-gray-100">
                                <Menu className="w-6 h-6" />
                            </button>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900">{activeSOS && isTrackerVisible ? 'Active SOS Status' : viewTitles[activeView]}</h1>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-5">
                            <button
                                onClick={() => setSOSModalOpen(true)}
                                className="bg-red-600 text-white px-3 sm:px-5 py-2 sm:py-3 rounded-full font-semibold hover:bg-red-700 transition-colors flex items-center shadow-lg"
                            >
                                <Phone className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
                                <span className="hidden sm:inline">{t('send_sos')}</span>
                            </button>
                            <button className="p-2 text-gray-500 hover:text-gray-700 relative">
                                <Bell className="w-6 h-6" />
                                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>
                            <div className="flex items-center space-x-3">
                                <img src={user?.profilePhoto || `https://ui-avatars.com/api/?name=${user?.name}&background=random`} alt="User" className="w-10 h-10 rounded-full border-2 border-blue-200" />
                                <div className="hidden md:block">
                                    <p className="font-semibold text-gray-800">{user?.name}</p>
                                    <p className="text-sm text-gray-500">{user?.mobile}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto flex flex-col">
                    {renderContent()}
                </main>
            </div>

            <Modal isOpen={sosModalOpen} onClose={closeSosModal} title="Send Emergency SOS">
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
                        <textarea 
                            value={sosMessage}
                            onChange={(e) => setSosMessage(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" 
                            rows={3} 
                            placeholder="Describe your emergency situation...">
                        </textarea>
                    </div>
                    {sosModalError && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                            <p className="font-bold">Audio Recording Error</p>
                            <p>{sosModalError}</p>
                        </div>
                    )}
                    <div className="flex space-x-4">
                        <label className="flex-1 cursor-pointer bg-blue-50 text-blue-700 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center justify-center">
                            <Camera className="w-4 h-4 mr-2" />
                            <span>{sosMedia && sosMedia.type.startsWith('image/') ? 'Photo Added' : 'Add Photo'}</span>
                            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                        </label>
                        <button 
                            onClick={handleAudioRecord}
                            className={`flex-1 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                            {isRecording ? (
                                <>
                                    <motion.span
                                        animate={{ opacity: [1, 0.5, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="w-3 h-3 bg-white rounded-full mr-2"
                                    />
                                    <span>Recording...</span>
                                </>
                            ) : (
                                <>
                                    <Mic className="w-4 h-4 mr-2" />
                                    <span>{(sosMedia && sosMedia.type.startsWith('audio/')) ? 'Audio Recorded' : 'Record Audio'}</span>
                                </>
                            )}
                        </button>
                    </div>
                    {sosMedia && <p className="text-sm text-gray-600 text-center">Attached: {sosMedia.name}</p>}
                    <div className="flex space-x-4 pt-4">
                        <button onClick={closeSosModal} className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors">Cancel</button>
                        <button onClick={submitSOS} className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">Send SOS</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default UserDashboard;
