'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Users, Home, LogOut, Search, Plus, Eye, X, Trash, FileText } from 'lucide-react';
import ClientModal from './components/ClientModal';
import ReportGenerator from './components/ReportGenerator';
import { clientService, Client } from '@/lib/services/clients';
import { Toaster, toast } from 'react-hot-toast';

// Client Delete Confirmation Modal
function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  client, 
  onConfirm 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  client: Client | null;
  onConfirm: () => void;
}) {
  if (!isOpen || !client) return null;
  
  const [confirmText, setConfirmText] = useState('');
  const isConfirmEnabled = confirmText === 'DELETE';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Delete Client</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <Trash className="h-5 w-5" />
            <p className="font-medium">Are you sure you want to delete this client?</p>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            This action cannot be undone. This will permanently delete the client
            <strong> {client.client_name}</strong> and all associated data.
          </p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type DELETE to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="DELETE"
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!isConfirmEnabled}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                isConfirmEnabled
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-red-300 cursor-not-allowed'
              }`}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// New ClientDetailsModal component
function ClientDetailsModal({ isOpen, onClose, client }: { isOpen: boolean; onClose: () => void; client: Client | null }) {
  if (!isOpen || !client) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">{client.client_name} - Details</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-gray-700 border-b pb-2">Basic Information</h3>
            <div className="grid grid-cols-2 gap-2">
              <p className="text-sm text-gray-600">Client Name:</p>
              <p className="text-sm font-medium">{client.client_name}</p>
              
              <p className="text-sm text-gray-600">Customer Type:</p>
              <p className="text-sm font-medium">{client.customer_type}</p>
              
              <p className="text-sm text-gray-600">Introducer Code:</p>
              <p className="text-sm font-medium">{client.introducer_code || '-'}</p>
              
              <p className="text-sm text-gray-600">Product:</p>
              <p className="text-sm font-medium">{client.product}</p>
              
              <p className="text-sm text-gray-600">Insurance Provider:</p>
              <p className="text-sm font-medium">{client.insurance_provider}</p>
              
              <p className="text-sm text-gray-600">Branch:</p>
              <p className="text-sm font-medium">{client.branch || '-'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-md font-semibold text-gray-700 border-b pb-2">Contact Information</h3>
            <div className="grid grid-cols-2 gap-2">
              <p className="text-sm text-gray-600">Mobile:</p>
              <p className="text-sm font-medium">{client.mobile_no}</p>
              
              <p className="text-sm text-gray-600">Telephone:</p>
              <p className="text-sm font-medium">{client.telephone || '-'}</p>
              
              <p className="text-sm text-gray-600">Email:</p>
              <p className="text-sm font-medium">{client.email || '-'}</p>
              
              <p className="text-sm text-gray-600">Contact Person:</p>
              <p className="text-sm font-medium">{client.contact_person || '-'}</p>
              
              <p className="text-sm text-gray-600">Social Media:</p>
              <p className="text-sm font-medium">{client.social_media || '-'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-md font-semibold text-gray-700 border-b pb-2">Address</h3>
            <div className="grid grid-cols-2 gap-2">
              <p className="text-sm text-gray-600">Street 1:</p>
              <p className="text-sm font-medium">{client.street1 || '-'}</p>
              
              <p className="text-sm text-gray-600">Street 2:</p>
              <p className="text-sm font-medium">{client.street2 || '-'}</p>
              
              <p className="text-sm text-gray-600">City:</p>
              <p className="text-sm font-medium">{client.city || '-'}</p>
              
              <p className="text-sm text-gray-600">District:</p>
              <p className="text-sm font-medium">{client.district || '-'}</p>
              
              <p className="text-sm text-gray-600">Province:</p>
              <p className="text-sm font-medium">{client.province || '-'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-md font-semibold text-gray-700 border-b pb-2">Policy Information</h3>
            <div className="grid grid-cols-2 gap-2">
              <p className="text-sm text-gray-600">Policy Type:</p>
              <p className="text-sm font-medium">{client.policy_type || '-'}</p>
              
              <p className="text-sm text-gray-600">Policy Number:</p>
              <p className="text-sm font-medium">{client.policy_no || '-'}</p>
              
              <p className="text-sm text-gray-600">Policy Period:</p>
              <p className="text-sm font-medium">
                {client.policy_period_from ? new Date(client.policy_period_from).toLocaleDateString() : '-'} to {client.policy_period_to ? new Date(client.policy_period_to).toLocaleDateString() : '-'}
              </p>
              
              <p className="text-sm text-gray-600">Coverage:</p>
              <p className="text-sm font-medium">{client.coverage || '-'}</p>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-4">
            <h3 className="text-md font-semibold text-gray-700 border-b pb-2">Financial Information</h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Sum Insured</p>
                <p className="text-sm font-medium">{client.sum_insured?.toLocaleString() || '0'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Basic Premium</p>
                <p className="text-sm font-medium">{client.basic_premium?.toLocaleString() || '0'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">SRCC Premium</p>
                <p className="text-sm font-medium">{client.srcc_premium?.toLocaleString() || '0'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">TC Premium</p>
                <p className="text-sm font-medium">{client.tc_premium?.toLocaleString() || '0'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Net Premium</p>
                <p className="text-sm font-medium">{client.net_premium?.toLocaleString() || '0'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Stamp Duty</p>
                <p className="text-sm font-medium">{client.stamp_duty?.toLocaleString() || '0'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Admin Fees</p>
                <p className="text-sm font-medium">{client.admin_fees?.toLocaleString() || '0'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Road Safety Fee</p>
                <p className="text-sm font-medium">{client.road_safety_fee?.toLocaleString() || '0'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Policy Fee</p>
                <p className="text-sm font-medium">{client.policy_fee?.toLocaleString() || '0'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">VAT Fee</p>
                <p className="text-sm font-medium">{client.vat_fee?.toLocaleString() || '0'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600 font-bold">Total Invoice</p>
                <p className="text-sm font-bold">{client.total_invoice?.toLocaleString() || '0'}</p>
              </div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-4">
            <h3 className="text-md font-semibold text-gray-700 border-b pb-2">Commission Information</h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Commission Type</p>
                <p className="text-sm font-medium">{client.commission_type || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Basic Commission</p>
                <p className="text-sm font-medium">{client.commission_basic?.toLocaleString() || '0'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">SRCC Commission</p>
                <p className="text-sm font-medium">{client.commission_srcc?.toLocaleString() || '0'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">TC Commission</p>
                <p className="text-sm font-medium">{client.commission_tc?.toLocaleString() || '0'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ManagerDashboard() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [clientToView, setClientToView] = useState<Client | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'clients', label: 'All Clients', icon: Users },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  useEffect(() => {
    if (activeTab === 'clients' || activeTab === 'reports') {
      fetchClients();
    }
  }, [activeTab]);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const data = await clientService.getAllClients();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to load clients');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    // The AuthContext's logout function will redirect to login page
  };

  const handleAddClient = () => {
    setSelectedClient(null);
    setIsClientModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsClientModalOpen(true);
  };

  const handleClientSaved = () => {
    fetchClients();
  };

  const handleViewClientDetails = (client: Client) => {
    setClientToView(client);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteClient = (client: Client) => {
    setClientToDelete(client);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteClient = async () => {
    if (!clientToDelete || !clientToDelete.id) return;
    
    try {
      setIsLoading(true);
      await clientService.deleteClient(clientToDelete.id);
      toast.success(`${clientToDelete.client_name} deleted successfully`);
      setIsDeleteModalOpen(false);
      fetchClients();
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Failed to delete client');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClients = clients.filter(client => 
    client.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.mobile_no && client.mobile_no.includes(searchTerm))
  );

  const handleOpenReportModal = () => {
    if (clients.length === 0) {
      fetchClients().then(() => {
        setIsReportModalOpen(true);
      });
    } else {
      setIsReportModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: 'green',
            },
          },
          error: {
            style: {
              background: 'red',
            },
          },
        }}
      />
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
          <button 
            onClick={handleLogout}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
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
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-orange-50 rounded-lg mr-4">
                      <Users className="w-6 h-6 text-orange-700" />
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Total Clients</span>
                      <div className="text-2xl font-bold text-gray-900">{clients.length}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* All Clients Tab */}
          {activeTab === 'clients' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleAddClient}
                    className="flex items-center gap-1 px-4 py-2 bg-orange-700 text-white rounded-lg hover:bg-orange-800"
                  >
                    <Plus className="w-4 h-4" />
                    Add Client
                  </button>
                </div>
              </div>
              
              {/* Clients Table */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  {isLoading ? (
                    <div className="p-8 text-center">
                      <p>Loading clients...</p>
                    </div>
                  ) : filteredClients.length === 0 ? (
                    <div className="p-8 text-center">
                      <p>No clients found.</p>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy #</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredClients.map((client) => (
                          <tr key={client.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{client.client_name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{client.mobile_no}</div>
                              <div className="text-sm text-gray-500">{client.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{client.product}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{client.policy_no}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-3">
                                <button
                                  onClick={() => handleViewClientDetails(client)}
                                  className="text-blue-600 hover:text-blue-900 flex items-center"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Details
                                </button>
                                <button
                                  onClick={() => handleEditClient(client)}
                                  className="text-orange-600 hover:text-orange-900"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteClient(client)}
                                  className="text-red-600 hover:text-red-900 flex items-center"
                                >
                                  <Trash className="w-4 h-4 mr-1" />
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Generate Reports</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Generate customized reports based on client data. You can filter by date range and choose the type of report that best suits your needs.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-blue-100 rounded-md mr-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <h4 className="font-medium">Client List</h4>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      Comprehensive list of all clients with their basic information and contact details.
                    </p>
                    <button 
                      onClick={handleOpenReportModal}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Generate Report →
                    </button>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-green-100 rounded-md mr-3">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                      <h4 className="font-medium">Financial Summary</h4>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      Summary of financial data including premiums, commissions and total invoices.
                    </p>
                    <button 
                      onClick={handleOpenReportModal}
                      className="text-sm text-green-600 hover:text-green-800"
                    >
                      Generate Report →
                    </button>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-red-100 rounded-md mr-3">
                        <FileText className="h-5 w-5 text-red-600" />
                      </div>
                      <h4 className="font-medium">Policy Expiry</h4>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      List of policies with their expiration dates sorted by days remaining.
                    </p>
                    <button 
                      onClick={handleOpenReportModal}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Generate Report →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Client Modal */}
          <ClientModal
            isOpen={isClientModalOpen}
            onClose={() => setIsClientModalOpen(false)}
            client={selectedClient}
            onClientSaved={handleClientSaved}
          />

          {/* Client Details Modal */}
          <ClientDetailsModal 
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            client={clientToView}
          />

          {/* Delete Confirmation Modal */}
          <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            client={clientToDelete}
            onConfirm={confirmDeleteClient}
          />

          {/* Report Generator Modal */}
          <ReportGenerator
            isOpen={isReportModalOpen}
            onClose={() => setIsReportModalOpen(false)}
            clients={clients}
          />
        </div>
      </main>
    </div>
  );
} 