import { makeObservable, observable, action, computed, override } from 'mobx'
import { BasePresenter } from '../../../core/BasePresenter.js'

/**
 * StudentDetailsPresenter - Business logic for student details page
 * Following Fast Test Architecture pattern
 */
export default class StudentDetailsPresenter extends BasePresenter {
  studentId = null

  constructor(studentRepository, enrollmentRepository, courseRepository) {
    super(studentRepository) // Use studentRepository as the primary repository
    this.enrollmentRepository = enrollmentRepository
    this.courseRepository = courseRepository
    makeObservable(this, {
      studentId: observable,
      student: computed,
      studentEnrollments: computed,
      getCourseName: action,
      enrollStudent: action,
      refresh: override
    })
  }

  // Getter for backward compatibility with tests
  get studentRepository() {
    return this.repository
  }

  /**
   * Initialize the presenter with a student ID
   * @param {string} studentId - Student ID
   */
  async initialize(studentId) {
    this.studentId = studentId
    // Presenters don't have their own loading state - they use repository loading states
    try {
      // Load enrollments and courses for this student
      await Promise.all([
        this.enrollmentRepository.loadEnrollments(),
        this.courseRepository.loadCourses()
      ])
    } catch (error) {
      console.error('Failed to load student details:', error)
      throw error
    }
  }

  /**
   * Get the current student
   * @returns {Object|null} Student object or null if not found
   */
  get student() {
    if (!this.studentId) return null
    return this.repository.allStudents.find(s => s.id === this.studentId) || null
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
