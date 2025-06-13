const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  statusCode?: number;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`API Request: ${config.method || 'GET'} ${url}`, config.body ? JSON.parse(config.body as string) : '');
      
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage += ` - ${errorData.message || errorData.error || errorText}`;
        } catch {
          errorMessage += ` - ${errorText}`;
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json() as T;
      console.log(`API Response: ${config.method || 'GET'} ${url}`, result);
      return result;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Health check
  async getHealth(): Promise<{
    status: string;
    timestamp: string;
    uptime: number;
    database: string;
    environment: string;
  }> {
    return this.request('/health');
  }

  // Users API
  async getUsers(): Promise<any[]> {
    return this.request('/users');
  }

  async getUserById(id: string): Promise<any> {
    return this.request(`/users/${id}`);
  }

  async createUser(userData: any): Promise<any> {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: any): Promise<any> {
    return this.request(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<any> {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Products API
  async getProducts(): Promise<any[]> {
    return this.request('/products');
  }

  async getProductById(id: string): Promise<any> {
    return this.request(`/products/${id}`);
  }

  async createProduct(productData: any): Promise<any> {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: any): Promise<any> {
    return this.request(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string): Promise<any> {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Auctions API
  async getAuctions(): Promise<any[]> {
    return this.request('/auctions');
  }

  async getAuctionById(id: string): Promise<any> {
    return this.request(`/auctions/${id}`);
  }

  async createAuction(auctionData: any): Promise<any> {
    return this.request('/auctions', {
      method: 'POST',
      body: JSON.stringify(auctionData),
    });
  }

  async updateAuction(id: string, auctionData: any): Promise<any> {
    return this.request(`/auctions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(auctionData),
    });
  }

  async deleteAuction(id: string): Promise<any> {
    return this.request(`/auctions/${id}`, {
      method: 'DELETE',
    });
  }

  // Contracts API
  async getContracts(): Promise<any[]> {
    return this.request('/contracts');
  }

  async getContractById(id: string): Promise<any> {
    return this.request(`/contracts/${id}`);
  }

  async createContract(contractData: any): Promise<any> {
    return this.request('/contracts', {
      method: 'POST',
      body: JSON.stringify(contractData),
    });
  }

  async updateContract(id: string, contractData: any): Promise<any> {
    return this.request(`/contracts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contractData),
    });
  }

  async deleteContract(id: string): Promise<any> {
    return this.request(`/contracts/${id}`, {
      method: 'DELETE',
    });
  }

  // Auth API
  async login(email: string, password: string): Promise<any> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: any): Promise<any> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<any> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Storage API
  async uploadFile(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.request('/storage/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it
    });
  }

  async deleteFile(fileId: string): Promise<any> {
    return this.request(`/storage/${fileId}`, {
      method: 'DELETE',
    });
  }

  // Chat API
  async getChatStatus(): Promise<any> {
    return this.request('/chat/status');
  }

  async sendMessage(message: string, context?: any): Promise<any> {
    return this.request('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    });
  }
}

export const apiClient = new ApiClient(); 