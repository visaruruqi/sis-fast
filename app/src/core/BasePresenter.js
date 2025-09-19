import { makeObservable, computed, action } from 'mobx'

/**
 * BasePresenter - Abstract base class for all presenters
 * Provides only the most generic functionality: repository state access
 */
export class BasePresenter {
  constructor(repository) {
    this.repository = repository
    makeObservable(this, {
      isLoading: computed,
      error: computed,
      refresh: action
    })
  }

  /**
   * Get loading state from repository
   * @returns {boolean} Loading state
   */
  get isLoading() {
    return this.repository.isLoading
  }

  /**
   * Get error state from repository
   * @returns {string|null} Error message or null
   */
  get error() {
    return this.repository.error
  }

  /**
   * Refresh data from repository
   */
  async refresh() {
    if (this.repository.load) {
      await this.repository.load()
    }
  }
}
