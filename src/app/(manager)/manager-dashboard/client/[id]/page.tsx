'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { clientService, Client as ClientType } from '@/lib/services/clients';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import ClientDocuments from '../../components/ClientDocuments';

export default function ClientDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [client, setClient] = useState<ClientType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        const clientData = await clientService.getClientById(id as string);
        setClient(clientData);
        setError(null);
      } catch (err) {
        console.error('Error fetching client:', err);
        setError('Failed to load client details');
        toast.error('Could not load client details');
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const handleEdit = () => {
    // Navigate to edit page or open edit modal
    router.push(`/manager-dashboard/client/${id}/edit`);
  };

  const handleDeleteConfirm = async () => {
    try {
      await clientService.deleteClient(id as string);
      toast.success('Client deleted successfully');
      router.push('/manager-dashboard');
    } catch (err) {
      console.error('Error deleting client:', err);
      toast.error('Failed to delete client');
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return '-';
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'LKR' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
        <p className="text-gray-600">{error || 'Client not found'}</p>
        <button 
          onClick={() => router.push('/manager-dashboard')} 
          className="mt-4 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => router.push('/manager-dashboard')}
          className="flex items-center text-gray-600 hover:text-orange-600 mr-4"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Clients
        </button>
        <h1 className="text-3xl font-bold text-gray-800 flex-1">Client Details</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="px-4 py-2 flex items-center bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </button>
          <button
            onClick={() => setDeleteConfirmOpen(true)}
            className="px-4 py-2 flex items-center bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Basic Information</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2">
                <div className="text-gray-600">Client ID:</div>
                <div className="font-medium">{client.id || '-'}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-gray-600">Client Name:</div>
                <div className="font-medium">{client.client_name || '-'}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-gray-600">Customer Type:</div>
                <div>{client.customer_type || '-'}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-gray-600">Introducer Code:</div>
                <div>{client.introducer_code || '-'}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-gray-600">Product:</div>
                <div>{client.product || '-'}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-gray-600">Insurance Provider:</div>
                <div>{client.insurance_provider || '-'}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-gray-600">Branch:</div>
                <div>{client.branch || '-'}</div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2">
                <div className="text-gray-600">Mobile Number:</div>
                <div>{client.mobile_no || '-'}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-gray-600">Telephone:</div>
                <div>{client.telephone || '-'}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-gray-600">Email:</div>
                <div>{client.email || '-'}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-gray-600">Contact Person:</div>
                <div>{client.contact_person || '-'}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-gray-600">Social Media:</div>
                <div>{client.social_media || '-'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-6 pt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="grid grid-cols-2">
                <div className="text-gray-600">Street 1:</div>
                <div>{client.street1 || '-'}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-gray-600">Street 2:</div>
                <div>{client.street2 || '-'}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-gray-600">City:</div>
                <div>{client.city || '-'}</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2">
                <div className="text-gray-600">District:</div>
                <div>{client.district || '-'}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-gray-600">Province:</div>
                <div>{client.province || '-'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-6 pt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Policy Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="grid grid-cols-2">
                <div className="text-gray-600">Policy Type:</div>
                <div>{client.policy_type || '-'}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-gray-600">Policy:</div>
                <div>{client.policy_ || '-'}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-gray-600">Policy Number:</div>
                <div>{client.policy_no || '-'}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-gray-600">Policy Period:</div>
                <div>
                  {formatDate(client.policy_period_from)} to {formatDate(client.policy_period_to)}
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-gray-600">Coverage:</div>
                <div>{client.coverage || '-'}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-gray-600">Sum Insured:</div>
                <div>{formatCurrency(client.sum_insured)}</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2">
                <div className="text-gray-600">Basic Premium:</div>
                <div>{formatCurrency(client.basic_premium)}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-gray-600">SRCC Premium:</div>
                <div>{formatCurrency(client.srcc_premium)}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-gray-600">TC Premium:</div>
                <div>{formatCurrency(client.tc_premium)}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-gray-600">Net Premium:</div>
                <div>{formatCurrency(client.net_premium)}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-gray-600">Total Invoice:</div>
                <div>{formatCurrency(client.total_invoice)}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-6 pt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Financial Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="grid grid-cols-2">
                <div className="text-gray-600">Stamp Duty:</div>
                <div>{formatCurrency(client.stamp_duty)}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-gray-600">Admin Fees:</div>
                <div>{formatCurrency(client.admin_fees)}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-gray-600">Road Safety Fee:</div>
                <div>{formatCurrency(client.road_safety_fee)}</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2">
                <div className="text-gray-600">Policy Fee:</div>
                <div>{formatCurrency(client.policy_fee)}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-gray-600">VAT Fee:</div>
                <div>{formatCurrency(client.vat_fee)}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-gray-600">Debit Note:</div>
                <div>{client.debit_note || '-'}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-6 pt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Commission Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="grid grid-cols-2">
                <div className="text-gray-600">Commission Type:</div>
                <div>{client.commission_type || '-'}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-gray-600">Basic Commission:</div>
                <div>{formatCurrency(client.commission_basic)}</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2">
                <div className="text-gray-600">SRCC Commission:</div>
                <div>{formatCurrency(client.commission_srcc)}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-gray-600">TC Commission:</div>
                <div>{formatCurrency(client.commission_tc)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Documents Section with better visibility and debug info */}
      <div className="mt-6 bg-orange-50 p-4 rounded-lg mb-4">
        <h2 className="text-xl font-bold text-orange-800 mb-2">Client Documents</h2>
        <p className="text-sm text-orange-700 mb-4">
          All uploaded documents for this client are displayed below.
        </p>
      </div>
      <ClientDocuments client={client} />

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">Delete Client</h3>
            <p className="mb-6">
              Are you sure you want to delete the client <strong>{client.client_name}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 