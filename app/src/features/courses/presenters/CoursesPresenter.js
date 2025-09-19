import { makeObservable, computed, action, observable, override } from 'mobx'
import { BasePresenter } from '../../../core/BasePresenter.js'
import { PAGINATION } from '../../../core/constants.js'

export default class CoursesPresenter extends BasePresenter {
  search = ''
  selected = null
  modalOpen = false
  page = 1
  pageSize = PAGINATION.DEFAULT_PAGE_SIZE

  constructor(repository) {
    super(repository)
    makeObservable(this, {
      search: observable,
      selected: observable,
      modalOpen: observable,
      page: observable,
      pageSize: observable,
      filtered: computed,
      totalPages: computed,
      paginated: computed,
      setSearch: action,
      clearSearch: action,
      openModal: action,
      closeModal: action,
      save: action,
      delete: action,
      refresh: override
    })
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

  // Search functionality specific to this presenter
  setSearch(searchTerm) {
    this.search = searchTerm
    // Reset to first page when searching
    this.page = 1
  }

  clearSearch() {
    this.search = ''
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

  // Override base class refresh method with specific implementation
  async refresh() {
    await this.repository.loadCourses()
  }

}
