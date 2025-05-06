'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

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

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  salesReps: SalesRep[];
}

interface ClientErrors {
  name?: string;
  contact?: string;
  nic?: string;
  address?: string;
  salesRep?: string;
}

export default function ClientModal({ isOpen, onClose, client, salesReps }: ClientModalProps) {
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    contact: '',
    nic: '',
    address: '',
    notes: '',
    salesRep: '',
    policies: 0
  });
  const [errors, setErrors] = useState<ClientErrors>({});

  useEffect(() => {
    if (client) {
      setFormData(client);
    } else {
      setFormData({
        name: '',
        contact: '',
        nic: '',
        address: '',
        notes: '',
        salesRep: '',
        policies: 0
      });
    }
  }, [client]);

  const validateForm = () => {
    const newErrors: ClientErrors = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.contact?.trim()) {
      newErrors.contact = 'Contact number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.contact)) {
      newErrors.contact = 'Invalid contact number';
    }
    
    if (!formData.nic?.trim()) {
      newErrors.nic = 'NIC/Passport is required';
    } else if (!/^[0-9]{9}[Vv]$/.test(formData.nic)) {
      newErrors.nic = 'Invalid NIC format (e.g., 901234567V)';
    }
    
    if (!formData.address?.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.salesRep) {
      newErrors.salesRep = 'Sales Rep is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // TODO: Handle form submission
      console.log('Form submitted:', formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {client ? 'Edit Client' : 'Add New Client'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              <input
                type="tel"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.contact ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.contact && (
                <p className="mt-1 text-sm text-red-600">{errors.contact}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NIC/Passport
              </label>
              <input
                type="text"
                value={formData.nic}
                onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.nic ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.nic && (
                <p className="mt-1 text-sm text-red-600">{errors.nic}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sales Representative
              </label>
              <select
                value={formData.salesRep}
                onChange={(e) => setFormData({ ...formData, salesRep: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.salesRep ? 'border-red-500' : 'border-gray-200'
                }`}
              >
                <option value="">Select Sales Rep</option>
                {salesReps.map((rep) => (
                  <option key={rep.id} value={rep.id}>
                    {rep.name}
                  </option>
                ))}
              </select>
              {errors.salesRep && (
                <p className="mt-1 text-sm text-red-600">{errors.salesRep}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.address ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-orange-700 text-white rounded-lg hover:bg-orange-800"
            >
              {client ? 'Update Client' : 'Add Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 