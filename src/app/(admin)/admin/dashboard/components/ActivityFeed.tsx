'use client';

import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  details: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {activities.map((activity, index) => (
          <motion.div 
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="p-4 hover:bg-gray-50"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
                <p className="text-sm text-gray-500 mt-1">{activity.details}</p>
                <p className="text-xs font-medium text-orange-600 mt-2">By {activity.user}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {activities.length > 0 && (
        <div className="p-4 border-t border-gray-100">
          <a href="#" className="text-xs text-orange-600 hover:text-orange-800 font-medium">
            View all activities
          </a>
        </div>
      )}
      {activities.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-sm text-gray-500">No recent activities</p>
        </div>
      )}
    </div>
  );
} 