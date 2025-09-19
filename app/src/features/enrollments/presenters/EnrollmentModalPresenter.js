import { makeAutoObservable } from 'mobx'

/**
 * EnrollmentModalPresenter - Business logic for enrollment modal
 * Following Fast Test Architecture pattern
 */
export default class EnrollmentModalPresenter {
  isVisible = false
  studentId = null
  form = {
    courseId: '',
    semester: ''
  }
  errors = {}
  isSubmitting = false

  constructor(enrollmentRepository) {
    this.enrollmentRepository = enrollmentRepository
    makeAutoObservable(this, {}, { autoBind: true })
  }

  /**
   * Open the enrollment modal
   * @param {string} studentId - Student ID to enroll
   */
  open(studentId) {
    this.studentId = studentId
    this.form = {
      courseId: '',
      semester: ''
    }
    this.errors = {}
    this.isSubmitting = false
    this.isVisible = true
  }

  /**
   * Close the enrollment modal
   */
  close() {
    this.isVisible = false
    this.studentId = null
    this.form = {
      courseId: '',
      semester: ''
    }
    this.errors = {}
    this.isSubmitting = false
  }

  /**
   * Update form field
   * @param {string} field - Field name
   * @param {string} value - Field value
   */
  updateForm(field, value) {
    this.form[field] = value
    // Clear error for this field when user starts typing
    if (this.errors[field]) {
      delete this.errors[field]
    }
  }

  /**
   * Validate the enrollment form
   * @returns {boolean} True if valid
   */
  validateForm() {
    this.errors = {}

    if (!this.form.courseId) {
      this.errors.courseId = 'Course is required'
    }

    if (!this.form.semester) {
      this.errors.semester = 'Semester is required'
    }

    // Check if student is already enrolled in this course for this semester
    if (this.form.courseId && this.form.semester && this.studentId) {
      const isAlreadyEnrolled = this.enrollmentRepository.isStudentEnrolledInCourse(
        this.studentId,
        this.form.courseId,
        this.form.semester
      )
      
      if (isAlreadyEnrolled) {
        this.errors.courseId = 'Student is already enrolled in this course for this semester'
      }
    }

    return Object.keys(this.errors).length === 0
  }

  /**
   * Save the enrollment
   */
  async save() {
    if (!this.validateForm()) {
      return
    }

    this.isSubmitting = true
    this.errors = {}

    try {
      const enrollmentData = {
        studentId: this.studentId,
        courseId: this.form.courseId,
        semester: this.form.semester
      }

      await this.enrollmentRepository.createEnrollment(enrollmentData)
      this.close()
    } catch (error) {
      this.errors.general = error.message || 'Failed to create enrollment'
      console.error('Enrollment save error:', error)
    } finally {
      this.isSubmitting = false
    }
  }

  /**
   * Get available semesters
   * @returns {Array} Array of semester options
   */
  get availableSemesters() {
    return ['Spring 2024', 'Fall 2024', 'Spring 2025', 'Fall 2025']
  }

  /**
   * Get modal title
   * @returns {string} Modal title
   */
  get modalTitle() {
    return 'Enroll Student'
  }

  /**
   * Check if form is valid
   * @returns {boolean} True if form is valid
   */
  get isFormValid() {
    return this.form.courseId && this.form.semester && Object.keys(this.errors).length === 0
  }
}
