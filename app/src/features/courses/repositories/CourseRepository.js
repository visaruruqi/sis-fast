import { makeAutoObservable } from 'mobx'
import Guard from 'guardflow'

export default class CourseRepository {
  courses = []
  isLoading = false
  error = null

  constructor(gateway) {
    this.gateway = gateway
    makeAutoObservable(this, {}, { autoBind: true })
    this.loadCourses()
  }

  // Observable getter for all courses
  get allCourses() {
    return this.courses
  }

  // Load courses from gateway (API)
  async loadCourses() {
    this.isLoading = true
    this.error = null
    try {
      const courses = await this.gateway.fetchCourses()
      this.courses = courses
    } catch (error) {
      this.error = error.message
      console.error('Failed to load courses:', error)
    } finally {
      this.isLoading = false
    }
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

    this.isLoading = true
    this.error = null

    try {
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
    } catch (error) {
      this.error = error.message
      console.error('Failed to save course:', error)
    } finally {
      this.isLoading = false
    }
  }

  // Delete course
  async delete(id) {
    this.isLoading = true
    this.error = null

    try {
      this.courses = this.courses.filter(c => c.id !== id)
      // In real app, would call gateway.deleteCourse(id)
    } catch (error) {
      this.error = error.message
      console.error('Failed to delete course:', error)
    } finally {
      this.isLoading = false
    }
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
