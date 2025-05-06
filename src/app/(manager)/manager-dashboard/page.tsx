'use client';

import { useState } from 'react';
import { Users, FileText, Home, BarChart2, LogOut, Search, Filter, Plus } from 'lucide-react';
import ClientModal from './components/ClientModal';

interface SalesRep {
  id: string;
  name: string;
  clients: number;
  policies: number;
  performance: number;
}

interface Client {
  id: string;
  name: string;
  contact: string;
  nic: string;
  address: string;
  notes: string;
  salesRep: string;
  policies: number;
}

// Mock data - replace with actual data from your backend
const mockSalesReps: SalesRep[] = [
  { id: 'SP001', name: 'John Smith', clients: 42, policies: 24, performance: 85 },
  { id: 'SP002', name: 'Jane Doe', clients: 38, policies: 20, performance: 78 },
  { id: 'SP003', name: 'Mike Johnson', clients: 45, policies: 28, performance: 92 },
];

// Mock clients data
const mockClients: Client[] = [
  {
    id: 'C001',
    name: 'Alice Johnson',
    contact: '+94 77 123 4567',
    nic: '901234567V',
    address: '123 Main St, Colombo',
    notes: 'Interested in life insurance',
    salesRep: 'SP001',
    policies: 2
  },
  {
    id: 'C002',
    name: 'Bob Wilson',
    contact: '+94 76 234 5678',
    nic: '902345678V',
    address: '456 Lake Rd, Kandy',
    notes: 'Vehicle insurance renewal pending',
    salesRep: 'SP002',
    policies: 1
  },
  // Add more mock clients as needed
];

export default function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRep, setSelectedRep] = useState<string>('all');
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'clients', label: 'All Clients', icon: Users },
    { id: 'performance', label: 'Performance', icon: BarChart2 },
    { id: 'policies', label: 'Policies', icon: FileText },
  ];

  const handleAddClient = () => {
    setSelectedClient(null);
    setIsClientModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsClientModalOpen(true);
  };

  const filteredClients = mockClients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.nic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact.includes(searchTerm);
    
    const matchesRep = selectedRep === 'all' || client.salesRep === selectedRep;
    
    return matchesSearch && matchesRep;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-orange-700">Manager Portal</h1>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-6 py-3 text-sm font-medium ${
                  activeTab === item.id
                    ? 'bg-orange-50 text-orange-700 border-r-4 border-orange-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-gray-200">
          <button className="flex items-center text-gray-600 hover:text-gray-900">
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {menuItems.find(item => item.id === activeTab)?.label}
              </h2>
              <p className="text-gray-600 mt-1">Welcome back, Manager!</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-block px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium">
                Manager
              </span>
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-700" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-orange-50 rounded-lg mr-4">
                      <Users className="w-6 h-6 text-orange-700" />
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Total Clients</span>
                      <div className="text-2xl font-bold text-gray-900">125</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-orange-50 rounded-lg mr-4">
                      <FileText className="w-6 h-6 text-orange-700" />
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Total Policies</span>
                      <div className="text-2xl font-bold text-gray-900">72</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-orange-50 rounded-lg mr-4">
                      <Users className="w-6 h-6 text-orange-700" />
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Sales Reps</span>
                      <div className="text-2xl font-bold text-gray-900">3</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-orange-50 rounded-lg mr-4">
                      <BarChart2 className="w-6 h-6 text-orange-700" />
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Avg. Performance</span>
                      <div className="text-2xl font-bold text-gray-900">85%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sales Rep Performance */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Sales Rep Performance</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Rep</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clients</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policies</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockSalesReps.map((rep) => (
                        <tr key={rep.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{rep.name}</div>
                            <div className="text-sm text-gray-500">{rep.id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{rep.clients}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{rep.policies}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                <div
                                  className="bg-orange-700 h-2.5 rounded-full"
                                  style={{ width: `${rep.performance}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-900">{rep.performance}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'clients' && (
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <h3 className="text-lg font-bold text-gray-800">All Clients</h3>
                  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <select
                      value={selectedRep}
                      onChange={(e) => setSelectedRep(e.target.value)}
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="all">All Sales Reps</option>
                      {mockSalesReps.map((rep) => (
                        <option key={rep.id} value={rep.id}>
                          {rep.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAddClient}
                      className="inline-flex items-center px-4 py-2 bg-orange-700 text-white rounded-lg hover:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Client
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIC/Passport</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Rep</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policies</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredClients.map((client) => (
                      <tr key={client.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{client.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{client.contact}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{client.nic}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {mockSalesReps.find(rep => rep.id === client.salesRep)?.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{client.policies}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => handleEditClient(client)}
                            className="text-orange-700 hover:text-orange-900 mr-4"
                          >
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Performance Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Clients per Sales Rep</h4>
                  {/* Add chart component here */}
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Policies Sold per Rep</h4>
                  {/* Add chart component here */}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'policies' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Policy Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Life Insurance</h4>
                  <p className="text-sm text-gray-600">24 active policies</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Health Insurance</h4>
                  <p className="text-sm text-gray-600">18 active policies</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Vehicle Insurance</h4>
                  <p className="text-sm text-gray-600">30 active policies</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Client Modal */}
      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        client={selectedClient}
        salesReps={mockSalesReps}
      />
    </div>
  );
} 