import { Plus, FileText } from 'lucide-react';

export default function QuickActions() {
  return (
    <section className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
      <div className="flex flex-col space-y-3">
        <button className="flex items-center px-4 py-2 bg-orange-700 text-white rounded-lg hover:bg-orange-800 font-sans">
          <Plus className="w-5 h-5 mr-2" />
          Add New Lead
        </button>
        <button className="flex items-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-orange-50 font-sans text-orange-700">
          <FileText className="w-5 h-5 mr-2" />
          View Policies
        </button>
      </div>
    </section>
  );
} 