import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export interface Vendor {
  vendorId?: number;
  vendorName: string;
  vendorCode: string;
  vendorCapacityTonnes: number;
  assignedTasks: string;
  vendorPerformanceMetrics?: string;
  vendorCertificationStatus: 'VALID' | 'EXPIRED';
  vendorFeedback?: string;
  isActive?: boolean;
}

export interface VendorFormData {
  vendorName: string;
  vendorCode: string;
  vendorCapacityTonnes: number;
  assignedTasks: string;
  vendorPerformanceMetrics?: string;
  vendorCertificationStatus: 'VALID' | 'EXPIRED';
  vendorFeedback?: string;
}

class VendorService {
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  async getAllVendors(): Promise<Vendor[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/vendors`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching vendors:', error);
      throw new Error('Failed to fetch vendors');
    }
  }

  async getVendorById(vendorId: number): Promise<Vendor> {
    try {
      const response = await axios.get(`${API_BASE_URL}/vendors/${vendorId}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching vendor:', error);
      throw new Error('Failed to fetch vendor');
    }
  }

  async getVendorByCode(vendorCode: string): Promise<Vendor> {
    try {
      const response = await axios.get(`${API_BASE_URL}/vendors/code/${vendorCode}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching vendor by code:', error);
      throw new Error('Failed to fetch vendor by code');
    }
  }

  async searchVendors(name: string): Promise<Vendor[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/vendors/search`, {
        params: { name },
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error searching vendors:', error);
      throw new Error('Failed to search vendors');
    }
  }

  async getVendorsByCertificationStatus(status: 'VALID' | 'EXPIRED'): Promise<Vendor[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/vendors/certification/${status}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching vendors by certification status:', error);
      throw new Error('Failed to fetch vendors by certification status');
    }
  }

  async createVendor(vendorData: VendorFormData): Promise<Vendor> {
    try {
      const response = await axios.post(`${API_BASE_URL}/vendors`, vendorData, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating vendor:', error);
      throw new Error('Failed to create vendor');
    }
  }

  async updateVendor(vendorId: number, vendorData: VendorFormData): Promise<Vendor> {
    try {
      const response = await axios.put(`${API_BASE_URL}/vendors/${vendorId}`, vendorData, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating vendor:', error);
      throw new Error('Failed to update vendor');
    }
  }

  async deleteVendor(vendorId: number): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/vendors/${vendorId}`, {
        headers: this.getAuthHeaders()
      });
    } catch (error) {
      console.error('Error deleting vendor:', error);
      throw new Error('Failed to delete vendor');
    }
  }

  async checkVendorCodeExists(vendorCode: string): Promise<boolean> {
    try {
      const response = await axios.get(`${API_BASE_URL}/vendors/exists/code/${vendorCode}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error checking vendor code:', error);
      return false;
    }
  }

  async checkVendorNameExists(vendorName: string): Promise<boolean> {
    try {
      const response = await axios.get(`${API_BASE_URL}/vendors/exists/name/${vendorName}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error checking vendor name:', error);
      return false;
    }
  }
}

export default new VendorService();
