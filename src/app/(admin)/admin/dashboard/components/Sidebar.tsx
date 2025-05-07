'use client';

import { motion } from 'framer-motion';
import { Home, Users, FileText, BarChart, Settings, LogOut } from 'lucide-react';

export type TabType = 'dashboard' | 'users' | 'policies' | 'reports' | 'settings';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onLogout: () => void;
  isOpen: boolean;
}

export default function Sidebar({ activeTab, setActiveTab, onLogout, isOpen }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: Home },
    { id: 'users' as TabType, label: 'Users', icon: Users },
    { id: 'policies' as TabType, label: 'Policies', icon: FileText },
    { id: 'reports' as TabType, label: 'Reports', icon: BarChart },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 bg-white shadow-sm border-r border-gray-200 transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-300 ease-in-out w-64 pt-16 z-5`}>
      <div className="flex flex-col h-full overflow-y-auto scrollbar-thin">
        <nav className="mt-6 px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.button 
                key={item.id}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center px-4 py-3 rounded-lg w-full transition duration-200 ${
                  activeTab === item.id 
                    ? 'bg-orange-50 text-orange-700 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
              </motion.button>
            );
          })}
        </nav>
        
        <div className="mt-auto p-4 border-t border-gray-200">
          <button 
            onClick={onLogout}
            className="flex items-center justify-center w-full px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
          >
            <LogOut className="w-5 h-5 mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
} 