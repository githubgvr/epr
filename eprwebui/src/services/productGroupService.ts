import { ProductGroup } from '../types/product';

const API_BASE_URL = 'http://localhost:8080/api';

export interface ProductGroupFormData {
  productGroupName: string;
  description?: string;
  groupCode?: string;
  sortOrder?: number;
}

class ProductGroupService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return response.text() as unknown as T;
  }

  async getAllProductGroups(token?: string): Promise<ProductGroup[]> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/product-groups`, {
      method: 'GET',
      headers,
    });

    return this.handleResponse<ProductGroup[]>(response);
  }

  async getProductGroupById(id: number, token?: string): Promise<ProductGroup> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/product-groups/${id}`, {
      method: 'GET',
      headers,
    });

    return this.handleResponse<ProductGroup>(response);
  }

  async createProductGroup(productGroup: ProductGroupFormData, token?: string): Promise<ProductGroup> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/product-groups`, {
      method: 'POST',
      headers,
      body: JSON.stringify(productGroup),
    });

    return this.handleResponse<ProductGroup>(response);
  }

  async updateProductGroup(id: number, productGroup: ProductGroupFormData, token?: string): Promise<ProductGroup> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/product-groups/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(productGroup),
    });

    return this.handleResponse<ProductGroup>(response);
  }

  async deleteProductGroup(id: number, token?: string): Promise<void> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/product-groups/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
  }

  async searchProductGroups(query: string, token?: string): Promise<ProductGroup[]> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/product-groups/search?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers,
    });

    return this.handleResponse<ProductGroup[]>(response);
  }

  async getActiveProductGroups(token?: string): Promise<ProductGroup[]> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/product-groups/active`, {
      method: 'GET',
      headers,
    });

    return this.handleResponse<ProductGroup[]>(response);
  }
}

export const productGroupService = new ProductGroupService();
export default productGroupService;
