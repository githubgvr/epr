interface Material {
  materialId?: number;
  materialCode: string;
  materialName: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
  createdDate?: string;
  updatedDate?: string;
}

class MaterialService {
  private baseURL = 'http://localhost:8080/api/materials';

  async getAllMaterials(): Promise<Material[]> {
    const response = await fetch(this.baseURL);
    if (!response.ok) {
      throw new Error('Failed to fetch materials');
    }
    return response.json();
  }

  async getMaterialById(id: number): Promise<Material> {
    const response = await fetch(`${this.baseURL}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch material');
    }
    return response.json();
  }

  async createMaterial(material: Material): Promise<Material> {
    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(material),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to create material');
    }
    
    return response.json();
  }

  async updateMaterial(id: number, material: Material): Promise<Material> {
    const response = await fetch(`${this.baseURL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(material),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to update material');
    }
    
    return response.json();
  }

  async deleteMaterial(id: number): Promise<void> {
    const response = await fetch(`${this.baseURL}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to delete material');
    }
  }

  async searchMaterials(query: string): Promise<Material[]> {
    const response = await fetch(`${this.baseURL}/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search materials');
    }
    return response.json();
  }

  async getMaterialsByActiveStatus(isActive: boolean): Promise<Material[]> {
    const response = await fetch(`${this.baseURL}/active/${isActive}`);
    if (!response.ok) {
      throw new Error('Failed to fetch materials by status');
    }
    return response.json();
  }

  async countActiveMaterials(): Promise<number> {
    const response = await fetch(`${this.baseURL}/count/active`);
    if (!response.ok) {
      throw new Error('Failed to count active materials');
    }
    return response.json();
  }
}

export default new MaterialService();
