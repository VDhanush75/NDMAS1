import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { AlertTriangle, Edit, Trash2 } from 'lucide-react';
import { FloodZone, SOSRequest } from '../../types';
import Modal from '../common/Modal';
import { useForm } from 'react-hook-form';

interface FloodMapProps {
  showSOS?: boolean;
  zones: FloodZone[];
  sosRequests?: SOSRequest[];
  onMapClick?: (latlng: { lat: number, lng: number }) => void;
  canEdit?: boolean;
  onAddZone?: (zone: Omit<FloodZone, 'id'>) => void;
  onUpdateZone?: (zone: FloodZone) => void;
  onDeleteZone?: (zoneId: string) => void;
  jurisdiction?: 'state' | 'district' | 'local';
  mapRef?: React.RefObject<any>; // For external control
}

const MapEventsHandler: React.FC<{ onClick: (latlng: { lat: number, lng: number }) => void }> = ({ onClick }) => {
    useMapEvents({
        click(e) {
            onClick(e.latlng);
        },
    });
    return null;
};

const MapResizer: React.FC = () => {
    const map = useMap();
    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 400); // Delay to ensure container has resized
        return () => clearTimeout(timer);
    }, [map]);
    return null;
};

const FloodMap: React.FC<FloodMapProps> = ({ 
  showSOS = false, 
  zones, 
  sosRequests = [],
  onMapClick,
  canEdit = false,
  onAddZone,
  onUpdateZone,
  onDeleteZone,
  jurisdiction = 'state',
  mapRef
}) => {
  const indiaCenter: [number, number] = [22.5937, 82.9629];
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<FloodZone | null>(null);
  const [newZoneCoords, setNewZoneCoords] = useState<[number, number] | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<Omit<FloodZone, 'id'>>();

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

  const handleMapClick = (latlng: { lat: number, lng: number }) => {
    if (onMapClick) onMapClick(latlng);
    if (canEdit && onAddZone) {
      setNewZoneCoords([latlng.lat, latlng.lng]);
      setEditingZone(null);
      reset({ name: '', riskLevel: 'yellow', coordinates: [latlng.lat, latlng.lng], type: jurisdiction === 'state' ? 'state' : jurisdiction === 'district' ? 'district' : 'local' });
      setModalOpen(true);
    }
  };

  const handleEditClick = (zone: FloodZone) => {
    setEditingZone(zone);
    setNewZoneCoords(null);
    setValue('name', zone.name);
    setValue('riskLevel', zone.riskLevel);
    setValue('coordinates', zone.coordinates);
    setValue('type', zone.type);
    setValue('population', zone.population);
    setValue('currentStatus', zone.currentStatus);
    setModalOpen(true);
  };

  const handleDeleteClick = (zoneId: string) => {
    if (onDeleteZone && window.confirm('Are you sure you want to delete this zone?')) {
      onDeleteZone(zoneId);
    }
  };

  const onFormSubmit = (data: Omit<FloodZone, 'id'>) => {
    if (editingZone && onUpdateZone) {
      onUpdateZone({ ...data, id: editingZone.id });
    } else if (onAddZone) {
      onAddZone(data);
    }
    setModalOpen(false);
    reset();
  };

  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden">
      <MapContainer center={indiaCenter} zoom={5} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }} whenCreated={mapInstance => { if (mapRef) mapRef.current = mapInstance; }}>
        <MapResizer />
        <MapEventsHandler onClick={handleMapClick} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

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
                <p className="text-sm text-gray-600">Status: {zone.currentStatus}</p>
                {canEdit && (
                    <div className="flex space-x-2 mt-2">
                        <button onClick={() => handleEditClick(zone)} className="text-blue-600"><Edit size={16} /></button>
                        <button onClick={() => handleDeleteClick(zone.id)} className="text-red-600"><Trash2 size={16} /></button>
                    </div>
                )}
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {showSOS && sosRequests.map((sos) => (
           <CircleMarker key={sos.id} center={sos.location} pathOptions={getSeverityPathOptions(sos.severity)} radius={10}>
            <Popup>
              <div className="font-sans">
                <div className="flex items-center mb-2"><AlertTriangle className="w-5 h-5 text-red-600 mr-2" /><h4 className="font-bold text-base text-gray-800">SOS Request</h4></div>
                <p className="text-sm text-gray-600">Status: <span className="font-semibold">{sos.status}</span></p>
                <p className="text-sm text-gray-600 mt-1">{sos.description}</p>
              </div>
            </Popup>
           </CircleMarker>
        ))}
      </MapContainer>
      
      <div className="absolute top-4 left-4 bg-white bg-opacity-80 p-3 rounded-lg shadow-lg z-[1000]">
        <h3 className="font-semibold text-gray-800 mb-2">Risk Levels</h3>
        <div className="space-y-1 text-sm">
          <div className="flex items-center"><div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: '#EF4444'}}></div><span>Critical</span></div>
          <div className="flex items-center"><div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: '#F97316'}}></div><span>High</span></div>
          <div className="flex items-center"><div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: '#F59E0B'}}></div><span>Medium</span></div>
          <div className="flex items-center"><div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: '#10B981'}}></div><span>Low</span></div>
        </div>
      </div>

      {canEdit && (
        <div className="absolute bottom-4 right-4 z-[1000]">
            <p className="text-xs bg-black/50 text-white p-2 rounded-md mb-2">Click on map to add a new zone</p>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={editingZone ? 'Edit Danger Zone' : 'Create New Danger Zone'}>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <p className="text-sm text-gray-600">Coordinates: {newZoneCoords ? `${newZoneCoords[0].toFixed(4)}, ${newZoneCoords[1].toFixed(4)}` : 'N/A'}</p>
            <input type="text" {...register('name')} placeholder="Zone Name" className="w-full p-2 border rounded" required />
            <select {...register('riskLevel')} className="w-full p-2 border rounded bg-white">
                <option value="yellow">Yellow (Warning)</option>
                <option value="orange">Orange (High)</option>
                <option value="red">Red (Critical)</option>
            </select>
            <input type="text" {...register('currentStatus')} placeholder="Current Status" className="w-full p-2 border rounded" />
            <input type="number" {...register('population')} placeholder="Affected Population" className="w-full p-2 border rounded" />
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">{editingZone ? 'Update Zone' : 'Create Zone'}</button>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default FloodMap;
