import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { AlertTriangle } from 'lucide-react';
import { floodZones as defaultFloodZones, sosRequests as defaultSosRequests } from '../../data/mockData';
import { FloodZone, SOSRequest } from '../../types';

interface FloodMapProps {
  showSOS?: boolean;
  zones?: FloodZone[];
  sosRequests?: SOSRequest[];
}

const FloodMap: React.FC<FloodMapProps> = ({ 
  showSOS = false, 
  zones = defaultFloodZones, 
  sosRequests: sosProp = defaultSosRequests 
}) => {
  const indiaCenter: [number, number] = [22.5937, 82.9629];

  const getRiskPathOptions = (level: string) => {
    let color = '';
    switch (level) {
      case 'green': color = '#10B981'; break;
      case 'yellow': color = '#F59E0B'; break;
      case 'orange': color = '#F97316'; break;
      case 'red': color = '#EF4444'; break;
      default: color = '#6B7280'; break;
    }
    return { color: color, fillColor: color, fillOpacity: 0.6 };
  };

  const getSeverityPathOptions = (severity: string) => {
    let color = '';
    switch (severity) {
        case 'low': color = '#10B981'; break;
        case 'medium': color = '#F59E0B'; break;
        case 'high': color = '#F97316'; break;
        case 'critical': color = '#EF4444'; break;
        default: color = '#6B7280'; break;
    }
    return { color: 'white', fillColor: color, fillOpacity: 1, weight: 2 };
  };

  const getZoneRadius = (type: string) => {
    switch(type) {
        case 'state': return 20;
        case 'district': return 12;
        default: return 8;
    }
  }

  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden">
      <MapContainer center={indiaCenter} zoom={5} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Flood Zones */}
        {zones.map((zone) => (
          <CircleMarker
            key={zone.id}
            center={zone.coordinates}
            pathOptions={getRiskPathOptions(zone.riskLevel)}
            radius={getZoneRadius(zone.type)}
          >
            <Popup>
              <div className="font-sans">
                <h4 className="font-bold text-base text-gray-800">{zone.name}</h4>
                <p className="text-sm text-gray-600 capitalize">{zone.type}</p>
                <p className="text-sm text-gray-600">Population: {zone.population.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Status: {zone.currentStatus}</p>
                <div className="flex items-center mt-2">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: getRiskPathOptions(zone.riskLevel).color }}
                  ></div>
                  <span className="text-sm font-medium capitalize">{zone.riskLevel} Risk</span>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* SOS Requests */}
        {showSOS && sosProp.map((sos) => (
           <CircleMarker
            key={sos.id}
            center={sos.location}
            pathOptions={getSeverityPathOptions(sos.severity)}
            radius={10}
          >
            <Popup>
              <div className="font-sans">
                <div className="flex items-center mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                    <h4 className="font-bold text-base text-gray-800">SOS Request</h4>
                </div>
                <p className="text-sm text-gray-600">ID: {sos.id}</p>
                <p className="text-sm text-gray-600">Status: <span className="font-semibold">{sos.status}</span></p>
                <p className="text-sm text-gray-600">Severity: <span className="font-semibold">{sos.severity}</span></p>
                <p className="text-sm text-gray-600 mt-1">{sos.description}</p>
              </div>
            </Popup>
           </CircleMarker>
        ))}
      </MapContainer>
      
      {/* Legend Overlay */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-80 p-3 rounded-lg shadow-lg z-[1000]">
        <h3 className="font-semibold text-gray-800 mb-2">Risk Levels</h3>
        <div className="space-y-1 text-sm">
          <div className="flex items-center"><div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: '#EF4444'}}></div><span>Critical Risk</span></div>
          <div className="flex items-center"><div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: '#F97316'}}></div><span>High Risk</span></div>
          <div className="flex items-center"><div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: '#F59E0B'}}></div><span>Medium Risk</span></div>
          <div className="flex items-center"><div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: '#10B981'}}></div><span>Low Risk</span></div>
        </div>
      </div>
    </div>
  );
};

export default FloodMap;
