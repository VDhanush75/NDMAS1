export interface User {
  id: string;
  mobile: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'rescue';
  adminLevel?: 'central' | 'state' | 'district';
  rescueLevel?: 'team-leader' | 'field-officer' | 'resource-manager';
  state?: string;
  district?: string;
  area?: string;
  profilePhoto?: string;
  language: 'english' | 'hindi' | 'telugu' | 'kannada' | 'tamil';
  permissions: {
    location: boolean;
    sms: boolean;
    notifications: boolean;
  };
  qrCodeDataUrl?: string;
  aidStatus?: 'Received' | 'Not Received';
}

export interface FloodZone {
  id: string;
  name: string;
  type: 'state' | 'district' | 'village' | 'urban' | 'rural';
  parent?: string;
  riskLevel: 'green' | 'yellow' | 'orange' | 'red';
  coordinates: [number, number];
  population: number;
  currentStatus: string;
}

export interface SOSRequest {
  id: string;
  userId: string;
  location: [number, number];
  timestamp: Date;
  status: 'pending' | 'assigned' | 'in-progress' | 'completed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  media?: string[];
  assignedRescueTeam?: string;
  state?: string;
  district?: string;
}

export interface Resource {
  id: string;
  type: 'boat' | 'jacket' | 'ambulance' | 'medicine' | 'food' | 'shelter';
  quantity: number;
  available: number;
  location: string;
  status: 'available' | 'deployed' | 'maintenance';
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical' | 'high';
  targetAreas: string[];
  language: string;
  timestamp: Date;
}

export interface NewsReport {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl: string;
  videoUrl?: string;
  timestamp: Date;
}
