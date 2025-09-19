import { makeAutoObservable } from 'mobx'

export default class CoursesPresenter {
  search = ''
  selected = null
  modalOpen = false
  page = 1
  pageSize = 10

  constructor(repository) {
    this.repository = repository
    makeAutoObservable(this, {}, { autoBind: true })
  }

  // Observable computed property that reacts to repository changes
  get filtered() {
    if (!this.search) {
      return this.repository.allCourses
    }
    return this.repository.searchCourses(this.search)
  }

  get totalPages() {
    return Math.ceil(this.filtered.length / this.pageSize)
  }

  get paginated() {
    const start = (this.page - 1) * this.pageSize
    return this.filtered.slice(start, start + this.pageSize)
  }

  // Observable computed property for loading state
  get isLoading() {
    return this.repository.isLoading
  }

  // Observable computed property for error state
  get error() {
    return this.repository.error
  }

  openModal(course = null) {
    this.selected = course ? { ...course } : null
    this.modalOpen = true
  }

  closeModal() {
    this.modalOpen = false
    this.selected = null
  }

  async save(courseData) {
    try {
      await this.repository.save(courseData)
      this.closeModal()
    } catch (error) {
      console.error('Failed to save course:', error)
      // Error is already handled in repository
    }
  }

  async delete(course) {
    try {
      await this.repository.delete(course.id)
    } catch (error) {
      console.error('Failed to delete course:', error)
      // Error is already handled in repository
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++
    }
  }

  previousPage() {
    if (this.page > 1) {
      this.page--
    }
  }

  setSearch(value) {
    this.search = value
    // Reset to first page when searching
    this.page = 1
  }

  // Refresh courses from repository
  async refresh() {
    await this.repository.loadCourses()
  }
}
