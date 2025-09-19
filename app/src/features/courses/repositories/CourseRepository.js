import { makeObservable, observable, action, computed } from 'mobx'
import Guard from 'guardflow'
import { BaseRepository } from '../../../core/BaseRepository.js'

export default class CourseRepository extends BaseRepository {
  courses = []

  constructor(gateway) {
    super(gateway)
    makeObservable(this, {
      courses: observable,
      allCourses: computed,
      loadCourses: action,
      save: action,
      delete: action
    })
    this.loadCourses()
  }

  // Observable getter for all courses
  get allCourses() {
    return this.courses
  }

  // Load courses from gateway (API)
  async loadCourses() {
    return this.executeWithLoading(async () => {
      this.courses = await this.gateway.fetchCourses()
    })
  }

  // Get course by ID
  getById(id) {
    return this.courses.find(c => c.id === id)
  }

  // Save course (create or update)
  async save(course) {
    Guard.Against.NullOrWhiteSpace(course.name, 'name')
    Guard.Against.NullOrWhiteSpace(course.code, 'code')
    Guard.Against.NullOrWhiteSpace(course.instructor, 'instructor')
    Guard.Against.NullOrUndefined(course.credits, 'credits')

    return this.executeWithLoading(async () => {
      if (course.id) {
        // Update existing course
        const idx = this.courses.findIndex(c => c.id === course.id)
        if (idx !== -1) {
          this.courses[idx] = course
          // In real app, would call gateway.updateCourse(course)
        }
      } else {
        // Create new course
        course.id = 'crs' + Math.random().toString().slice(2, 8)
        this.courses.push(course)
        // In real app, would call gateway.createCourse(course)
      }
    })
  }

  // Delete course
  async delete(id) {
    return this.executeWithLoading(async () => {
      this.courses = this.courses.filter(c => c.id !== id)
      // In real app, would call gateway.deleteCourse(id)
    })
  }

  // Search courses
  searchCourses(query) {
    if (!query) return this.courses
    
    const lowerQuery = query.toLowerCase()
    return this.courses.filter(course => 
      course.name.toLowerCase().includes(lowerQuery) ||
      course.code.toLowerCase().includes(lowerQuery) ||
      course.instructor.toLowerCase().includes(lowerQuery)
    )
  }
}
