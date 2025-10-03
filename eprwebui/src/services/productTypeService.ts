export interface ProductType {
  productTypeId: number;
  productTypeName: string;
  productTypeDescription?: string;
  sortOrder?: number;
  productCategoryId?: number;
  productCategory?: {
    productCategoryId: number;
    productCategoryName: string;
    description?: string;
    productGroupId?: number;
    productGroup?: {
      productGroupId: number;
      productGroupName: string;
      description?: string;
    };
  };
  isActive: boolean;
}

export interface CreateProductTypeRequest {
  productTypeName: string;
  productTypeDescription?: string;
  sortOrder?: number;
  productCategoryId?: number;
}

export interface UpdateProductTypeRequest extends CreateProductTypeRequest {
  productTypeId: number;
}

const API_BASE_URL = 'http://localhost:8080/api';

class ProductTypeService {
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

  async getAllProductTypes(token?: string): Promise<ProductType[]> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/product-types`, {
      method: 'GET',
      headers,
    });

    return this.handleResponse<ProductType[]>(response);
  }

  async getProductTypeById(id: number, token?: string): Promise<ProductType> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/product-types/${id}`, {
      method: 'GET',
      headers,
    });

    return this.handleResponse<ProductType>(response);
  }

  async createProductType(productType: CreateProductTypeRequest, token?: string): Promise<ProductType> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/product-types`, {
      method: 'POST',
      headers,
      body: JSON.stringify(productType),
    });

    return this.handleResponse<ProductType>(response);
  }

  async updateProductType(id: number, productType: CreateProductTypeRequest, token?: string): Promise<ProductType> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/product-types/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(productType),
    });

    return this.handleResponse<ProductType>(response);
  }

  async deleteProductType(id: number, token?: string): Promise<void> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/product-types/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
  }

  async restoreProductType(id: number, token?: string): Promise<ProductType> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/product-types/${id}/restore`, {
      method: 'PUT',
      headers,
    });

    return this.handleResponse<ProductType>(response);
  }

  async searchProductTypes(query: string, token?: string): Promise<ProductType[]> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/product-types/search?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers,
    });

    return this.handleResponse<ProductType[]>(response);
  }

  async checkProductTypeExists(name: string, token?: string): Promise<boolean> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/product-types/exists?name=${encodeURIComponent(name)}`, {
      method: 'GET',
      headers,
    });

    return this.handleResponse<boolean>(response);
  }

  async getActiveProductTypeCount(token?: string): Promise<number> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/product-types/count`, {
      method: 'GET',
      headers,
    });

    return this.handleResponse<number>(response);
  }
}

export const productTypeService = new ProductTypeService();
export default productTypeService;
