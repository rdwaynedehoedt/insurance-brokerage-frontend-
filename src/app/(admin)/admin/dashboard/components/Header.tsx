'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, Shield } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed w-full z-10">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Left side: Logo & Menu Button */}
        <div className="flex items-center">
          <button 
            onClick={onMenuClick}
            className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-2 ml-2">
            <Shield className="h-8 w-8 text-orange-600" />
            <span className="text-xl font-bold text-gray-800">Admin Panel</span>
          </div>
        </div>
      </div>
    </header>
  );
} 