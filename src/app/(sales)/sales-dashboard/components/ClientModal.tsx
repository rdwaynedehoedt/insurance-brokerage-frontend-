'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

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

interface ClientErrors {
  name?: string;
  contact?: {
    phone?: string;
    email?: string;
  };
  nic?: string;
  address?: string;
  notes?: string;
}

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (client: Client) => void;
  client?: Client;
  mode: 'add' | 'edit';
}

export default function ClientModal({ isOpen, onClose, onSubmit, client, mode }: ClientModalProps) {
  const [formData, setFormData] = useState<Client>({
    name: '',
    contact: {
      phone: '',
      email: ''
    },
    nic: '',
    address: '',
    notes: '',
    salespersonId: 'SP001' // This should come from the logged-in user
  });

  const [errors, setErrors] = useState<ClientErrors>({});

  useEffect(() => {
    if (client && mode === 'edit') {
      setFormData(client);
    }
  }, [client, mode]);

  const validateForm = () => {
    const newErrors: ClientErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.contact.phone.trim()) {
      newErrors.contact = { ...newErrors.contact, phone: 'Phone number is required' };
    }
    
    if (!formData.contact.email.trim()) {
      newErrors.contact = { ...newErrors.contact, email: 'Email is required' };
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email)) {
      newErrors.contact = { ...newErrors.contact, email: 'Invalid email format' };
    }
    
    if (!formData.nic.trim()) {
      newErrors.nic = 'NIC/Passport number is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {mode === 'add' ? 'Add New Client' : 'Edit Client'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.contact.phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact: { ...formData.contact, phone: e.target.value }
                  })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.contact?.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.contact?.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.contact.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact: { ...formData.contact, email: e.target.value }
                  })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.contact?.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.contact?.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.contact.email}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NIC/Passport Number
              </label>
              <input
                type="text"
                value={formData.nic}
                onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.nic ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.nic && (
                <p className="mt-1 text-sm text-red-600">{errors.nic}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-700 text-white rounded-lg hover:bg-orange-800"
            >
              {mode === 'add' ? 'Add Client' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 