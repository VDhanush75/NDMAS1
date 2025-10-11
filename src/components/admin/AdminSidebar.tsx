import React from 'react';
import { motion } from 'framer-motion';
import { Shield, LogOut, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarItem {
    id: string;
    label: string;
    icon: React.ElementType;
}

interface AdminSidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
    sidebarItems: SidebarItem[];
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const sidebarVariants = {
    collapsed: { width: '5rem' },
    expanded: { width: '16rem' },
};

const iconVariants = {
    collapsed: { rotate: 180 },
    expanded: { rotate: 0 },
};

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed, setIsCollapsed, sidebarItems, activeTab, setActiveTab }) => {
    const { user, logout } = useAuth();

    return (
        <motion.aside
            variants={sidebarVariants}
            initial={false}
            animate={isCollapsed ? 'collapsed' : 'expanded'}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="bg-white shadow-lg flex flex-col h-full"
        >
            <div className={`flex items-center justify-between h-16 border-b ${isCollapsed ? 'px-6' : 'px-4'}`}>
                {!isCollapsed && (
                    <div className="flex items-center">
                        <div className="bg-red-100 p-2 rounded-lg mr-3"><Shield className="w-6 h-6 text-red-600" /></div>
                        <h1 className="text-lg font-bold text-gray-800 whitespace-nowrap">{user?.adminLevel}</h1>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <nav className="px-2 py-4 space-y-2">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            title={isCollapsed ? item.label : undefined}
                            className={`w-full flex items-center p-3 text-left rounded-lg transition-colors ${isCollapsed ? 'justify-center' : ''} ${activeTab === item.id ? 'bg-red-100 text-red-700' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <item.icon className="w-5 h-5" />
                            {!isCollapsed && <span className="ml-3 font-medium whitespace-nowrap">{item.label}</span>}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="px-2 py-4 border-t">
                <div className={`flex items-center mb-4 p-2 ${isCollapsed ? 'justify-center' : ''}`}>
                    <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`} alt="user" className="w-10 h-10 rounded-full" />
                    {!isCollapsed && (
                        <div className="ml-3">
                            <p className="font-semibold text-sm text-gray-800 whitespace-nowrap">{user?.name}</p>
                            <p className="text-xs text-gray-500 whitespace-nowrap">{user?.state || 'National'}</p>
                        </div>
                    )}
                </div>
                 <button
                    onClick={logout}
                    title={isCollapsed ? 'Logout' : undefined}
                    className={`w-full flex items-center p-3 text-left rounded-lg transition-colors text-gray-600 hover:bg-red-50 hover:text-red-600 ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <LogOut className="w-5 h-5" />
                    {!isCollapsed && <span className="ml-3 font-medium whitespace-nowrap">Logout</span>}
                </button>
            </div>
             <button onClick={() => setIsCollapsed(!isCollapsed)} className="absolute -right-3 top-16 bg-white border rounded-full p-1.5 shadow-md text-gray-600 hover:bg-gray-100">
                <motion.div variants={iconVariants} animate={isCollapsed ? 'collapsed' : 'expanded'}>
                    <ChevronLeft className="w-4 h-4" />
                </motion.div>
            </button>
        </motion.aside>
    );
};

export default AdminSidebar;
