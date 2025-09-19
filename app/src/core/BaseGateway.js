/**
 * BaseGateway - Abstract base class for all gateways
 * Provides common functionality for API communication
 * Following Fast Test Architecture pattern
 */
export class BaseGateway {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl
  }

  /**
   * Make an HTTP request with common error handling
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<any>} Response data
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }

    try {
      const response = await fetch(url, { ...defaultOptions, ...options })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Gateway request failed for ${endpoint}:`, error)
      throw error
    }
  }

  /**
   * GET request helper
   * @param {string} endpoint - API endpoint
   * @returns {Promise<any>} Response data
   */
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' })
  }

  /**
   * POST request helper
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @returns {Promise<any>} Response data
   */
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  /**
   * PUT request helper
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @returns {Promise<any>} Response data
   */
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  /**
   * DELETE request helper
   * @param {string} endpoint - API endpoint
   * @returns {Promise<any>} Response data
   */
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }

  /**
   * Simulate API delay for testing purposes
   * @param {number} ms - Delay in milliseconds
   * @returns {Promise<void>}
   */
  async simulateDelay(ms = 100) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Generate a unique ID for new entities
   * @param {string} prefix - ID prefix
   * @returns {string} Unique ID
   */
  generateId(prefix = 'id') {
    return prefix + Math.random().toString().slice(2, 8)
  }
}
