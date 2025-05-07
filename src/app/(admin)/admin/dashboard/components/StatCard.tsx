'use client';

import { motion } from 'framer-motion';
import { ElementType } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: ElementType;
  color: string;
  delay?: number;
}

export default function StatCard({ title, value, change, icon: Icon, color, delay = 0 }: StatCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color} text-white`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
        </div>
      </div>
    </motion.div>
  );
} 