'use client';

import { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { clientService, Client as ClientType } from '@/lib/services/clients';
import { toast } from 'react-hot-toast';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: ClientType | null;
  onClientSaved?: () => void;
}

interface ClientErrors {
  client_name?: string;
  introducer_code?: string;
  customer_type?: string;
  product?: string;
  policy_?: string;
  insurance_provider?: string;
  mobile_no?: string;
  email?: string;
  policy_no?: string;
  policy_period_from?: string;
  policy_period_to?: string;
  // Document validation errors
  coverage_proof?: string;
  sum_insured_proof?: string;
  policy_fee_invoice?: string;
  vat_debit_note?: string;
  payment_receipt?: string;
  nic_proof?: string;
  dob_proof?: string;
  business_registration_proof?: string;
  svat_proof?: string;
  vat_proof?: string;
}

interface DocumentFile {
  file: File | null;
  preview: string | null;
  filename: string | null;
}

export default function ClientModal({ isOpen, onClose, client, onClientSaved }: ClientModalProps) {
  const [formData, setFormData] = useState<Partial<ClientType>>({
    id: '',
    introducer_code: '',
    customer_type: '',
    product: '',
    policy_: '',
    insurance_provider: '',
    branch: '',
    client_name: '',
    street1: '',
    street2: '',
    city: '',
    district: '',
    province: '',
    telephone: '',
    mobile_no: '',
    contact_person: '',
    email: '',
    social_media: '',
    nic_proof: '',
    dob_proof: '',
    business_registration: '',
    svat_proof: '',
    vat_proof: '',
    policy_type: '',
    policy_no: '',
    policy_period_from: '',
    policy_period_to: '',
    coverage: '',
    sum_insured: 0,
    basic_premium: 0,
    srcc_premium: 0,
    tc_premium: 0,
    net_premium: 0,
    stamp_duty: 0,
    admin_fees: 0,
    road_safety_fee: 0,
    policy_fee: 0,
    vat_fee: 0,
    total_invoice: 0,
    debit_note: '',
    payment_receipt: '',
    commission_type: '',
    commission_basic: 0,
    commission_srcc: 0,
    commission_tc: 0,
    policies: 0
  });
  
  const [documents, setDocuments] = useState<{
    coverage_proof: DocumentFile;
    sum_insured_proof: DocumentFile;
    policy_fee_invoice: DocumentFile;
    vat_debit_note: DocumentFile;
    payment_receipt: DocumentFile;
    nic_proof: DocumentFile;
    dob_proof: DocumentFile;
    business_registration_proof: DocumentFile;
    svat_proof: DocumentFile;
    vat_proof: DocumentFile;
  }>({
    coverage_proof: { file: null, preview: null, filename: null },
    sum_insured_proof: { file: null, preview: null, filename: null },
    policy_fee_invoice: { file: null, preview: null, filename: null },
    vat_debit_note: { file: null, preview: null, filename: null },
    payment_receipt: { file: null, preview: null, filename: null },
    nic_proof: { file: null, preview: null, filename: null },
    dob_proof: { file: null, preview: null, filename: null },
    business_registration_proof: { file: null, preview: null, filename: null },
    svat_proof: { file: null, preview: null, filename: null },
    vat_proof: { file: null, preview: null, filename: null }
  });
  
  const [errors, setErrors] = useState<ClientErrors>({});

  useEffect(() => {
    if (client) {
      // Ensure all values are defined to prevent null values
      setFormData({
        id: client.id || '',
        introducer_code: client.introducer_code || '',
        customer_type: client.customer_type || '',
        product: client.product || '',
        policy_: client.policy_ || '',
        insurance_provider: client.insurance_provider || '',
        branch: client.branch || '',
        client_name: client.client_name || '',
        street1: client.street1 || '',
        street2: client.street2 || '',
        city: client.city || '',
        district: client.district || '',
        province: client.province || '',
        telephone: client.telephone || '',
        mobile_no: client.mobile_no || '',
        contact_person: client.contact_person || '',
        email: client.email || '',
        social_media: client.social_media || '',
        nic_proof: client.nic_proof || '',
        dob_proof: client.dob_proof || '',
        // Use business_registration_proof field first, then fall back to business_registration
        business_registration: client.business_registration_proof || client.business_registration || '',
        svat_proof: client.svat_proof || '',
        vat_proof: client.vat_proof || '',
        policy_type: client.policy_type || '',
        policy_no: client.policy_no || '',
        policy_period_from: client.policy_period_from || '',
        policy_period_to: client.policy_period_to || '',
        coverage: client.coverage || '',
        coverage_proof: client.coverage_proof || '',
        sum_insured: client.sum_insured || 0,
        sum_insured_proof: client.sum_insured_proof || '',
        basic_premium: client.basic_premium || 0,
        srcc_premium: client.srcc_premium || 0,
        tc_premium: client.tc_premium || 0,
        net_premium: client.net_premium || 0,
        stamp_duty: client.stamp_duty || 0,
        admin_fees: client.admin_fees || 0,
        road_safety_fee: client.road_safety_fee || 0,
        policy_fee: client.policy_fee || 0,
        policy_fee_invoice: client.policy_fee_invoice || '',
        vat_fee: client.vat_fee || 0,
        vat_debit_note: client.vat_debit_note || '',
        total_invoice: client.total_invoice || 0,
        debit_note: client.debit_note || '',
        payment_receipt: client.payment_receipt || '',
        commission_type: client.commission_type || '',
        commission_basic: client.commission_basic || 0,
        commission_srcc: client.commission_srcc || 0,
        commission_tc: client.commission_tc || 0,
        policies: client.policies || 0
      });
      
      // If client has document links, set them as previews
      if (client.nic_proof) {
        setDocuments(prev => ({
          ...prev,
          nic_proof: { ...prev.nic_proof, preview: client.nic_proof as string, filename: extractFilename(client.nic_proof as string) }
        }));
      }
      
      // Set other document previews
      if (client.dob_proof) {
        setDocuments(prev => ({
          ...prev,
          dob_proof: { ...prev.dob_proof, preview: client.dob_proof as string, filename: extractFilename(client.dob_proof as string) }
        }));
      }
      
      if (client.business_registration) {
        setDocuments(prev => ({
          ...prev,
          business_registration_proof: { ...prev.business_registration_proof, preview: client.business_registration as string, filename: extractFilename(client.business_registration as string) }
        }));
      }
      
      if (client.svat_proof) {
        setDocuments(prev => ({
          ...prev,
          svat_proof: { ...prev.svat_proof, preview: client.svat_proof as string, filename: extractFilename(client.svat_proof as string) }
        }));
      }
      
      if (client.vat_proof) {
        setDocuments(prev => ({
          ...prev,
          vat_proof: { ...prev.vat_proof, preview: client.vat_proof as string, filename: extractFilename(client.vat_proof as string) }
        }));
      }
      
      if (client.coverage_proof) {
        setDocuments(prev => ({
          ...prev,
          coverage_proof: { ...prev.coverage_proof, preview: client.coverage_proof as string, filename: extractFilename(client.coverage_proof as string) }
        }));
      }
      
      if (client.sum_insured_proof) {
        setDocuments(prev => ({
          ...prev,
          sum_insured_proof: { ...prev.sum_insured_proof, preview: client.sum_insured_proof as string, filename: extractFilename(client.sum_insured_proof as string) }
        }));
      }
      
      if (client.policy_fee_invoice) {
        setDocuments(prev => ({
          ...prev,
          policy_fee_invoice: { ...prev.policy_fee_invoice, preview: client.policy_fee_invoice as string, filename: extractFilename(client.policy_fee_invoice as string) }
        }));
      }
      
      if (client.vat_debit_note) {
        setDocuments(prev => ({
          ...prev,
          vat_debit_note: { ...prev.vat_debit_note, preview: client.vat_debit_note as string, filename: extractFilename(client.vat_debit_note as string) }
        }));
      }
      
      if (client.payment_receipt) {
        setDocuments(prev => ({
          ...prev,
          payment_receipt: { ...prev.payment_receipt, preview: client.payment_receipt as string, filename: extractFilename(client.payment_receipt as string) }
        }));
      }
    } else {
      // Reset form data for a new client
      setFormData({
        id: '',
        introducer_code: '',
        customer_type: '',
        product: '',
        policy_: '',
        insurance_provider: '',
        branch: '',
        client_name: '',
        street1: '',
        street2: '',
        city: '',
        district: '',
        province: '',
        telephone: '',
        mobile_no: '',
        contact_person: '',
        email: '',
        social_media: '',
        nic_proof: '',
        dob_proof: '',
        business_registration: '',
        svat_proof: '',
        vat_proof: '',
        policy_type: '',
        policy_no: '',
        policy_period_from: '',
        policy_period_to: '',
        coverage: '',
        sum_insured: 0,
        basic_premium: 0,
        srcc_premium: 0,
        tc_premium: 0,
        net_premium: 0,
        stamp_duty: 0,
        admin_fees: 0,
        road_safety_fee: 0,
        policy_fee: 0,
        vat_fee: 0,
        total_invoice: 0,
        debit_note: '',
        payment_receipt: '',
        commission_type: '',
        commission_basic: 0,
        commission_srcc: 0,
        commission_tc: 0,
        policies: 0
      });
      
      // Reset document state
      setDocuments({
        coverage_proof: { file: null, preview: null, filename: null },
        sum_insured_proof: { file: null, preview: null, filename: null },
        policy_fee_invoice: { file: null, preview: null, filename: null },
        vat_debit_note: { file: null, preview: null, filename: null },
        payment_receipt: { file: null, preview: null, filename: null },
        nic_proof: { file: null, preview: null, filename: null },
        dob_proof: { file: null, preview: null, filename: null },
        business_registration_proof: { file: null, preview: null, filename: null },
        svat_proof: { file: null, preview: null, filename: null },
        vat_proof: { file: null, preview: null, filename: null }
      });
      
      // Reset error state
      setErrors({});
    }
    
    // Reset error state whenever the modal opens/closes or client changes
    setErrors({});
  }, [client, isOpen]);
  
  // Extract filename from URL or path
  const extractFilename = (path: string): string => {
    if (!path) return '';
    return path.split('/').pop() || path.split('\\').pop() || path;
  };

  const validateForm = () => {
    const newErrors: ClientErrors = {};
    
    if (!formData.client_name?.trim()) {
      newErrors.client_name = 'Client name is required';
    }
    
    if (!formData.mobile_no?.trim()) {
      newErrors.mobile_no = 'Mobile number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.mobile_no)) {
      newErrors.mobile_no = 'Invalid mobile number';
    }
    
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.customer_type) {
      newErrors.customer_type = 'Customer type is required';
    }
    
    if (!formData.product) {
      newErrors.product = 'Product is required';
    }
    
    if (!formData.insurance_provider) {
      newErrors.insurance_provider = 'Insurance provider is required';
    }
    
    if (!formData.policy_no?.trim()) {
      newErrors.policy_no = 'Policy number is required';
    }
    
    if (!formData.policy_period_from) {
      newErrors.policy_period_from = 'Policy start date is required';
    }
    
    if (!formData.policy_period_to) {
      newErrors.policy_period_to = 'Policy end date is required';
    }
    
    // Document validations
    if (!documents.coverage_proof.file && !documents.coverage_proof.preview) {
      newErrors.coverage_proof = 'Coverage proof document is required';
    }
    
    if (!documents.sum_insured_proof.file && !documents.sum_insured_proof.preview) {
      newErrors.sum_insured_proof = 'Sum insured proof document is required';
    }
    
    if (!documents.policy_fee_invoice.file && !documents.policy_fee_invoice.preview) {
      newErrors.policy_fee_invoice = 'Policy fee invoice document is required';
    }
    
    if (!documents.vat_debit_note.file && !documents.vat_debit_note.preview) {
      newErrors.vat_debit_note = 'VAT debit note document is required';
    }
    
    if (!documents.payment_receipt.file && !documents.payment_receipt.preview) {
      newErrors.payment_receipt = 'Payment receipt document is required';
    }
    
    if (!documents.nic_proof.file && !documents.nic_proof.preview) {
      newErrors.nic_proof = 'NIC proof document is required';
    }
    
    if (!documents.dob_proof.file && !documents.dob_proof.preview) {
      newErrors.dob_proof = 'Date of birth proof document is required';
    }
    
    if (!documents.business_registration_proof.file && !documents.business_registration_proof.preview) {
      newErrors.business_registration_proof = 'Business registration proof document is required';
    }
    
    if (!documents.svat_proof.file && !documents.svat_proof.preview) {
      newErrors.svat_proof = 'SVAT proof document is required';
    }
    
    if (!documents.vat_proof.file && !documents.vat_proof.preview) {
      newErrors.vat_proof = 'VAT proof document is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, documentType: keyof typeof documents) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setDocuments(prev => ({
          ...prev,
          [documentType]: {
            file: file,
            preview: reader.result as string,
            filename: file.name
          }
        }));
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Create a clean copy of formData without null/undefined values
        const clientData = { ...formData };
        
        // Make sure to remove the id field for new clients
        if (!client && clientData.id === '') {
          delete clientData.id;
        }
        
        // Create FormData object to handle file uploads
        const formDataToSend = new FormData();
        
        // Append all client data fields
        Object.entries(clientData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            // Map business_registration to business_registration_proof for consistency
            if (key === 'business_registration') {
              formDataToSend.append('business_registration_proof', value.toString());
            } else {
              formDataToSend.append(key, value.toString());
            }
          }
        });
        
        // Append document files if they exist
        Object.entries(documents).forEach(([key, value]) => {
          if (value.file) {
            formDataToSend.append(key, value.file);
            console.log(`Appending file for ${key}:`, value.file.name);
          }
        });
        
        console.log('Submitting client data with documents');
        
        if (client) {
          // Update existing client
          try {
            await clientService.updateClientWithDocuments(client.id as string, formDataToSend);
            toast.success('Client updated successfully', {
              duration: 4000,
              position: 'top-center',
            });
          } catch (updateError: any) {
            console.error('Detailed update error:', updateError);
            console.error('Error response:', updateError.response?.data);
            console.error('Error status:', updateError.response?.status);
            throw updateError;
          }
        } else {
          // Create new client
          try {
            const newClientId = await clientService.createClientWithDocuments(formDataToSend);
            console.log('New client created with ID:', newClientId);
            toast.success(`Client added successfully`, {
              duration: 4000,
              position: 'top-center',
            });
          } catch (createError: any) {
            console.error('Detailed create error:', createError);
            console.error('Error response:', createError.response?.data);
            console.error('Error status:', createError.response?.status);
            throw createError;
          }
        }
        
        // Call the callback function if provided
        if (onClientSaved) {
          onClientSaved();
        }
        
        // Close the modal
        onClose();
      } catch (error: any) {
        console.error('Error saving client:', error);
        const errorMessage = error.response?.data?.message || 
                            (error.message ? `${error.message}` : 'Failed to save client');
        toast.error(errorMessage, {
          duration: 4000,
          position: 'top-center',
        });
      }
    } else {
      toast.error('Please fix the form errors before submitting', {
        duration: 4000,
        position: 'top-center',
      });
    }
  };
  
  // Reusable file upload component
  const FileUploadField = ({ 
    label, 
    documentKey, 
    error 
  }: { 
    label: string, 
    documentKey: keyof typeof documents, 
    error?: string 
  }) => {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} *
        </label>
        <div className={`border ${error ? 'border-red-500' : 'border-gray-200'} rounded-lg p-2`}>
          {documents[documentKey].preview ? (
            <div className="flex items-center justify-between">
              <div className="text-sm truncate flex-1">{documents[documentKey].filename}</div>
              <button 
                type="button" 
                onClick={() => setDocuments(prev => ({
                  ...prev, 
                  [documentKey]: { file: null, preview: null, filename: null }
                }))}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <Upload className="w-6 h-6 mb-1" />
                  <p className="text-xs">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PDF, JPG, PNG (Max 10MB)</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, documentKey)} 
                />
              </label>
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white rounded-lg w-full max-w-5xl mx-4 my-8">
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <h3 className="font-medium text-lg text-gray-700 border-b pb-2">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={!!client}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Introducer Code
              </label>
              <input
                type="text"
                value={formData.introducer_code}
                onChange={(e) => setFormData({ ...formData, introducer_code: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Type *
              </label>
              <select
                value={formData.customer_type}
                onChange={(e) => setFormData({ ...formData, customer_type: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.customer_type ? 'border-red-500' : 'border-gray-200'
                }`}
              >
                <option value="">Select Customer Type</option>
                <option value="Individual">Individual</option>
                <option value="Corporate">Corporate</option>
                <option value="SME">SME</option>
              </select>
              {errors.customer_type && (
                <p className="mt-1 text-sm text-red-600">{errors.customer_type}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product *
              </label>
              <select
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.product ? 'border-red-500' : 'border-gray-200'
                }`}
              >
                <option value="">Select Product</option>
                <option value="Motor">Motor</option>
                <option value="Fire">Fire</option>
                <option value="Marine">Marine</option>
                <option value="Health">Health</option>
                <option value="Life">Life</option>
              </select>
              {errors.product && (
                <p className="mt-1 text-sm text-red-600">{errors.product}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Policy
              </label>
              <input
                type="text"
                value={formData.policy_}
                onChange={(e) => setFormData({ ...formData, policy_: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.policy_ ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.policy_ && (
                <p className="mt-1 text-sm text-red-600">{errors.policy_}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Insurance Provider *
              </label>
              <select
                value={formData.insurance_provider}
                onChange={(e) => setFormData({ ...formData, insurance_provider: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.insurance_provider ? 'border-red-500' : 'border-gray-200'
                }`}
              >
                <option value="">Select Insurance Provider</option>
                <option value="AIA">AIA</option>
                <option value="Allianz">Allianz</option>
                <option value="Ceylinco">Ceylinco</option>
                <option value="Union Assurance">Union Assurance</option>
                <option value="Sri Lanka Insurance">Sri Lanka Insurance</option>
              </select>
              {errors.insurance_provider && (
                <p className="mt-1 text-sm text-red-600">{errors.insurance_provider}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch
              </label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Name *
              </label>
              <input
                type="text"
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.client_name ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.client_name && (
                <p className="mt-1 text-sm text-red-600">{errors.client_name}</p>
              )}
            </div>
          </div>

          <h3 className="font-medium text-lg text-gray-700 border-b pb-2 mt-8">Address Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street 1
              </label>
              <input
                type="text"
                value={formData.street1}
                onChange={(e) => setFormData({ ...formData, street1: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street 2
              </label>
              <input
                type="text"
                value={formData.street2}
                onChange={(e) => setFormData({ ...formData, street2: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Province
              </label>
              <input
                type="text"
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <h3 className="font-medium text-lg text-gray-700 border-b pb-2 mt-8">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telephone
              </label>
              <input
                type="tel"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number *
              </label>
              <input
                type="tel"
                value={formData.mobile_no}
                onChange={(e) => setFormData({ ...formData, mobile_no: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.mobile_no ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.mobile_no && (
                <p className="mt-1 text-sm text-red-600">{errors.mobile_no}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person
              </label>
              <input
                type="text"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Social Media
              </label>
              <input
                type="text"
                value={formData.social_media}
                onChange={(e) => setFormData({ ...formData, social_media: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <h3 className="font-medium text-lg text-gray-700 border-b pb-2 mt-8">Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUploadField 
              label="NIC Proof" 
              documentKey="nic_proof" 
              error={errors.nic_proof} 
            />
            
            <FileUploadField 
              label="Date of Birth Proof" 
              documentKey="dob_proof" 
              error={errors.dob_proof} 
            />
            
            <FileUploadField 
              label="Business Registration Proof" 
              documentKey="business_registration_proof" 
              error={errors.business_registration_proof} 
            />
            
            <FileUploadField 
              label="SVAT Proof" 
              documentKey="svat_proof" 
              error={errors.svat_proof} 
            />
            
            <FileUploadField 
              label="VAT Proof" 
              documentKey="vat_proof" 
              error={errors.vat_proof} 
            />
          </div>

          <h3 className="font-medium text-lg text-gray-700 border-b pb-2 mt-8">Policy Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUploadField 
              label="Coverage Proof" 
              documentKey="coverage_proof" 
              error={errors.coverage_proof} 
            />
            
            <FileUploadField 
              label="Sum Insured Proof" 
              documentKey="sum_insured_proof" 
              error={errors.sum_insured_proof} 
            />
            
            <FileUploadField 
              label="Policy Fee Invoice" 
              documentKey="policy_fee_invoice" 
              error={errors.policy_fee_invoice} 
            />
            
            <FileUploadField 
              label="VAT Debit Note" 
              documentKey="vat_debit_note" 
              error={errors.vat_debit_note} 
            />
            
            <FileUploadField 
              label="Payment Receipt" 
              documentKey="payment_receipt" 
              error={errors.payment_receipt} 
            />
          </div>

          <h3 className="font-medium text-lg text-gray-700 border-b pb-2 mt-8">Policy Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Policy Type
              </label>
              <input
                type="text"
                value={formData.policy_type}
                onChange={(e) => setFormData({ ...formData, policy_type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Policy Number *
              </label>
              <input
                type="text"
                value={formData.policy_no}
                onChange={(e) => setFormData({ ...formData, policy_no: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.policy_no ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.policy_no && (
                <p className="mt-1 text-sm text-red-600">{errors.policy_no}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Policy Period From *
              </label>
              <input
                type="date"
                value={formData.policy_period_from}
                onChange={(e) => setFormData({ ...formData, policy_period_from: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.policy_period_from ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.policy_period_from && (
                <p className="mt-1 text-sm text-red-600">{errors.policy_period_from}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Policy Period To *
              </label>
              <input
                type="date"
                value={formData.policy_period_to}
                onChange={(e) => setFormData({ ...formData, policy_period_to: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.policy_period_to ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.policy_period_to && (
                <p className="mt-1 text-sm text-red-600">{errors.policy_period_to}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coverage
              </label>
              <input
                type="text"
                value={formData.coverage}
                onChange={(e) => setFormData({ ...formData, coverage: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sum Insured
              </label>
              <input
                type="number"
                value={formData.sum_insured}
                onChange={(e) => setFormData({ ...formData, sum_insured: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <h3 className="font-medium text-lg text-gray-700 border-b pb-2 mt-8">Premium Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Basic Premium
              </label>
              <input
                type="number"
                value={formData.basic_premium}
                onChange={(e) => setFormData({ ...formData, basic_premium: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SRCC Premium
              </label>
              <input
                type="number"
                value={formData.srcc_premium}
                onChange={(e) => setFormData({ ...formData, srcc_premium: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                TC Premium
              </label>
              <input
                type="number"
                value={formData.tc_premium}
                onChange={(e) => setFormData({ ...formData, tc_premium: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Net Premium
              </label>
              <input
                type="number"
                value={formData.net_premium}
                onChange={(e) => setFormData({ ...formData, net_premium: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stamp Duty
              </label>
              <input
                type="number"
                value={formData.stamp_duty}
                onChange={(e) => setFormData({ ...formData, stamp_duty: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Fees
              </label>
              <input
                type="number"
                value={formData.admin_fees}
                onChange={(e) => setFormData({ ...formData, admin_fees: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Road Safety Fee
              </label>
              <input
                type="number"
                value={formData.road_safety_fee}
                onChange={(e) => setFormData({ ...formData, road_safety_fee: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Policy Fee
              </label>
              <input
                type="number"
                value={formData.policy_fee}
                onChange={(e) => setFormData({ ...formData, policy_fee: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                VAT Fee
              </label>
              <input
                type="number"
                value={formData.vat_fee}
                onChange={(e) => setFormData({ ...formData, vat_fee: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Invoice
              </label>
              <input
                type="number"
                value={formData.total_invoice}
                onChange={(e) => setFormData({ ...formData, total_invoice: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <h3 className="font-medium text-lg text-gray-700 border-b pb-2 mt-8">Commission Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commission Type
              </label>
              <select
                value={formData.commission_type}
                onChange={(e) => setFormData({ ...formData, commission_type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select Commission Type</option>
                <option value="Percentage">Percentage</option>
                <option value="Fixed">Fixed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commission Basic
              </label>
              <input
                type="number"
                value={formData.commission_basic}
                onChange={(e) => setFormData({ ...formData, commission_basic: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commission SRCC
              </label>
              <input
                type="number"
                value={formData.commission_srcc}
                onChange={(e) => setFormData({ ...formData, commission_srcc: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commission TC
              </label>
              <input
                type="number"
                value={formData.commission_tc}
                onChange={(e) => setFormData({ ...formData, commission_tc: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-8">
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