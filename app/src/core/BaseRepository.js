import { makeObservable, observable, action } from 'mobx'

/**
 * BaseRepository - Abstract base class for all repositories
 * Provides common functionality for loading states, error handling, and MobX setup
 */
export class BaseRepository {
  isLoading = false
  error = null

  constructor(gateway) {
    this.gateway = gateway
    makeObservable(this, {
      isLoading: observable,
      error: observable,
      executeWithLoading: action,
      clearError: action,
      setError: action
    })
  }

  /**
   * Execute an async operation with loading state management
   * @param {Function} operation - The async operation to execute
   * @returns {Promise} The result of the operation
   */
  async executeWithLoading(operation) {
    this.isLoading = true
    this.error = null
    
    try {
      return await operation()
    } catch (error) {
      this.error = error.message || 'An unexpected error occurred'
      console.error('Repository operation failed:', error)
      throw error
    } finally {
      this.isLoading = false
    }
  }

  /**
   * Clear the current error state
   */
  clearError() {
    this.error = null
  }

  /**
   * Set a custom error message
   * @param {string} message - Error message to set
   */
  setError(message) {
    this.error = message
  }
}
