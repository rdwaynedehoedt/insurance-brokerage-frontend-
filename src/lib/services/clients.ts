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
  nic_proof?: string;
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

  async createClient(clientData: Client): Promise<string> {
    try {
      console.log('Creating client with data:', JSON.stringify(clientData, null, 2));
      
      // Create a clean copy of the data
      const cleanedData = { ...clientData };
      
      // Make sure sales_rep_id is a number if present
      if (cleanedData.salesRep && !cleanedData.sales_rep_id) {
        cleanedData.sales_rep_id = parseInt(cleanedData.salesRep);
      }
      
      // Remove salesRep field as it's not in the database
      delete cleanedData.salesRep;
      
      // Ensure we're not sending an empty ID
      if (!cleanedData.id || cleanedData.id === '') {
        delete cleanedData.id;
      }
      
      const response = await apiClient.post<ApiResponse<{id: string}>>('/clients', cleanedData);
      console.log('Create client response:', JSON.stringify(response.data, null, 2));
      return response.data.data.id;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },

  async updateClient(id: string, clientData: Partial<Client>): Promise<void> {
    try {
      console.log(`Updating client ${id} with data:`, JSON.stringify(clientData, null, 2));
      
      // Create a clean copy of the data
      const cleanedData = { ...clientData };
      
      // Make sure sales_rep_id is a number if present
      if (cleanedData.salesRep && !cleanedData.sales_rep_id) {
        cleanedData.sales_rep_id = parseInt(cleanedData.salesRep);
      }
      
      // Remove salesRep field as it's not in the database
      delete cleanedData.salesRep;
      
      // Remove the id field from the update data (we're using it in the URL)
      delete cleanedData.id;
      
      await apiClient.put(`/clients/${id}`, cleanedData);
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