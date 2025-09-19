import { makeAutoObservable } from 'mobx'

export default class StudentsPresenter {
  search = ''
  selected = null
  modalOpen = false

  constructor(repository) {
    this.repository = repository
    makeAutoObservable(this, {}, { autoBind: true })
  }

  // Observable computed property that reacts to repository changes
  get filtered() {
    if (!this.search) {
      return this.repository.activeStudents
    }
    return this.repository.searchStudents(this.search).filter(s => s.status === 'Active')
  }

  // Observable computed property for loading state
  get isLoading() {
    return this.repository.isLoading
  }

  // Observable computed property for error state
  get error() {
    return this.repository.error
  }

  // Open modal for adding/editing student
  openModal(student = null) {
    this.selected = student ? { ...student } : null
    this.modalOpen = true
  }

  // Close modal
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
