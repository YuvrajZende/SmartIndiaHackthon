// API service for Ocean LLM backend communication

const API_BASE_URL = 'http://localhost:8000'

export interface ChatMessage {
  message: string
  region_key?: string
}

export interface ChatResponse {
  response: string
  region: string
}

export interface VisualizationResponse {
  summary: any
  model_metrics: any
  visualizations: {
    geo_map: string
    depth_profile: string
    time_series: string
    scatter_3d: string
  }
}

export interface ModelLoadResponse {
  status: 'loaded' | 'already_loaded'
  message: string
  region: string
  summary?: any
  model_metrics?: any
}

export interface ModelStatus {
  name: string
  loaded: boolean
  summary?: any
}

export interface ModelStatusResponse {
  model_status: Record<string, ModelStatus>
}

export interface ApiError {
  detail: string
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData: ApiError = await response.json()
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  async sendMessage(message: string, regionKey: string = 'arabian_sea'): Promise<ChatResponse> {
    return this.request<ChatResponse>('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        region_key: regionKey
      })
    })
  }

  async getRegions(): Promise<{ regions: Record<string, string> }> {
    return this.request<{ regions: Record<string, string> }>('/api/regions')
  }

  async analyzeRegion(regionKey: string): Promise<VisualizationResponse> {
    return this.request<VisualizationResponse>('/api/analyze', {
      method: 'POST',
      body: JSON.stringify({
        region_key: regionKey
      })
    })
  }

  async getVisualizations(regionKey: string): Promise<VisualizationResponse> {
    return this.request<VisualizationResponse>('/api/visualizations', {
      method: 'POST',
      body: JSON.stringify({
        region_key: regionKey
      })
    })
  }

  async getPrediction(
    regionKey: string,
    lat: number,
    lon: number,
    depth: number,
    month: number
  ): Promise<any> {
    return this.request('/api/predict', {
      method: 'POST',
      body: JSON.stringify({
        region_key: regionKey,
        lat,
        lon,
        depth,
        month
      })
    })
  }

  async getFishingAdvice(
    regionKey: string,
    lat: number,
    lon: number,
    month: number
  ): Promise<{ advice: string }> {
    return this.request<{ advice: string }>('/api/fishing_advice', {
      method: 'POST',
      body: JSON.stringify({
        region_key: regionKey,
        lat,
        lon,
        month
      })
    })
  }

  async healthCheck(): Promise<{ status: string; api_key_set: boolean }> {
    return this.request<{ status: string; api_key_set: boolean }>('/health')
  }

  async loadModels(regionKey: string): Promise<ModelLoadResponse> {
    return this.request<ModelLoadResponse>('/api/load_models', {
      method: 'POST',
      body: JSON.stringify({
        region_key: regionKey
      })
    })
  }

  async getModelStatus(): Promise<ModelStatusResponse> {
    return this.request<ModelStatusResponse>('/api/model_status')
  }
}

export const apiService = new ApiService()