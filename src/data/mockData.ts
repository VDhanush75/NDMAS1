import { FloodZone, SOSRequest, Resource, Alert, NewsReport, NgoVolunteer, ReliefGood, Assignment, VolunteerReport, User, NgoData, Task, ResourceRequest, SdmReport, SafeShelter } from '../types';

export const historicalData = [
  { year: 2015, rainfall: 1200, riverLevel: 5.2, affectedPopulation: 1.2 },
  { year: 2016, rainfall: 1350, riverLevel: 5.8, affectedPopulation: 1.5 },
  { year: 2017, rainfall: 1500, riverLevel: 6.5, affectedPopulation: 2.1 },
  { year: 2018, rainfall: 1800, riverLevel: 7.8, affectedPopulation: 3.5 }, // Major flood year
  { year: 2019, rainfall: 1400, riverLevel: 6.1, affectedPopulation: 1.8 },
  { year: 2020, rainfall: 1650, riverLevel: 7.2, affectedPopulation: 2.9 },
  { year: 2021, rainfall: 1700, riverLevel: 7.5, affectedPopulation: 3.1 },
  { year: 2022, rainfall: 1300, riverLevel: 5.9, affectedPopulation: 1.6 },
  { year: 2023, rainfall: 1950, riverLevel: 8.5, affectedPopulation: 4.2 }, // Another major flood year
  { year: 2024, rainfall: 1550, riverLevel: 6.8, affectedPopulation: 2.5 },
];

export const yearlyImpactData = [
  { year: 2015, critical: 15, high: 30, moderate: 50, low: 200, populationImpact: 5.5 },
  { year: 2016, critical: 20, high: 35, moderate: 60, low: 180, populationImpact: 6.2 },
  { year: 2017, critical: 25, high: 45, moderate: 70, low: 160, populationImpact: 8.1 },
  { year: 2018, critical: 40, high: 60, moderate: 80, low: 120, populationImpact: 15.3 },
  { year: 2019, critical: 22, high: 40, moderate: 65, low: 170, populationImpact: 7.4 },
  { year: 2020, critical: 30, high: 55, moderate: 75, low: 140, populationImpact: 11.2 },
  { year: 2021, critical: 35, high: 58, moderate: 78, low: 130, populationImpact: 12.9 },
  { year: 2022, critical: 18, high: 32, moderate: 55, low: 190, populationImpact: 6.8 },
  { year: 2023, critical: 55, high: 70, moderate: 90, low: 100, populationImpact: 18.5 },
  { year: 2024, critical: 28, high: 50, moderate: 72, low: 150, populationImpact: 9.7 },
];

export const stateWiseImpactData = [
    { year: 2015, Assam: 2.1, Bihar: 3.5, 'West Bengal': 4.2, Kerala: 1.8 },
    { year: 2016, Assam: 2.5, Bihar: 3.8, 'West Bengal': 4.5, Kerala: 2.1 },
    { year: 2017, Assam: 3.2, Bihar: 4.1, 'West Bengal': 5.0, Kerala: 2.5 },
    { year: 2018, Assam: 5.8, Bihar: 6.2, 'West Bengal': 7.1, Kerala: 4.9 },
    { year: 2019, Assam: 3.5, Bihar: 4.5, 'West Bengal': 5.5, Kerala: 2.8 },
    { year: 2020, Assam: 4.8, Bihar: 5.9, 'West Bengal': 6.8, Kerala: 4.2 },
    { year: 2021, Assam: 5.1, Bihar: 6.0, 'West Bengal': 7.0, Kerala: 4.5 },
    { year: 2022, Assam: 2.9, Bihar: 4.0, 'West Bengal': 4.8, Kerala: 2.2 },
    { year: 2023, Assam: 7.2, Bihar: 8.5, 'West Bengal': 9.1, Kerala: 6.5 },
    { year: 2024, Assam: 4.5, Bihar: 5.5, 'West Bengal': 6.2, Kerala: 3.9 },
];

export const regionalRiskData = [
  { name: 'Eastern India', value: 45, color: '#EF4444' }, // WB, Bihar, Assam
  { name: 'Southern India', value: 25, color: '#F97316' }, // Kerala, TN
  { name: 'Western India', value: 15, color: '#F59E0B' }, // Gujarat, Maharashtra
  { name: 'Northern India', value: 10, color: '#10B981' }, // UP, Uttarakhand
  { name: 'Central India', value: 5, color: '#6B7280' },
];

export const floodZones: FloodZone[] = [
  // Major States
  { id: 'WB', name: 'West Bengal', type: 'state', riskLevel: 'red', coordinates: [22.9868, 87.8550], population: 91347736, currentStatus: 'Severe flooding in coastal areas' },
  { id: 'AS', name: 'Assam', type: 'state', riskLevel: 'orange', coordinates: [26.2006, 92.9376], population: 31169272, currentStatus: 'Brahmaputra water level rising' },
  { id: 'BI', name: 'Bihar', type: 'state', riskLevel: 'orange', coordinates: [25.0961, 85.3131], population: 103804637, currentStatus: 'Monitoring river levels' },
  { id: 'UP', name: 'Uttar Pradesh', type: 'state', riskLevel: 'yellow', coordinates: [26.8467, 80.9462], population: 199812341, currentStatus: 'Normal conditions' },
  { id: 'KE', name: 'Kerala', type: 'state', riskLevel: 'orange', coordinates: [10.8505, 76.2711], population: 33387677, currentStatus: 'Heavy monsoon expected' },
  
  // Districts in West Bengal
  { id: 'WB-KOL', name: 'Kolkata', type: 'district', parent: 'WB', riskLevel: 'red', coordinates: [22.5726, 88.3639], population: 4496694, currentStatus: 'Waterlogging in low areas' },
  { id: 'WB-HOW', name: 'Howrah', type: 'district', parent: 'WB', riskLevel: 'orange', coordinates: [22.5958, 88.2636], population: 4850029, currentStatus: 'River embankments under stress' },
  { id: 'WB-24PG', name: '24 Parganas North', type: 'district', parent: 'WB', riskLevel: 'red', coordinates: [22.6157, 88.4317], population: 10009781, currentStatus: 'Tidal surge affecting coastal villages' },
  
  // Villages and Urban areas
  { id: 'WB-KOL-V1', name: 'Sonarpur', type: 'urban', parent: 'WB-KOL', riskLevel: 'orange', coordinates: [22.4497, 88.4004], population: 235066, currentStatus: 'Drainage issues reported' },
  { id: 'WB-KOL-V2', name: 'Barrackpore', type: 'urban', parent: 'WB-24PG', riskLevel: 'red', coordinates: [22.7606, 88.3782], population: 144567, currentStatus: 'Evacuation in progress' },
  { id: 'AS-GUW-V1', name: 'Guwahati', type: 'urban', parent: 'AS', riskLevel: 'orange', coordinates: [26.1445, 91.7362], population: 957352, currentStatus: 'Traffic disruptions due to water' },
];

export const sosRequests: SOSRequest[] = [
  {
    id: 'SOS001',
    userId: 'user123',
    userName: 'Ravi Kumar',
    location: [22.5726, 88.3639],
    timestamp: new Date('2025-01-15T10:30:00'),
    status: 'completed',
    severity: 'critical',
    description: 'Family trapped on rooftop, water level rising rapidly',
    media: ['audio_001.mp3', 'photo_001.jpg'],
    state: 'West Bengal',
    district: 'Kolkata'
  },
  {
    id: 'SOS002',
    userId: 'user456',
    userName: 'Priya Sharma',
    location: [22.4497, 88.4004],
    timestamp: new Date('2025-01-15T11:15:00'),
    status: 'assigned',
    severity: 'high',
    description: 'Elderly person needs medical evacuation',
    assignedRescueTeam: 'TEAM_001',
    assignedSdm: 'WB-SDMA-1',
    state: 'West Bengal',
    district: 'Kolkata'
  },
  {
    id: 'SOS003',
    userId: 'user789',
    userName: 'Amit Singh',
    location: [22.7606, 88.3782],
    timestamp: new Date('2025-01-15T09:45:00'),
    status: 'in-progress',
    severity: 'medium',
    description: 'Group of 8 people stranded in community hall',
    assignedRescueTeam: 'TEAM_002',
    assignedSdm: 'WB-SDMA-1',
    state: 'West Bengal',
    district: '24 Parganas North'
  },
  {
    id: 'SOS004',
    userId: 'userAS1',
    userName: 'Bipul Das',
    location: [26.1445, 91.7362],
    timestamp: new Date('2025-01-16T14:00:00'),
    status: 'pending',
    severity: 'high',
    description: 'Requesting assistance, water entering house.',
    state: 'Assam',
    district: 'Kamrup Metropolitan'
  }
];

export const resources: Resource[] = [
  { id: 'R001', type: 'boat', quantity: 50, available: 32, location: 'Kolkata Base', status: 'available', assignedSdm: 'WB-SDMA-1' },
  { id: 'R002', type: 'jacket', quantity: 200, available: 156, location: 'Howrah Station', status: 'available', assignedSdm: 'WB-SDMA-1' },
  { id: 'R003', type: 'ambulance', quantity: 15, available: 8, location: 'Medical College', status: 'available', assignedSdm: 'WB-SDMA-1' },
  { id: 'R004', type: 'medicine', quantity: 1000, available: 742, location: 'Central Pharmacy', status: 'available' },
  { id: 'R005', type: 'food', quantity: 5000, available: 3200, location: 'Relief Center 1', status: 'available' },
  { id: 'R006', type: 'shelter', quantity: 20, available: 12, location: 'Guwahati Hub', status: 'available', assignedSdm: 'AS-SDMA-1' }
];

export const alerts: Alert[] = [
  {
    id: 'A001',
    title: 'Critical Flood Warning: Brahmaputra River',
    message: 'Brahmaputra river has crossed the danger level in Assam. Widespread flooding expected in Dibrugarh, Jorhat, and Majuli districts. Evacuate immediately.',
    severity: 'critical',
    targetAreas: ['Assam'],
    targetRoles: ['SDMA', 'DDMA', 'Rescue', 'NGO', 'user'],
    language: 'english',
    timestamp: new Date('2025-01-20T08:00:00')
  },
  {
    id: 'A003',
    title: 'High Alert: Damodar Valley Corporation',
    message: 'DVC has released excess water from Panchet and Maithon dams. Low-lying areas in West Bengal\'s Purba and Paschim Bardhaman districts are at high risk.',
    severity: 'high',
    targetAreas: ['West Bengal'],
    targetRoles: ['SDMA', 'DDMA', 'Rescue', 'NGO', 'user'],
    language: 'english',
    timestamp: new Date('2025-01-20T06:30:00')
  },
  {
    id: 'A004',
    title: 'Weather Warning: Heavy Monsoon Rains',
    message: 'India Meteorological Department (IMD) predicts extremely heavy rainfall over coastal Kerala for the next 48 hours. Fishermen are advised not to venture into the sea.',
    severity: 'warning',
    targetAreas: ['Kerala'],
    targetRoles: ['user'],
    language: 'english',
    timestamp: new Date('2025-01-19T18:00:00')
  },
  {
    id: 'A005',
    title: 'Info: Relief Camp Setup',
    message: 'A new relief camp has been established at the National College grounds in Kolkata to accommodate displaced families.',
    severity: 'info',
    targetAreas: ['Kolkata'],
    targetRoles: ['user', 'NGO'],
    language: 'english',
    timestamp: new Date('2025-01-19T15:00:00')
  },
  {
    id: 'A002',
    title: 'गंभीर बाढ़ चेतावनी',
    message: 'तटीय क्षेत्रों में गंभीर बाढ़ की संभावना। निचले इलाकों से तत्काल निकासी की सलाह दी जाती है।',
    severity: 'critical',
    targetAreas: ['West Bengal'],
    targetRoles: ['user'],
    language: 'hindi',
    timestamp: new Date('2025-01-15T08:00:00')
  }
];

export const newsReports: NewsReport[] = [
  {
    id: 'NEWS001',
    title: 'Government Deploys NDRF Teams to Assam',
    content: 'In response to the escalating flood situation in Assam, the central government has deployed 12 additional NDRF teams to assist in rescue and relief operations. The teams are equipped with inflatable boats, diving equipment, and communication gear.',
    category: 'Response',
    imageUrl: 'https://images.unsplash.com/photo-1574635203332-55535350024a?q=80&w=2070&auto=format&fit=crop',
    timestamp: new Date('2025-01-21T10:00:00'),
    targetRoles: ['SDMA', 'Rescue'],
    targetAreas: ['Assam']
  },
  {
    id: 'NEWS002',
    title: 'Understanding Flood Patterns: A 10-Year Analysis',
    content: 'A new report analyzing the last decade of flood data reveals a significant increase in flash flood events in urban areas. The report highlights the need for improved urban drainage systems and early warning technologies.',
    category: 'Data Analysis',
    imageUrl: 'https://images.unsplash.com/photo-1567628270133-a642a4a7e96e?q=80&w=2070&auto=format&fit=crop',
    timestamp: new Date('2025-01-20T14:30:00'),
    targetRoles: ['SDMA', 'DDMA'],
    targetAreas: ['All India']
  },
  {
    id: 'NEWS003',
    title: 'Community-led Relief Efforts Praised in Kerala',
    content: 'Local communities and NGOs in Kerala have been at the forefront of relief efforts, setting up community kitchens and temporary shelters. Their proactive approach has been instrumental in providing immediate aid to affected families.',
    category: 'Community',
    imageUrl: 'https://images.unsplash.com/photo-1599059818626-25b045937bff?q=80&w=2070&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder video
    timestamp: new Date('2025-01-19T09:00:00'),
    targetRoles: ['NGO'],
    targetAreas: ['Kerala']
  }
];

export const weatherData = [
  { date: '15 Jan', rainfall: 85, waterLevel: 4.2, temperature: 26 },
  { date: '16 Jan', rainfall: 120, waterLevel: 5.8, temperature: 25 },
  { date: '17 Jan', rainfall: 95, waterLevel: 6.2, temperature: 24 },
  { date: '18 Jan', rainfall: 140, waterLevel: 7.1, temperature: 23 },
  { date: '19 Jan', rainfall: 110, waterLevel: 6.8, temperature: 25 },
  { date: '20 Jan', rainfall: 75, waterLevel: 5.9, temperature: 27 },
  { date: '21 Jan', rainfall: 60, waterLevel: 4.8, temperature: 28 }
];


export const ngoVolunteers: NgoVolunteer[] = [
    { id: 'VOL001', name: 'Anjali Sharma', volunteerId: 'V101', email: 'anjali@ngo.com', phone: '9876543210', status: 'active', assignedZone: 'Kolkata Sector A' },
    { id: 'VOL002', name: 'Rajesh Kumar', volunteerId: 'V102', email: 'rajesh@ngo.com', phone: '9876543211', status: 'active', assignedZone: 'Howrah Sector B' },
    { id: 'VOL003', name: 'Priya Singh', volunteerId: 'V103', email: 'priya@ngo.com', phone: '9876543212', status: 'inactive', assignedZone: 'N/A' },
    { id: 'VOL004', name: 'Amit Verma', volunteerId: 'V104', email: 'amit@ngo.com', phone: '9876543213', status: 'active', assignedZone: 'Kolkata Sector C' },
];

export const reliefGoods: ReliefGood[] = [
    { id: 'GOOD01', name: 'Food Kit', category: 'Food', quantity: 500, lastUpdated: new Date() },
    { id: 'GOOD02', name: 'Medicine Pack', category: 'Medical', quantity: 1000, lastUpdated: new Date() },
    { id: 'GOOD03', name: 'Life Jacket', category: 'Equipment', quantity: 250, lastUpdated: new Date() },
    { id: 'GOOD04', name: 'Blanket', category: 'Shelter', quantity: 800, lastUpdated: new Date() },
];

export const assignments: Assignment[] = [
    { id: 'ASGN001', title: 'Distribute Food Kits', area: 'Kolkata Sector A', description: 'Distribute 100 food kits to stranded families in the Sonarpur area.', priority: 'High', status: 'Assigned', assignedVolunteers: ['VOL001'] },
    { id: 'ASGN002', title: 'Medical Camp Setup', area: 'Howrah Sector B', description: 'Set up a temporary medical camp near the Howrah station relief center.', priority: 'High', status: 'Assigned', assignedVolunteers: ['VOL002'] },
    { id: 'ASGN003', title: 'Verify Relief Seekers', area: 'Kolkata Sector C', description: 'Verify and register new families arriving at the Salt Lake relief camp.', priority: 'Medium', status: 'Pending', assignedVolunteers: [] },
    { id: 'ASGN004', title: 'Transport Supplies', area: 'Central Warehouse', description: 'Transport 50 boxes of medical supplies from the warehouse to Howrah Sector B.', priority: 'Medium', status: 'Pending', assignedVolunteers: [] },
];

export const volunteerReports: VolunteerReport[] = [
    {
        id: 'VR001',
        assignmentId: 'ASGN001',
        volunteerId: 'VOL001',
        volunteerName: 'Anjali Sharma',
        reportText: 'Started distribution in Sonarpur. Heavy waterlogging, but we are managing.',
        timestamp: new Date(Date.now() - 3600 * 1000), // 1 hour ago
        statusUpdate: 'In Progress'
    }
];

// Mock citizen data for QR scanning
export const mockCitizens: User[] = [
    {
        id: 'user_citizen_1',
        name: 'Rohan Mehra',
        mobile: '1122334455',
        email: 'rohan@email.com',
        role: 'user',
        state: 'West Bengal',
        district: 'Kolkata',
        area: 'Behala',
        aidStatus: 'Not Received',
        qrCodeDataUrl: '{"id":"user_citizen_1","name":"Rohan Mehra","location":"Behala, Kolkata, West Bengal","aidStatus":"Not Received"}',
        language: 'english',
        permissions: { location: true, sms: true, notifications: true },
    },
    {
        id: 'user_citizen_2',
        name: 'Sunita Devi',
        mobile: '2233445566',
        email: 'sunita@email.com',
        role: 'user',
        state: 'West Bengal',
        district: 'Howrah',
        area: 'Shibpur',
        aidStatus: 'Received',
        qrCodeDataUrl: '{"id":"user_citizen_2","name":"Sunita Devi","location":"Shibpur, Howrah, West Bengal","aidStatus":"Received"}',
        language: 'hindi',
        permissions: { location: true, sms: true, notifications: true },
    },
    {
        id: 'user_citizen_3',
        name: 'Alok Nath',
        mobile: '3344556677',
        email: 'alok@email.com',
        role: 'user',
        state: 'West Bengal',
        district: 'Kolkata',
        area: 'Sonarpur',
        aidStatus: 'Not Received',
        qrCodeDataUrl: '{"id":"user_citizen_3","name":"Alok Nath","location":"Sonarpur, Kolkata, West Bengal","aidStatus":"Not Received"}',
        language: 'english',
        permissions: { location: true, sms: true, notifications: true },
    }
];

export const generalUsers: User[] = Array.from({ length: 150 }, (_, i) => ({
    id: `gen_user_${i}`,
    name: `User ${i}`,
    mobile: `9999999${i.toString().padStart(3, '0')}`,
    email: `user${i}@example.com`,
    role: 'user',
    state: ['West Bengal', 'Assam', 'Bihar', 'Kerala'][i % 4],
    district: ['Kolkata', 'Howrah', 'Kamrup', 'Patna'][i % 4],
    status: (i % 5 === 0) ? 'inactive' : 'active',
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // within last 30 days
    language: 'english',
    permissions: { location: true, sms: true, notifications: true },
    password: 'password123'
}));

export const adminUsers: User[] = [
    { id: 'NDMA-Admin-1', serviceId: 'NDMA1', password: 'password123', name: 'Central Admin (NDMA)', email: 'ndma@gov.in', role: 'admin', adminLevel: 'NDMA', mobile: '111', language: 'english', permissions: { location: true, sms: true, notifications: true } },
    { id: 'WB-SDMA-1', serviceId: 'SDMA1', password: 'password123', name: 'West Bengal SDMA', email: 'sdma-wb@gov.in', role: 'admin', adminLevel: 'SDMA', state: 'West Bengal', mobile: '222', language: 'english', permissions: { location: true, sms: true, notifications: true } },
    { id: 'AS-SDMA-1', serviceId: 'SDMA2', password: 'password123', name: 'Assam SDMA', email: 'sdma-as@gov.in', role: 'admin', adminLevel: 'SDMA', state: 'Assam', mobile: '333', language: 'english', permissions: { location: true, sms: true, notifications: true } },
    { id: 'KOL-DDMA-1', serviceId: 'DDMA1', password: 'password123', name: 'Kolkata DDMA', email: 'ddma-kol@gov.in', role: 'admin', adminLevel: 'DDMA', state: 'West Bengal', district: 'Kolkata', mobile: '444', language: 'english', permissions: { location: true, sms: true, notifications: true } },
    { id: 'HOW-DDMA-1', serviceId: 'DDMA2', password: 'password123', name: 'Howrah DDMA', email: 'ddma-how@gov.in', role: 'admin', adminLevel: 'DDMA', state: 'West Bengal', district: 'Howrah', mobile: '445', language: 'english', permissions: { location: true, sms: true, notifications: true } },
];

export const rescueUsers: User[] = [
    { id: 'rescue-team-1', serviceId: 'RT001', password: 'password123', name: 'Alpha Rescue Team', email: 'alpha@rescue.gov.in', role: 'rescue', rescueLevel: 'team-leader', state: 'West Bengal', district: 'Kolkata', mobile: '555', language: 'english', permissions: { location: true, sms: true, notifications: true } },
    { id: 'rescue-team-2', serviceId: 'RT002', password: 'password123', name: 'Bravo Rescue Team', email: 'bravo@rescue.gov.in', role: 'rescue', rescueLevel: 'team-leader', state: 'Assam', district: 'Kamrup Metropolitan', mobile: '666', language: 'english', permissions: { location: true, sms: true, notifications: true } },
    { id: 'rescue-team-3', serviceId: 'RT003', password: 'password123', name: 'Charlie Rescue Team', email: 'charlie@rescue.gov.in', role: 'rescue', rescueLevel: 'team-leader', state: 'West Bengal', district: 'Howrah', mobile: '777', language: 'english', permissions: { location: true, sms: true, notifications: true } },
    { id: 'rescue-fo-1', serviceId: 'RT-FO-001', password: 'password123', name: 'Field Officer Mike', email: 'mike@rescue.gov.in', role: 'rescue', rescueLevel: 'field-officer', state: 'West Bengal', district: 'Kolkata', mobile: '888', language: 'english', permissions: { location: true, sms: true, notifications: true } },
    { id: 'rescue-rm-1', serviceId: 'RT-RM-001', password: 'password123', name: 'Resource Manager Sara', email: 'sara@rescue.gov.in', role: 'rescue', rescueLevel: 'resource-manager', state: 'West Bengal', district: 'Kolkata', mobile: '999', language: 'english', permissions: { location: true, sms: true, notifications: true } },
];

export const ngoData: NgoData[] = [
    { id: 'NGO01', name: 'Relief Foundation', registrationId: 'NGO123', state: 'West Bengal', status: 'Approved', assignedDistrict: 'Kolkata' },
    { id: 'NGO02', name: 'Hope Givers', registrationId: 'NGO456', state: 'Assam', status: 'Approved', assignedDistrict: 'Kamrup Metropolitan' },
    { id: 'NGO03', name: 'Sahayata', registrationId: 'NGO789', state: 'Bihar', status: 'Pending' },
    { id: 'NGO04', name: 'Care India', registrationId: 'NGO101', state: 'West Bengal', status: 'Approved', assignedDistrict: 'Howrah' },
];

export const tasks: Task[] = [
    {
        id: 'task-1',
        title: 'Setup Relief Camp in Salt Lake',
        description: 'Establish a new relief camp at Central Park, Salt Lake, to accommodate 500 people.',
        assignedTo: 'DDMA',
        assignedToId: 'KOL-DDMA-1',
        status: 'In Progress',
        createdBy: 'SDMA',
        creatorId: 'WB-SDMA-1',
        createdAt: new Date('2025-01-20T10:00:00Z'),
    },
    {
        id: 'task-2',
        title: 'Deploy Boats to Howrah',
        description: 'Move 5 inflatable boats from Kolkata Base to Howrah for immediate deployment.',
        assignedTo: 'Rescue',
        assignedToId: 'rescue-team-3',
        status: 'Pending',
        createdBy: 'SDMA',
        creatorId: 'WB-SDMA-1',
        createdAt: new Date('2025-01-21T11:00:00Z'),
    },
    {
        id: 'task-3',
        title: 'Coordinate Food Distribution',
        description: 'Work with local volunteers to distribute 1000 food packets in Behala.',
        assignedTo: 'NGO',
        assignedToId: 'NGO01',
        status: 'Completed',
        createdBy: 'DDMA',
        creatorId: 'KOL-DDMA-1',
        createdAt: new Date('2025-01-19T14:00:00Z'),
    }
];

export const resourceRequests: ResourceRequest[] = [
    {
        id: 'req-1',
        resourceType: 'shelter',
        quantity: 10,
        justification: 'Existing shelters are at full capacity in North 24 Parganas.',
        requestedBy: 'SDMA',
        requesterId: 'WB-SDMA-1',
        requesterName: 'West Bengal SDMA',
        status: 'Pending',
        timestamp: new Date('2025-01-21T09:00:00Z'),
    },
    {
        id: 'req-2',
        resourceType: 'medicine',
        quantity: 500,
        justification: 'High demand for basic medical supplies at Howrah relief camp.',
        requestedBy: 'DDMA',
        requesterId: 'HOW-DDMA-1',
        requesterName: 'Howrah DDMA',
        status: 'Approved',
        timestamp: new Date('2025-01-20T16:00:00Z'),
    }
];

export const sdmReports: SdmReport[] = [
    {
      id: 'SDR001',
      title: 'Weekly Progress Report - West Bengal',
      content: 'Task assignments to DDMA and NGOs are on schedule. Facing a shortage of rescue boats in the Sundarbans region.',
      category: 'Work Update',
      submittedBy: 'WB-SDMA-1',
      submittedByName: 'West Bengal SDMA',
      timestamp: new Date(Date.now() - 24 * 3600 * 1000)
    },
    {
        id: 'SDR002',
        title: 'Urgent: Resource Request for Assam',
        content: 'Heavy rainfall has caused unexpected flooding in lower Assam. We urgently require 5000 additional food kits and 20 temporary shelters.',
        category: 'Resource Request',
        submittedBy: 'AS-SDMA-1',
        submittedByName: 'Assam SDMA',
        timestamp: new Date(Date.now() - 2 * 3600 * 1000)
    }
];

export const safeShelters: SafeShelter[] = [
    { id: 'SH001', name: 'National College', district: 'Kolkata', state: 'West Bengal', capacity: 500, location: [22.5730, 88.3642] },
    { id: 'SH002', name: 'Howrah Indoor Stadium', district: 'Howrah', state: 'West Bengal', capacity: 1000, location: [22.5950, 88.2640] },
    { id: 'SH003', name: 'Guwahati University Campus', district: 'Kamrup Metropolitan', state: 'Assam', capacity: 2000, location: [26.1510, 91.7000] },
];
