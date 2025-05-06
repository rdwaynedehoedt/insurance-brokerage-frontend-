'use client';

import { Users, FileText, DollarSign, UserPlus } from 'lucide-react';

export default function StatsCards() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center shadow-sm">
        <div className="p-3 bg-orange-50 rounded-lg mr-4">
          <Users className="w-6 h-6 text-orange-700" />
        </div>
        <div>
          <span className="text-sm text-gray-600">Total Clients</span>
          <div className="text-2xl font-bold text-gray-900">42</div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center shadow-sm">
        <div className="p-3 bg-orange-50 rounded-lg mr-4">
          <FileText className="w-6 h-6 text-orange-700" />
        </div>
        <div>
          <span className="text-sm text-gray-600">Total Policies</span>
          <div className="text-2xl font-bold text-gray-900">24</div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center shadow-sm">
        <div className="p-3 bg-orange-50 rounded-lg mr-4">
          <UserPlus className="w-6 h-6 text-orange-700" />
        </div>
        <div>
          <span className="text-sm text-gray-600">Pending Leads</span>
          <div className="text-2xl font-bold text-gray-900">8</div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center shadow-sm">
        <div className="p-3 bg-orange-50 rounded-lg mr-4">
          <DollarSign className="w-6 h-6 text-orange-700" />
        </div>
        <div>
          <span className="text-sm text-gray-600">Commissions</span>
          <div className="text-2xl font-bold text-gray-900">$1,250</div>
        </div>
      </div>
    </section>
  );
} 