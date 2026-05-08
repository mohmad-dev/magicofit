const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''

function rewriteLocalhostUrls<T>(value: T, backendUrl: string): T {
  const replace = (input: string) => input.replace(/^http:\/\/localhost:9000\b/i, backendUrl)

  if (typeof value === "string") {
    return replace(value) as unknown as T
  }

  if (Array.isArray(value)) {
    return value.map((v) => rewriteLocalhostUrls(v, backendUrl)) as unknown as T
  }

  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>
    const out: Record<string, unknown> = {}

    for (const [k, v] of Object.entries(obj)) {
      out[k] = rewriteLocalhostUrls(v, backendUrl)
    }

    return out as T
  }

  return value
}

class MedusaClient {
  private baseUrl: string
  private publishableKey: string

  constructor() {
    this.baseUrl = MEDUSA_BACKEND_URL
    this.publishableKey = PUBLISHABLE_API_KEY
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    }

    if (this.publishableKey) {
      headers['x-publishable-api-key'] = this.publishableKey
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`
        try {
          const error = await response.json()
          errorMessage = error.message || error.error?.message || error.type || `HTTP ${response.status}: ${response.statusText}`
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      return await response.json()
    } catch (error) {
      if (process.env.NEXT_PHASE === "phase-production-build" || (error instanceof TypeError && error.message.includes('fetch'))) {
        console.warn(`Backend unavailable or fetch failed at ${this.baseUrl} during ${process.env.NEXT_PHASE || 'request'}`)
        return { products: [], count: 0, product_categories: [], regions: [], collections: [] } as any
      }
      throw error
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    const data = await this.request<T>(endpoint, { method: 'GET' })
    return rewriteLocalhostUrls(data, this.baseUrl)
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    const res = await this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    })
    return rewriteLocalhostUrls(res, this.baseUrl)
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const res = await this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return rewriteLocalhostUrls(res, this.baseUrl)
  }

  async delete<T>(endpoint: string): Promise<T> {
    const res = await this.request<T>(endpoint, { method: 'DELETE' })
    return rewriteLocalhostUrls(res, this.baseUrl)
  }
}

export const medusaClient = new MedusaClient()
