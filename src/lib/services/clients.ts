import axios from 'axios';
import { authService } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Client {
  id?: string;
  introducer_code?: string;
  customer_type: string;
  product: string;
  policy_?: string;
  insurance_provider: string;
  branch?: string;
  client_name: string;
  street1?: string;
  street2?: string;
  city?: string;
  district?: string;
  province?: string;
  telephone?: string;
  mobile_no: string;
  contact_person?: string;
  email?: string;
  social_media?: string;
  nic_proof?: string | File;
  dob_proof?: string;
  business_registration?: string;
  svat_proof?: string;
  vat_proof?: string;
  policy_type?: string;
  policy_no?: string;
  policy_period_from?: string;
  policy_period_to?: string;
  coverage?: string;
  sum_insured?: number;
  basic_premium?: number;
  srcc_premium?: number;
  tc_premium?: number;
  net_premium?: number;
  stamp_duty?: number;
  admin_fees?: number;
  road_safety_fee?: number;
  policy_fee?: number;
  vat_fee?: number;
  total_invoice?: number;
  debit_note?: string;
  payment_receipt?: string;
  commission_type?: string;
  commission_basic?: number;
  commission_srcc?: number;
  commission_tc?: number;
  sales_rep_id?: number;
  salesRep?: string;
  policies?: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const clientService = {
  async getAllClients(): Promise<Client[]> {
    try {
      const response = await apiClient.get<ApiResponse<Client[]>>('/clients');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  },

  async getClientById(id: string): Promise<Client> {
    try {
      const response = await apiClient.get<ApiResponse<Client>>(`/clients/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching client ${id}:`, error);
      throw error;
    }
  },

  async createClient(clientData: FormData): Promise<string> {
  try {
    const response = await apiClient.post('/clients', clientData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Response from backend:', response.data);

    const responseData = response.data as ApiResponse<{ id: string }>;
    if (!responseData || !responseData.data || !responseData.data.id) {
      throw new Error('Invalid response format: Missing id');
    }

    return responseData.data.id;
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
},

async updateClient(id: string, clientData: FormData): Promise<void> {
  try {
    await apiClient.put(`/clients/${id}`, clientData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.error(`Error updating client ${id}:`, error);
    throw error;
  }
},

  async deleteClient(id: string): Promise<void> {
    try {
      await apiClient.delete(`/clients/${id}`);
    } catch (error) {
      console.error(`Error deleting client ${id}:`, error);
      throw error;
    }
  },

  async searchClients(criteria: Partial<Client>): Promise<Client[]> {
    try {
      const response = await apiClient.post<ApiResponse<Client[]>>('/clients/search', criteria);
      return response.data.data;
    } catch (error) {
      console.error('Error searching clients:', error);
      throw error;
    }
  },

  async getClientsBySalesRep(salesRepId: number): Promise<Client[]> {
    try {
      const response = await apiClient.get<ApiResponse<Client[]>>(`/clients/sales-rep/${salesRepId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching clients for sales rep ${salesRepId}:`, error);
      throw error;
    }
  }
}; 