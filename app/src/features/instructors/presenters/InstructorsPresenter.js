import { makeObservable, computed, action, observable, override } from 'mobx'
import { BasePresenter } from '../../../core/BasePresenter.js'

export default class InstructorsPresenter extends BasePresenter {
  search = ''
  selected = null
  modalOpen = false

  constructor(repository) {
    super(repository)
    makeObservable(this, {
      search: observable,
      selected: observable,
      modalOpen: observable,
      filtered: computed,
      setSearch: action,
      clearSearch: action,
      openModal: action,
      closeModal: action,
      save: action,
      delete: action,
      archive: action,
      refresh: override
    })
  }

  // Get filtered instructors based on search (only active instructors)
  get filtered() {
    if (!this.search) {
      return this.repository.activeInstructors
    }
    return this.repository.searchInstructors(this.search).filter(i => i.status === 'Active')
  }

  // Search functionality
  setSearch(searchTerm) {
    this.search = searchTerm
  }

  clearSearch() {
    this.search = ''
  }

  // Modal management
  openModal(instructor = null) {
    this.selected = instructor ? { ...instructor } : null
    this.modalOpen = true
  }

  closeModal() {
    this.modalOpen = false
    this.selected = null
  }

  // Save instructor (create or update)
  async save(instructorData) {
    try {
      await this.repository.save(instructorData)
      this.closeModal()
    } catch (error) {
      console.error('Failed to save instructor:', error)
    }
  }

  // Delete instructor (only if no courses assigned)
  async delete(instructor) {
    try {
      await this.repository.delete(instructor.id)
    } catch (error) {
      console.error('Failed to delete instructor:', error)
      // Re-throw the error so the UI can show the message
      throw error
    }
  }

  // Archive instructor (when instructor has courses assigned)
  async archive(instructor) {
    try {
      await this.repository.archive(instructor.id)
    } catch (error) {
      console.error('Failed to archive instructor:', error)
    }
  }

  // Override base class refresh method with specific implementation
  async refresh() {
    await this.repository.loadInstructors()
  }
}
