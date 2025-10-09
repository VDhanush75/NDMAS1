export interface User {
  id: string;
  mobile: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'rescue' | 'ngo';
  adminLevel?: 'NDMA' | 'SDMA' | 'DDMA';
  rescueLevel?: 'team-leader' | 'field-officer' | 'resource-manager';
  ngoLevel?: 'admin' | 'volunteer';
  ngoId?: string;
  serviceId?: string; // Added for admin/rescue login
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
  createdAt?: Date;
  status?: 'active' | 'inactive';
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
  userName?: string;
  location: [number, number];
  timestamp: Date;
  status: 'pending' | 'assigned' | 'in-progress' | 'completed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  media?: string[];
  assignedRescueTeam?: string;
  assignedSdm?: string; // Assigned to SDMA by NDMA
  assignedDdm?: string; // Assigned to DDMA by SDMA
  assignedNgo?: string; // Assigned to NGO by SDMA/DDMA
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
  assignedSdm?: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical' | 'high';
  targetAreas: string[];
  targetRoles?: ('SDMA' | 'DDMA' | 'Rescue' | 'NGO' | 'user')[];
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
  targetRoles?: ('SDMA' | 'DDMA' | 'Rescue' | 'NGO')[];
  targetAreas?: string[];
}

export interface NgoVolunteer {
  id: string;
  name: string;
  volunteerId: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  assignedZone: string;
}

export interface ReliefGood {
  id: string;
  name: string;
  category: 'Food' | 'Medical' | 'Shelter' | 'Equipment' | 'Other';
  quantity: number;
  lastUpdated: Date;
}

export interface Assignment {
    id: string;
    title: string;
    area: string;
    description: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'Pending' | 'Assigned' | 'In Progress' | 'Completed';
    assignedVolunteers: string[]; // Array of volunteer IDs
}

export interface VolunteerReport {
  id: string;
  assignmentId: string;
  volunteerId: string;
  volunteerName: string;
  reportText: string;
  timestamp: Date;
  statusUpdate?: Assignment['status'];
}

export interface NgoData {
    id: string;
    name: string;
    registrationId: string;
    state: string;
    status: 'Approved' | 'Pending' | 'Rejected';
    assignedDistrict?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: 'DDMA' | 'Rescue' | 'NGO';
  assignedToId: string; // ID of the specific DDMA, Rescue Team, or NGO
  status: 'Pending' | 'In Progress' | 'Completed';
  createdBy: 'NDMA' | 'SDMA' | 'DDMA';
  creatorId: string;
  createdAt: Date;
}

export interface ResourceRequest {
  id: string;
  resourceType: Resource['type'];
  quantity: number;
  justification: string;
  requestedBy: 'SDMA' | 'DDMA';
  requesterId: string;
  requesterName: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  timestamp: Date;
}

export interface SdmReport {
  id: string;
  title: string;
  content: string;
  category: 'Work Update' | 'Resource Request' | 'General Info';
  submittedBy: string; // SDMA user ID
  submittedByName: string;
  timestamp: Date;
}

export interface WeatherData {
    temp: number;
    feels_like: number;
    humidity: number;
    description: string;
    icon: string;
    wind_speed: number;
    sunrise: number;
    sunset: number;
    name: string;
    country: string;
}
