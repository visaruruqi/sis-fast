import { makeObservable, computed, action, observable, override } from 'mobx'
import { BasePresenter } from '../../../core/BasePresenter.js'
import { STATUS } from '../../../core/constants.js'

export default class StudentsPresenter extends BasePresenter {
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
      archive: action,
      refresh: override
    })
  }

  // Observable computed property that reacts to repository changes
  get filtered() {
    if (!this.search) {
      return this.repository.activeStudents
    }
    return this.repository.searchStudents(this.search).filter(s => s.status === STATUS.ACTIVE)
  }

  // Search functionality specific to this presenter
  setSearch(searchTerm) {
    this.search = searchTerm
  }

  clearSearch() {
    this.search = ''
  }

  // Open modal for adding/editing student
  openModal(student = null) {
    this.selected = student ? { ...student } : null
    this.modalOpen = true
  }

  // Close modal and reset state
  closeModal() {
    this.modalOpen = false
    this.selected = null
  }

  // Save student (create or update)
  async save(studentData) {
    try {
      await this.repository.save(studentData)
      this.closeModal()
    } catch (error) {
      console.error('Failed to save student:', error)
      // Error is already handled in repository
    }
  }

  // Archive student
  async archive(student) {
    try {
      await this.repository.archive(student.id)
    } catch (error) {
      console.error('Failed to archive student:', error)
      // Error is already handled in repository
    }
  }

  // Refresh students from repository
  async refresh() {
    await this.repository.loadStudents()
  }
}
