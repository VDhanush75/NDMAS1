import React from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Phone, UserCheck, Truck, CheckCircle, Navigation, Clock, ArrowLeft } from 'lucide-react';
import { SOSRequest, User } from '../../types';
import { rescueUsers } from '../../data/mockData';

interface SOSStatusTrackerProps {
  sosRequest: SOSRequest;
  onExit: () => void;
}

const statusSteps = [
  { id: 'pending', label: 'Request Sent', icon: Phone },
  { id: 'assigned', label: 'Team Assigned', icon: UserCheck },
  { id: 'in-progress', label: 'Rescue In-Progress', icon: Truck },
  { id: 'completed', label: 'Rescue Completed', icon: CheckCircle },
];

const SOSStatusTracker: React.FC<SOSStatusTrackerProps> = ({ sosRequest, onExit }) => {
  const currentStepIndex = statusSteps.findIndex(step => step.id === sosRequest.status);
  const rescueTeam = rescueUsers.find(u => u.id === sosRequest.assignedRescueTeam);

  // Mock rescue team location
  const rescueTeamLocation: [number, number] = rescueTeam ? [sosRequest.location[0] + 0.05, sosRequest.location[1] + 0.05] : sosRequest.location;

  const handleNavigate = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${sosRequest.location[0]},${sosRequest.location[1]}`, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-2xl p-8 relative"
    >
      <button onClick={onExit} className="absolute top-6 right-6 text-gray-500 hover:text-gray-800 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10">
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-red-600">SOS Request Active</h2>
        <p className="text-gray-600">Your request for help has been received. Help is on the way.</p>
      </div>

      <div className="mb-10">
        <div className="flex justify-between">
          {statusSteps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center relative flex-1">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${index <= currentStepIndex ? 'bg-blue-600 border-blue-700 text-white' : 'bg-gray-200 border-gray-300 text-gray-500'}`}>
                <step.icon className="w-6 h-6" />
              </div>
              <p className={`mt-2 text-xs md:text-sm font-semibold text-center ${index <= currentStepIndex ? 'text-blue-700' : 'text-gray-500'}`}>{step.label}</p>
              {index < statusSteps.length - 1 && (
                <div className="absolute top-6 left-1/2 w-full h-1 bg-gray-200">
                  <motion.div 
                    className="h-1 bg-blue-600"
                    initial={{ width: '0%' }}
                    animate={{ width: index < currentStepIndex ? '100%' : '0%' }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-6 rounded-xl border">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Request Details</h3>
          <div className="space-y-3 text-gray-700">
            <p><strong className="font-semibold">Description:</strong> {sosRequest.description}</p>
            <p><strong className="font-semibold">Time:</strong> {new Date(sosRequest.timestamp).toLocaleString()}</p>
            {rescueTeam && (
              <div className="bg-blue-100 p-4 rounded-lg">
                <p className="font-bold text-blue-800">Assigned Team:</p>
                <p className="text-blue-700">{rescueTeam.name}</p>
                <p className="text-sm text-blue-600">Contact: {rescueTeam.mobile}</p>
              </div>
            )}
            {!rescueTeam && sosRequest.status === 'pending' && (
                <div className="bg-yellow-100 p-4 rounded-lg text-yellow-800 flex items-center">
                    <Clock className="w-5 h-5 mr-2"/>
                    <p>Waiting for a rescue team to be assigned...</p>
                </div>
            )}
          </div>
        </div>

        <div className="rounded-xl overflow-hidden h-80 border shadow-md">
          <MapContainer center={sosRequest.location} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={sosRequest.location}>
              <Popup>Your Location</Popup>
            </Marker>
            {rescueTeam && sosRequest.status === 'in-progress' && (
              <>
                <Marker position={rescueTeamLocation}>
                  <Popup>Rescue Team</Popup>
                </Marker>
                <Polyline positions={[sosRequest.location, rescueTeamLocation]} color="blue" dashArray="5, 10" />
              </>
            )}
          </MapContainer>
        </div>
      </div>

       <div className="mt-8 text-center">
        <button onClick={handleNavigate} className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center mx-auto">
            <Navigation className="w-5 h-5 mr-2" />
            Show Route on Google Maps
        </button>
       </div>
    </motion.div>
  );
};

export default SOSStatusTracker;
