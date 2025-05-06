'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Policy {
  id: string;
  name: string;
  type: string;
  description: string;
  coverage: string;
  premium: number;
  duration: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
}

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  policy: Policy | null;
}

interface PolicyErrors {
  name?: string;
  type?: string;
  description?: string;
  coverage?: string;
  premium?: string;
  duration?: string;
}

export default function PolicyModal({ isOpen, onClose, policy }: PolicyModalProps) {
  const [formData, setFormData] = useState<Partial<Policy>>({
    name: '',
    type: '',
    description: '',
    coverage: '',
    premium: 0,
    duration: '',
    status: 'draft'
  });
  const [errors, setErrors] = useState<PolicyErrors>({});

  useEffect(() => {
    if (policy) {
      setFormData(policy);
    } else {
      setFormData({
        name: '',
        type: '',
        description: '',
        coverage: '',
        premium: 0,
        duration: '',
        status: 'draft'
      });
    }
  }, [policy]);

  const validateForm = () => {
    const newErrors: PolicyErrors = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Policy name is required';
    }
    
    if (!formData.type?.trim()) {
      newErrors.type = 'Policy type is required';
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.coverage?.trim()) {
      newErrors.coverage = 'Coverage details are required';
    }
    
    if (!formData.premium || formData.premium <= 0) {
      newErrors.premium = 'Premium must be greater than 0';
    }
    
    if (!formData.duration?.trim()) {
      newErrors.duration = 'Duration is required';
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
            {policy ? 'Edit Policy' : 'Add New Policy'}
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
                Policy Name
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
                Policy Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.type ? 'border-red-500' : 'border-gray-200'
                }`}
              >
                <option value="">Select Type</option>
                <option value="Life">Life Insurance</option>
                <option value="Health">Health Insurance</option>
                <option value="Vehicle">Vehicle Insurance</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coverage Details
              </label>
              <textarea
                value={formData.coverage}
                onChange={(e) => setFormData({ ...formData, coverage: e.target.value })}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.coverage ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.coverage && (
                <p className="mt-1 text-sm text-red-600">{errors.coverage}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Premium (Rs.)
              </label>
              <input
                type="number"
                value={formData.premium}
                onChange={(e) => setFormData({ ...formData, premium: Number(e.target.value) })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.premium ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.premium && (
                <p className="mt-1 text-sm text-red-600">{errors.premium}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 1 year, 20 years"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.duration ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Policy['status'] })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
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
              {policy ? 'Update Policy' : 'Add Policy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 