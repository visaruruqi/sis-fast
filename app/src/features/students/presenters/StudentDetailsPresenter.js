import { makeAutoObservable } from 'mobx'

/**
 * StudentDetailsPresenter - Business logic for student details page
 * Following Fast Test Architecture pattern
 */
export default class StudentDetailsPresenter {
  studentId = null
  isLoading = false
  error = null

  constructor(studentRepository, enrollmentRepository, courseRepository) {
    this.studentRepository = studentRepository
    this.enrollmentRepository = enrollmentRepository
    this.courseRepository = courseRepository
    makeAutoObservable(this, {}, { autoBind: true })
  }

  /**
   * Initialize the presenter with a student ID
   * @param {string} studentId - Student ID
   */
  async initialize(studentId) {
    this.studentId = studentId
    this.isLoading = true
    this.error = null

    try {
      // Load enrollments and courses for this student
      await Promise.all([
        this.enrollmentRepository.loadEnrollments(),
        this.courseRepository.loadCourses()
      ])
    } catch (error) {
      this.error = error.message
      console.error('Failed to load student details:', error)
    } finally {
      this.isLoading = false
    }
  }

  /**
   * Get the current student
   * @returns {Object|null} Student object or null if not found
   */
  get student() {
    if (!this.studentId) return null
    return this.studentRepository.allStudents.find(s => s.id === this.studentId) || null
  }

  /**
   * Get enrollments for the current student
   * @returns {Array} Array of enrollments for the student
   */
  get studentEnrollments() {
    if (!this.studentId) return []
    return this.enrollmentRepository.allEnrollments.filter(e => e.studentId === this.studentId)
  }

  /**
   * Get course name by course ID
   * @param {string} courseId - Course ID
   * @returns {string} Course name or empty string if not found
   */
  getCourseName(courseId) {
    const course = this.courseRepository.courses.find(c => c.id === courseId)
    return course ? course.name : ''
  }

  /**
   * Enroll the student in a course
   * @param {Object} enrollmentData - Enrollment data
   */
  async enrollStudent(enrollmentData) {
    try {
      await this.enrollmentRepository.createEnrollment(enrollmentData)
    } catch (error) {
      this.error = error.message
      console.error('Failed to enroll student:', error)
      throw error
    }
  }

  /**
   * Refresh student data
   */
  async refresh() {
    if (this.studentId) {
      await this.initialize(this.studentId)
    }
  }
}
