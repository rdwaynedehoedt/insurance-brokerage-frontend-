'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Users, Home, LogOut, Search, Plus, Eye, X, Trash, FileText, UserPlus, RefreshCcw, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import ClientModal from './components/ClientModal';
import ReportGenerator from './components/ReportGenerator';
import { clientService, Client } from '@/lib/services/clients';
import { Toaster, toast } from 'react-hot-toast';
import ClientDocuments from './components/ClientDocuments';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Simple component to check if a file exists
function FileChecker() {
  const [fileUrl, setFileUrl] = useState('');
  const [result, setResult] = useState<{exists: boolean, status?: number, message?: string} | null>(null);
  const [checking, setChecking] = useState(false);
  
  const checkFile = async () => {
    if (!fileUrl) return;
    
    setChecking(true);
    setResult(null);
    
    try {
      // Clean the URL to get just the path
      let path = fileUrl;
      if (path.includes('http://localhost:5000')) {
        path = path.replace('http://localhost:5000', '');
      }
      
      // Add leading slash if missing
      if (!path.startsWith('/')) {
        path = '/' + path;
      }
      
      console.log('Checking file at path:', path);
      
      // Try to fetch the file
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${baseUrl}${path}`, {
        validateStatus: () => true // Accept all status codes
      });
      
      console.log('File check response:', response);
      
      setResult({
        exists: response.status === 200,
        status: response.status,
        message: `Status: ${response.status} ${response.statusText}`
      });
    } catch (error) {
      console.error('Error checking file:', error);
      setResult({
        exists: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setChecking(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">Document Path Checker</h3>
      <div className="flex space-x-2">
        <input
          type="text"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          placeholder="Enter document path or URL"
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={checkFile}
          disabled={checking || !fileUrl}
          className={`px-3 py-2 rounded text-white ${checking ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {checking ? 'Checking...' : 'Check'}
        </button>
      </div>
      {result && (
        <div className={`mt-2 p-2 rounded ${result.exists ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <p>File {result.exists ? 'exists' : 'does not exist'}</p>
          {result.message && <p className="text-sm">{result.message}</p>}
        </div>
      )}
    </div>
  );
}

// Component to run document diagnostic
function DocumentDiagnostic() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [fixingPaths, setFixingPaths] = useState(false);
  const [fixResults, setFixResults] = useState<any>(null);
  
  const runDiagnostic = async () => {
    setRunning(true);
    setResults(null);
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('auth_token');
      
      const response = await axios.post(
        `${baseUrl}/api/clients/diagnostic/check-documents`, 
        {}, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('Document diagnostic results:', response.data);
      // Type assertion on the response data
      const responseData = response.data as {
        success: boolean;
        message: string;
        results: {
          totalClients: number;
          checkedDocuments: number;
          missingFiles: number;
          tempFiles: number;
          fixedPaths: number;
          errors: string[];
          details: any[];
        };
      };
      
      setResults(responseData.results);
      
      if (responseData.results.fixedPaths > 0) {
        toast.success(`Fixed ${responseData.results.fixedPaths} document paths!`);
      }
    } catch (error) {
      console.error('Error running document diagnostic:', error);
      toast.error('Failed to run document diagnostic');
      
      // Type assertion if we need to access error properties
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setResults({ error: errorMessage });
    } finally {
      setRunning(false);
    }
  };

  const fixDocumentPaths = async () => {
    setFixingPaths(true);
    setFixResults(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('auth_token');
      
      const response = await axios.post(
        `${baseUrl}/api/clients/diagnostic/fix-document-paths`, 
        {}, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('Fix document paths results:', response.data);
      const responseData = response.data as {
        success: boolean;
        message: string;
        results: {
          totalClients: number;
          checkedPaths: number;
          fixedPaths: number;
          errors: string[];
          details: any[];
        };
      };
      
      setFixResults(responseData.results);
      
      if (responseData.results.fixedPaths > 0) {
        toast.success(`Fixed ${responseData.results.fixedPaths} document paths!`);
      } else {
        toast.success('All document paths are correctly formatted.');
      }
    } catch (error) {
      console.error('Error fixing document paths:', error);
      toast.error('Failed to fix document paths');
      
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setFixResults({ error: errorMessage });
    } finally {
      setFixingPaths(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">Document Diagnostic</h3>
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Run a diagnostic to check for and fix document path issues.
          This will verify document paths and attempt to fix temporary folder references.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <button
            onClick={runDiagnostic}
            disabled={running}
            className={`px-4 py-2 rounded text-white ${running ? 'bg-gray-500' : 'bg-orange-500 hover:bg-orange-600'}`}
          >
            {running ? 'Running diagnostic...' : 'Run Diagnostic'}
          </button>
          <button
            onClick={fixDocumentPaths}
            disabled={fixingPaths}
            className={`px-4 py-2 rounded text-white ${fixingPaths ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {fixingPaths ? 'Fixing paths...' : 'Fix Document Paths'}
          </button>
        </div>
      </div>
      
      {results && (
        <div className="border rounded p-3 bg-gray-50 text-sm mb-3">
          <h4 className="font-medium mb-1">Diagnostic Results:</h4>
          {results.error ? (
            <div className="text-red-600">{results.error}</div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>Clients checked:</div>
                <div className="font-medium">{results.totalClients}</div>
                
                <div>Documents checked:</div>
                <div className="font-medium">{results.checkedDocuments}</div>
                
                <div>Missing files:</div>
                <div className="font-medium text-amber-600">{results.missingFiles}</div>
                
                <div>Temp files found:</div>
                <div className="font-medium text-blue-600">{results.tempFiles}</div>
                
                <div>Paths fixed:</div>
                <div className="font-medium text-green-600">{results.fixedPaths}</div>
                
                <div>Errors:</div>
                <div className="font-medium text-red-600">{results.errors?.length || 0}</div>
              </div>
              
              {results.errors && results.errors.length > 0 && (
                <div className="mt-2 bg-red-50 p-2 rounded max-h-32 overflow-y-auto">
                  <p className="font-medium text-red-800 mb-1">Errors:</p>
                  {results.errors.map((error: string, i: number) => (
                    <div key={i} className="text-xs text-red-700">{error}</div>
                  ))}
                </div>
              )}
              
              {results.details && results.details.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium">
                    <a 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        console.log('Full diagnostic details:', results.details);
                        toast.success('Full details logged to console');
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      View full details in console
                    </a>
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
      
      {fixResults && (
        <div className="border rounded p-3 bg-gray-50 text-sm">
          <h4 className="font-medium mb-1">Path Fix Results:</h4>
          {fixResults.error ? (
            <div className="text-red-600">{fixResults.error}</div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>Clients checked:</div>
                <div className="font-medium">{fixResults.totalClients}</div>
                
                <div>Paths checked:</div>
                <div className="font-medium">{fixResults.checkedPaths}</div>
                
                <div>Paths fixed:</div>
                <div className="font-medium text-green-600">{fixResults.fixedPaths}</div>
                
                <div>Errors:</div>
                <div className="font-medium text-red-600">{fixResults.errors?.length || 0}</div>
              </div>
              
              {fixResults.errors && fixResults.errors.length > 0 && (
                <div className="mt-2 bg-red-50 p-2 rounded max-h-32 overflow-y-auto">
                  <p className="font-medium text-red-800 mb-1">Errors:</p>
                  {fixResults.errors.map((error: string, i: number) => (
                    <div key={i} className="text-xs text-red-700">{error}</div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

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
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!isConfirmEnabled}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors duration-200 ${
                isConfirmEnabled
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-sm'
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
          
          <div className="col-span-1 md:col-span-2 space-y-4">
            <h3 className="text-md font-semibold text-gray-700 border-b pb-2">Client Documents</h3>
            <ClientDocuments client={client} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ManagerDashboard() {
  const { logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('clients');
  
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState('280px');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showClientTable, setShowClientTable] = useState(true);
  
  // Client modal state
  const [showClientModal, setShowClientModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientDetailsModalOpen, setClientDetailsModalOpen] = useState(false);
  const [clientToView, setClientToView] = useState<Client | null>(null);
  
  // Client delete confirmation state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  
  // Report Generator Modal state
  const [showReportModal, setShowReportModal] = useState(false);
  
  // Debug mode for file checking
  const [debugMode, setDebugMode] = useState(false);

  const menuItems = [
    // { id: 'overview', label: 'Overview', icon: Home },
    { id: 'clients', label: 'Underwriter', icon: Users },
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
    setShowClientModal(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setShowClientModal(true);
  };

  const handleClientSaved = () => {
    fetchClients();
  };

  const handleViewClientDetails = (client: Client) => {
    setClientToView(client);
    setClientDetailsModalOpen(true);
  };

  const handleDeleteClient = (client: Client) => {
    setClientToDelete(client);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteClient = async () => {
    if (!clientToDelete) return;
    
    try {
      await clientService.deleteClient(clientToDelete.id!);
      toast.success(`${clientToDelete.client_name} deleted successfully`);
      setDeleteConfirmOpen(false);
      fetchClients();
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Failed to delete client');
    }
  };

  // Filter clients based on search term
  useEffect(() => {
    if (clients.length === 0) return;

    const filtered = clients.filter(client => 
    client.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.mobile_no && client.mobile_no.includes(searchTerm))
  );
    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  const handleOpenReportModal = () => {
    if (clients.length === 0) {
      fetchClients().then(() => {
        setShowReportModal(true);
      });
    } else {
      setShowReportModal(true);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Toaster position="top-center" />
      
      {/* Debug panel toggle */}
      <div className="fixed bottom-4 right-4 z-50">
        <button 
          onClick={() => setDebugMode(!debugMode)}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          title="Toggle debug tools"
        >
          <span className="text-xl">🔧</span>
        </button>
      </div>
      
      {/* Debug panel */}
      {debugMode && (
        <div className="fixed top-4 right-4 z-50 w-96">
          <FileChecker />
          <DocumentDiagnostic />
        </div>
      )}
      
      {/* Main container */}
      <div className="flex flex-1 h-full overflow-hidden">
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
                className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-all duration-300 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border-r-4 border-orange-700 shadow-sm'
                    : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
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
            className="flex items-center text-gray-600 hover:text-orange-700 transition-colors duration-300"
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
          {/* Commenting out Overview section 
          {activeTab === 'overview' && (
            <div className="space-y-8">
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
          */}

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
                    className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-300 shadow-sm hover:shadow"
                  >
                    <Plus className="w-4 h-4" />
                    Add Client
                  </button>
                  </div>
              </div>

              {/* Clients Table - Only show when View button is clicked */}
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
                                    className="text-blue-600 hover:text-blue-800 flex items-center transition-colors duration-200 hover:scale-105 transform"
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    Details
                                  </button>
                                  <button
                                    onClick={() => handleEditClient(client)}
                                    className="text-orange-600 hover:text-orange-800 transition-colors duration-200 hover:scale-105 transform"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteClient(client)}
                                    className="text-red-600 hover:text-red-800 flex items-center transition-colors duration-200 hover:scale-105 transform"
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
                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-300 hover:underline flex items-center group"
                    >
                      Generate Report <span className="ml-1 transform transition-transform duration-300 group-hover:translate-x-1">→</span>
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
                      className="text-sm text-green-600 hover:text-green-800 transition-colors duration-300 hover:underline flex items-center group"
                    >
                      Generate Report <span className="ml-1 transform transition-transform duration-300 group-hover:translate-x-1">→</span>
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
                      className="text-sm text-red-600 hover:text-red-800 transition-colors duration-300 hover:underline flex items-center group"
                    >
                      Generate Report <span className="ml-1 transform transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </button>
                </div>
                </div>
              </div>
            </div>
          )}

      {/* Client Modal */}
      <ClientModal
          isOpen={showClientModal}
          onClose={() => setShowClientModal(false)}
        client={selectedClient}
            onClientSaved={handleClientSaved}
          />

          {/* Client Details Modal */}
          <ClientDetailsModal 
          isOpen={clientDetailsModalOpen}
          onClose={() => setClientDetailsModalOpen(false)}
            client={clientToView}
          />

          {/* Delete Confirmation Modal */}
          <DeleteConfirmationModal
          isOpen={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
            client={clientToDelete}
            onConfirm={confirmDeleteClient}
          />

          {/* Report Generator Modal */}
          <ReportGenerator
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
            clients={clients}
          />
        </div>
      </main>
  </div>
    </div>
  );
} 