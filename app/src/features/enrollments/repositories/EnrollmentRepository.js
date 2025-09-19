import { makeObservable, observable, action, computed } from 'mobx'
import { BaseRepository } from '../../../core/BaseRepository.js'

/**
 * EnrollmentRepository - Observable data store for enrollments
 * Following Fast Test Architecture pattern
 */
export default class EnrollmentRepository extends BaseRepository {
  enrollments = []

  constructor(gateway) {
    super(gateway)
    makeObservable(this, {
      enrollments: observable,
      allEnrollments: computed,
      loadEnrollments: action,
      createEnrollment: action,
      updateEnrollment: action,
      deleteEnrollment: action
    })
  }

  /**
   * Get all enrollments
   * @returns {Array} All enrollments
   */
  get allEnrollments() {
    return this.enrollments
  }

  /**
   * Get enrollments for a specific student
   * @param {string} studentId - Student ID
   * @returns {Array} Enrollments for the student
   */
  getEnrollmentsByStudent(studentId) {
    return this.enrollments.filter(enrollment => enrollment.studentId === studentId)
  }

  /**
   * Get enrollments for a specific course
   * @param {string} courseId - Course ID
   * @returns {Array} Enrollments for the course
   */
  getEnrollmentsByCourse(courseId) {
    return this.enrollments.filter(enrollment => enrollment.courseId === courseId)
  }

  /**
   * Get enrollment by ID
   * @param {string} id - Enrollment ID
   * @returns {Object|null} Enrollment or null if not found
   */
  getEnrollmentById(id) {
    return this.enrollments.find(enrollment => enrollment.id === id) || null
  }

  /**
   * Load all enrollments from the gateway
   */
  async loadEnrollments() {
    return this.executeWithLoading(async () => {
      this.enrollments = await this.gateway.getAllEnrollments()
    })
  }

  /**
   * Create a new enrollment
   * @param {Object} enrollmentData - Enrollment data
   * @returns {Promise<Object>} Created enrollment
   */
  async createEnrollment(enrollmentData) {
    return this.executeWithLoading(async () => {
      const newEnrollment = await this.gateway.createEnrollment(enrollmentData)
      this.enrollments.push(newEnrollment)
      return newEnrollment
    })
  }

  /**
   * Update an existing enrollment
   * @param {string} id - Enrollment ID
   * @param {Object} enrollmentData - Updated enrollment data
   * @returns {Promise<Object>} Updated enrollment
   */
  async updateEnrollment(id, enrollmentData) {
    return this.executeWithLoading(async () => {
      const updatedEnrollment = await this.gateway.updateEnrollment(id, enrollmentData)
      const index = this.enrollments.findIndex(enrollment => enrollment.id === id)
      if (index !== -1) {
        this.enrollments[index] = updatedEnrollment
      }
      return updatedEnrollment
    })
  }

  /**
   * Delete an enrollment
   * @param {string} id - Enrollment ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteEnrollment(id) {
    return this.executeWithLoading(async () => {
      const success = await this.gateway.deleteEnrollment(id)
      if (success) {
        this.enrollments = this.enrollments.filter(enrollment => enrollment.id !== id)
      }
      return success
    })
  }

  /**
   * Update enrollment grade
   * @param {string} id - Enrollment ID
   * @param {string} grade - New grade
   * @returns {Promise<Object>} Updated enrollment
   */
  async updateGrade(id, grade) {
    return this.updateEnrollment(id, { grade })
  }

  /**
   * Check if a student is already enrolled in a course for a specific semester
   * @param {string} studentId - Student ID
   * @param {string} courseId - Course ID
   * @param {string} semester - Semester
   * @returns {boolean} True if already enrolled
   */
  isStudentEnrolledInCourse(studentId, courseId, semester) {
    return this.enrollments.some(enrollment => 
      enrollment.studentId === studentId && 
      enrollment.courseId === courseId && 
      enrollment.semester === semester
    )
  }

  /**
   * Get enrollment statistics
   * @returns {Object} Enrollment statistics
   */
  get statistics() {
    const total = this.enrollments.length
    const withGrades = this.enrollments.filter(e => e.grade && e.grade !== '').length
    const withoutGrades = total - withGrades
    
    return {
      total,
      withGrades,
      withoutGrades,
      completionRate: total > 0 ? (withGrades / total) * 100 : 0
    }
  }
}
