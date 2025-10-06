import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { FloodZone, SOSRequest } from '../../types';

interface AdminHandDrawnMapProps {
  zones: FloodZone[];
  sosRequests: SOSRequest[];
}

// Bounding box for India
const INDIA_BOUNDS = {
  lat: { min: 8, max: 37 },
  lon: { min: 68, max: 98 },
};

const convertCoordsToPercent = (lat: number, lon: number) => {
  const mapValue = (value: number, fromLow: number, fromHigh: number, toLow: number, toHigh: number) => {
    return toLow + (toHigh - toLow) * (value - fromLow) / (fromHigh - fromLow);
  };

  let left = mapValue(lon, INDIA_BOUNDS.lon.min, INDIA_BOUNDS.lon.max, 0, 100);
  let top = mapValue(lat, INDIA_BOUNDS.lat.max, INDIA_BOUNDS.lat.min, 0, 100); // Latitude is inverted for CSS top

  // Clamp values to be within the map
  left = Math.max(0, Math.min(100, left));
  top = Math.max(0, Math.min(100, top));

  return { top: `${top}%`, left: `${left}%` };
};

const getRiskColor = (level: string) => {
    switch (level) {
      case 'red': return 'bg-red-500';
      case 'orange': return 'bg-orange-500';
      case 'yellow': return 'bg-yellow-500';
      case 'green': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
};

const getSeverityColor = (severity: string) => {
    switch (severity) {
        case 'critical': return 'bg-red-600';
        case 'high': return 'bg-orange-500';
        case 'medium': return 'bg-yellow-400';
        default: return 'bg-green-500';
    }
};

const Marker: React.FC<{ position: { top: string, left: string }, children: React.ReactNode, tooltipContent: React.ReactNode }> = ({ position, children, tooltipContent }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    return (
        <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ top: position.top, left: position.left }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            {children}
            {showTooltip && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white text-gray-800 text-xs rounded-lg shadow-lg p-2 z-20"
                >
                    {tooltipContent}
                </motion.div>
            )}
        </div>
    );
};


const AdminHandDrawnMap: React.FC<AdminHandDrawnMapProps> = ({ zones, sosRequests }) => {
  return (
    <div className="relative w-full h-full bg-blue-100 rounded-lg overflow-hidden">
      <img
        src="https://i.ibb.co/L8WJc7B/india-map-hand-drawn.png"
        alt="Hand-drawn map of India"
        className="absolute inset-0 w-full h-full object-contain"
      />
      
      {/* Render Flood Zones */}
      {zones.map(zone => {
        const position = convertCoordsToPercent(zone.coordinates[0], zone.coordinates[1]);
        return (
            <Marker key={`zone-${zone.id}`} position={position} tooltipContent={
                <>
                    <p className="font-bold">{zone.name}</p>
                    <p>Risk: <span className="capitalize font-semibold">{zone.riskLevel}</span></p>
                    <p>Status: {zone.currentStatus}</p>
                </>
            }>
                <div className={`w-3 h-3 rounded-full ${getRiskColor(zone.riskLevel)} border-2 border-white shadow-md`}></div>
            </Marker>
        );
      })}

      {/* Render SOS Requests */}
      {sosRequests.map(sos => {
          const position = convertCoordsToPercent(sos.location[0], sos.location[1]);
          return (
              <Marker key={`sos-${sos.id}`} position={position} tooltipContent={
                <>
                    <p className="font-bold">SOS: {sos.id}</p>
                    <p>Severity: <span className="capitalize font-semibold">{sos.severity}</span></p>
                    <p>Status: <span className="capitalize">{sos.status}</span></p>
                    <p className="mt-1 italic">"{sos.description}"</p>
                </>
              }>
                <div className={`w-4 h-4 rounded-full ${getSeverityColor(sos.severity)} flex items-center justify-center animate-pulse`}>
                    <AlertTriangle className="w-2.5 h-2.5 text-white" />
                </div>
              </Marker>
          );
      })}
    </div>
  );
};

export default AdminHandDrawnMap;
