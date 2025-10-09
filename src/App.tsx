import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import UserDashboard from './components/dashboard/UserDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import RescueDashboard from './components/dashboard/RescueDashboard';
import NgoDashboard from './components/ngo/NgoDashboard';
import SplashScreen from './components/common/SplashScreen';
import { FloodZone, SOSRequest, Resource, Alert, NewsReport, User as UserType, NgoData, Task, ResourceRequest, SdmReport } from './types';
import { 
    floodZones as initialFloodZones, 
    sosRequests as initialSosRequests, 
    resources as initialResources, 
    alerts as initialAlerts, 
    newsReports as initialNewsReports,
    adminUsers as initialAdminUsers,
    rescueUsers as initialRescueUsers,
    generalUsers as initialGeneralUsers,
    ngoData as initialNgoData,
    tasks as initialTasks,
    resourceRequests as initialResourceRequests,
    sdmReports as initialSdmReports,
    mockCitizens
} from './data/mockData';
import './i18n'; // Import i18n configuration

const AppRoutes: React.FC = () => {
  const { user, isAuthenticated, login } = useAuth();
  
  // Lifted State
  const [floodZones, setFloodZones] = useState<FloodZone[]>(initialFloodZones);
  const [sosRequests, setSosRequests] = useState<SOSRequest[]>(initialSosRequests);
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [newsReports, setNewsReports] = useState<NewsReport[]>(initialNewsReports);
  const [adminUsers, setAdminUsers] = useState<UserType[]>(initialAdminUsers);
  const [rescueUsers, setRescueUsers] = useState<UserType[]>(initialRescueUsers);
  const [generalUsers, setGeneralUsers] = useState<UserType[]>([...initialGeneralUsers, ...mockCitizens]);
  const [ngoData, setNgoData] = useState<NgoData[]>(initialNgoData);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [resourceRequests, setResourceRequests] = useState<ResourceRequest[]>(initialResourceRequests);
  const [sdmReports, setSdmReports] = useState<SdmReport[]>(initialSdmReports);

  const sharedProps = {
    floodZones,
    sosRequests,
    alerts,
    newsReports,
  };

  const adminDashboardProps = {
    ...sharedProps,
    setFloodZones,
    setSosRequests,
    resources, setResources,
    setAlerts,
    setNewsReports,
    adminUsers, setAdminUsers,
    rescueUsers, setRescueUsers,
    ngoData, setNgoData,
    tasks, setTasks,
    resourceRequests, setResourceRequests,
    sdmReports, setSdmReports,
    generalUsers,
  };

  const rescueDashboardProps = {
    floodZones,
    sosRequests,
    setSosRequests,
  };
  
  const ngoDashboardProps = {
    citizens: generalUsers,
    setCitizens: setGeneralUsers,
  };

  if (!isAuthenticated) {
    return <Login 
      setGeneralUsers={setGeneralUsers} 
      adminUsers={adminUsers}
      rescueUsers={rescueUsers}
      ngoData={ngoData}
      generalUsers={generalUsers}
      login={login}
    />;
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          user?.role === 'user' ? <UserDashboard {...sharedProps} setSosRequests={setSosRequests} /> :
          user?.role === 'admin' ? <AdminDashboard {...adminDashboardProps} /> :
          user?.role === 'rescue' ? <RescueDashboard {...rescueDashboardProps} /> :
          user?.role === 'ngo' ? <NgoDashboard {...ngoDashboardProps} /> :
          <Navigate to="/login" />
        } 
      />
      <Route path="/login" element={<Navigate to="/" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // Show splash screen for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      {loading ? <SplashScreen /> : (
        <Router>
          <div className="App">
            <AppRoutes />
          </div>
        </Router>
      )}
    </AuthProvider>
  );
}

export default App;
