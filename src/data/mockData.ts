import { FloodZone, SOSRequest, Resource, Alert, NewsReport } from '../types';

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
  { state: 'Assam', critical: 28, high: 45, moderate: 60 },
  { state: 'Bihar', critical: 35, high: 42, moderate: 55 },
  { state: 'West Bengal', critical: 42, high: 38, moderate: 50 },
  { state: 'Kerala', critical: 25, high: 30, moderate: 40 },
  { state: 'Uttar Pradesh', critical: 18, high: 25, moderate: 35 },
  { state: 'Gujarat', critical: 15, high: 20, moderate: 30 },
  { state: 'Maharashtra', critical: 12, high: 18, moderate: 28 },
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
    location: [22.5726, 88.3639],
    timestamp: new Date('2025-01-15T10:30:00'),
    status: 'completed',
    severity: 'critical',
    description: 'Family trapped on rooftop, water level rising rapidly',
    media: ['audio_001.mp3', 'photo_001.jpg'],
    state: 'WB',
    district: 'WB-KOL'
  },
  {
    id: 'SOS002',
    userId: 'user456',
    location: [22.4497, 88.4004],
    timestamp: new Date('2025-01-15T11:15:00'),
    status: 'assigned',
    severity: 'high',
    description: 'Elderly person needs medical evacuation',
    assignedRescueTeam: 'TEAM_001',
    state: 'WB',
    district: 'WB-KOL'
  },
  {
    id: 'SOS003',
    userId: 'user789',
    location: [22.7606, 88.3782],
    timestamp: new Date('2025-01-15T09:45:00'),
    status: 'in-progress',
    severity: 'medium',
    description: 'Group of 8 people stranded in community hall',
    assignedRescueTeam: 'TEAM_002',
    state: 'WB',
    district: 'WB-24PG'
  },
  {
    id: 'SOS004',
    userId: 'userAS1',
    location: [26.1445, 91.7362],
    timestamp: new Date('2025-01-16T14:00:00'),
    status: 'pending',
    severity: 'high',
    description: 'Requesting assistance, water entering house.',
    state: 'AS',
    district: 'AS-GUW'
  }
];

export const resources: Resource[] = [
  { id: 'R001', type: 'boat', quantity: 50, available: 32, location: 'Kolkata Base', status: 'available' },
  { id: 'R002', type: 'jacket', quantity: 200, available: 156, location: 'Howrah Station', status: 'available' },
  { id: 'R003', type: 'ambulance', quantity: 15, available: 8, location: 'Medical College', status: 'available' },
  { id: 'R004', type: 'medicine', quantity: 1000, available: 742, location: 'Central Pharmacy', status: 'available' },
  { id: 'R005', type: 'food', quantity: 5000, available: 3200, location: 'Relief Center 1', status: 'available' },
  { id: 'R006', type: 'shelter', quantity: 20, available: 12, location: 'School Complex', status: 'available' }
];

export const alerts: Alert[] = [
  {
    id: 'A001',
    title: 'Critical Flood Warning: Brahmaputra River',
    message: 'Brahmaputra river has crossed the danger level in Assam. Widespread flooding expected in Dibrugarh, Jorhat, and Majuli districts. Evacuate immediately.',
    severity: 'critical',
    targetAreas: ['AS'],
    language: 'english',
    timestamp: new Date('2025-01-20T08:00:00')
  },
  {
    id: 'A003',
    title: 'High Alert: Damodar Valley Corporation',
    message: 'DVC has released excess water from Panchet and Maithon dams. Low-lying areas in West Bengal\'s Purba and Paschim Bardhaman districts are at high risk.',
    severity: 'high',
    targetAreas: ['WB'],
    language: 'english',
    timestamp: new Date('2025-01-20T06:30:00')
  },
  {
    id: 'A004',
    title: 'Weather Warning: Heavy Monsoon Rains',
    message: 'India Meteorological Department (IMD) predicts extremely heavy rainfall over coastal Kerala for the next 48 hours. Fishermen are advised not to venture into the sea.',
    severity: 'warning',
    targetAreas: ['KE'],
    language: 'english',
    timestamp: new Date('2025-01-19T18:00:00')
  },
  {
    id: 'A005',
    title: 'Info: Relief Camp Setup',
    message: 'A new relief camp has been established at the National College grounds in Kolkata to accommodate displaced families.',
    severity: 'info',
    targetAreas: ['WB-KOL'],
    language: 'english',
    timestamp: new Date('2025-01-19T15:00:00')
  },
  {
    id: 'A002',
    title: 'गंभीर बाढ़ चेतावनी',
    message: 'तटीय क्षेत्रों में गंभीर बाढ़ की संभावना। निचले इलाकों से तत्काल निकासी की सलाह दी जाती है।',
    severity: 'critical',
    targetAreas: ['WB-24PG'],
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
    imageUrl: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x400/3B82F6/FFFFFF/png?text=NDRF+Deployment',
    timestamp: new Date('2025-01-21T10:00:00')
  },
  {
    id: 'NEWS002',
    title: 'Understanding Flood Patterns: A 10-Year Analysis',
    content: 'A new report analyzing the last decade of flood data reveals a significant increase in flash flood events in urban areas. The report highlights the need for improved urban drainage systems and early warning technologies.',
    category: 'Data Analysis',
    imageUrl: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x400/10B981/FFFFFF/png?text=Data+Analysis',
    timestamp: new Date('2025-01-20T14:30:00')
  },
  {
    id: 'NEWS003',
    title: 'Community-led Relief Efforts Praised in Kerala',
    content: 'Local communities and NGOs in Kerala have been at the forefront of relief efforts, setting up community kitchens and temporary shelters. Their proactive approach has been instrumental in providing immediate aid to affected families.',
    category: 'Community',
    imageUrl: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x400/F97316/FFFFFF/png?text=Community+Efforts',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder video
    timestamp: new Date('2025-01-19T09:00:00')
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
