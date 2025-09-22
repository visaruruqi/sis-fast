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
    Guard.Against.NullOrWhiteSpace(course.instructorId, 'instructorId')
    Guard.Against.NullOrUndefined(course.credits, 'credits')

    return this.executeWithLoading(async () => {
      if (course.id) {
        // Update existing course
        const updatedCourse = await this.gateway.updateCourse(course)
        const idx = this.courses.findIndex(c => c.id === course.id)
        if (idx !== -1) {
          this.courses[idx] = updatedCourse
        }
      } else {
        // Create new course
        const newCourse = await this.gateway.createCourse(course)
        this.courses.push(newCourse)
      }
    })
  }

  // Delete course
  async delete(id) {
    return this.executeWithLoading(async () => {
      await this.gateway.deleteCourse(id)
      this.courses = this.courses.filter(c => c.id !== id)
    })
  }

  // Search courses
  searchCourses(query) {
    if (!query) return this.courses
    
    const lowerQuery = query.toLowerCase()
    return this.courses.filter(course => 
      course.name.toLowerCase().includes(lowerQuery) ||
      course.code.toLowerCase().includes(lowerQuery)
      // Note: We can't search by instructor name here since we only have instructorId
      // In a real app, you might want to join with instructor data for search
    )
  }

  // Get course with instructor name (for display purposes)
  getCourseWithInstructorName(course, instructorRepository) {
    if (!course || !instructorRepository) return course
    
    const instructor = instructorRepository.getInstructorById(course.instructorId)
    return {
      ...course,
      instructorName: instructor ? instructorRepository.getInstructorDisplayName(instructor) : 'Unknown Instructor'
    }
  }

  // Get all courses with instructor names
  getAllCoursesWithInstructorNames(instructorRepository) {
    return this.courses.map(course => this.getCourseWithInstructorName(course, instructorRepository))
  }
}
