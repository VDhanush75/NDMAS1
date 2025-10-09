import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  description?: string;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, description, colorClass }) => {
  return (
    <motion.div 
      whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
      className="bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-6"
    >
      <div className={`p-4 rounded-full ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-4xl font-bold text-gray-900">{value}</p>
        {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
      </div>
    </motion.div>
  );
};

export default StatCard;
