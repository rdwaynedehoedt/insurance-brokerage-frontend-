'use client';

import { useState } from 'react';
import { Search, Edit2, Trash2, Plus } from 'lucide-react';
import ClientModal from './ClientModal';

interface Client {
  id?: number;
  name: string;
  contact: {
    phone: string;
    email: string;
  };
  nic: string;
  address: string;
  notes: string;
  salespersonId: string;
}

// Mock data - replace with actual data from your backend
const mockClients: Client[] = [
  {
    id: 1,
    name: 'John Smith',
    contact: {
      phone: '+94 77 123 4567',
      email: 'john.smith@email.com'
    },
    nic: '123456789V',
    address: '123 Main St, Colombo 03',
    notes: 'Interested in life insurance',
    salespersonId: 'SP001'
  },
  {
    id: 2,
    name: 'Jane Doe',
    contact: {
      phone: '+94 76 987 6543',
      email: 'jane.doe@email.com'
    },
    nic: '987654321V',
    address: '456 Park Ave, Kandy',
    notes: 'Follow up next week',
    salespersonId: 'SP001'
  }
];

export default function ClientsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>(mockClients);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contact.phone.includes(searchTerm)
  );

  const handleAddClient = (newClient: Client) => {
    setClients([...clients, { ...newClient, id: clients.length + 1 }]);
  };

  const handleEditClient = (updatedClient: Client) => {
    setClients(clients.map(client => 
      client.id === updatedClient.id ? updatedClient : client
    ));
  };

  const handleDeleteClient = (clientId: number) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      setClients(clients.filter(client => client.id !== clientId));
    }
  };

  return (
    <section className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">My Clients</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-orange-700 text-white rounded-lg hover:bg-orange-800"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Client
          </button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIC/Passport</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{client.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{client.contact.phone}</div>
                  <div className="text-sm text-gray-500">{client.contact.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{client.nic}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{client.address}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{client.notes}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedClient(client);
                      setShowEditModal(true);
                    }}
                    className="text-orange-600 hover:text-orange-900 mr-4"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => client.id && handleDeleteClient(client.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ClientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddClient}
        mode="add"
      />

      <ClientModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedClient(null);
        }}
        onSubmit={handleEditClient}
        client={selectedClient || undefined}
        mode="edit"
      />
    </section>
  );
} 