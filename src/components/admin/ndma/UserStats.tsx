import React from 'react';
import { User, SOSRequest, Resource } from '../../../types';
import { Users, UserCheck, UserX, BarChart2, LifeBuoy, Package } from 'lucide-react';
import { isToday } from 'date-fns';

interface UserStatsProps {
    users: User[];
    sosRequests: SOSRequest[];
    resources: Resource[];
}

const StatCard: React.FC<{ icon: React.ReactNode, title: string, value: string | number, color: string }> = ({ icon, title, value, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md flex items-center space-x-4">
        <div className={`p-4 rounded-xl ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500">{title}</p>
        </div>
    </div>
);

const UserStats: React.FC<UserStatsProps> = ({ users, sosRequests, resources }) => {
    const totalUsers = users.length;
    const newUsersToday = users.filter(u => u.createdAt && isToday(u.createdAt)).length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const inactiveUsers = totalUsers - activeUsers;
    
    const totalRescued = sosRequests.filter(s => s.status === 'completed').length;
    const resourcesUsed = resources.reduce((acc, r) => acc + (r.quantity - r.available), 0);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">NDMA National Overview</h2>
                <p className="text-gray-600">Real-time statistics from across the country.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                <StatCard icon={<Users className="w-7 h-7 text-blue-600" />} title="Total Citizen Users" value={totalUsers.toLocaleString()} color="bg-blue-100" />
                <StatCard icon={<UserCheck className="w-7 h-7 text-green-600" />} title="Active Users" value={activeUsers.toLocaleString()} color="bg-green-100" />
                <StatCard icon={<UserX className="w-7 h-7 text-orange-600" />} title="Inactive Users" value={inactiveUsers.toLocaleString()} color="bg-orange-100" />
                <StatCard icon={<BarChart2 className="w-7 h-7 text-indigo-600" />} title="New Users Today" value={newUsersToday.toLocaleString()} color="bg-indigo-100" />
                <StatCard icon={<LifeBuoy className="w-7 h-7 text-cyan-600" />} title="Total Rescued" value={totalRescued.toLocaleString()} color="bg-cyan-100" />
                <StatCard icon={<Package className="w-7 h-7 text-pink-600" />} title="Resources Deployed" value={resourcesUsed.toLocaleString()} color="bg-pink-100" />
            </div>
        </div>
    );
};

export default UserStats;
