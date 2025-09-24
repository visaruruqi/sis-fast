import { makeAutoObservable } from 'mobx'

/**
 * CourseDetailsPresenter - Business logic for course details page
 * Following Fast Test Architecture pattern
 */
export default class CourseDetailsPresenter {
  courseId = null
  isLoading = false
  error = null

  constructor(courseRepository, enrollmentRepository, studentRepository) {
    this.courseRepository = courseRepository
    this.enrollmentRepository = enrollmentRepository
    this.studentRepository = studentRepository
    makeAutoObservable(this, {}, { autoBind: true })
  }

  /**
   * Initialize the presenter with a course ID
   * @param {string} courseId - Course ID
   */
  async initialize(courseId) {
    this.courseId = courseId
    console.log('CourseDetailsPresenter: Setting isLoading to true')
    this.isLoading = true
    this.error = null

    try {
      // Load courses, enrollments, and students
      await Promise.all([
        this.courseRepository.loadCourses(),
        this.enrollmentRepository.loadEnrollments(),
        this.studentRepository.loadStudents()
      ])
      
      // Debug: Check if course was found
      console.log('CourseDetailsPresenter: After loading, courseId:', this.courseId)
      console.log('CourseDetailsPresenter: Available courses:', this.courseRepository.courses.length)
      console.log('CourseDetailsPresenter: Course found:', this.course)
    } catch (error) {
      this.error = error.message
      console.error('Failed to load course details:', error)
    } finally {
      console.log('CourseDetailsPresenter: Setting isLoading to false')
      this.isLoading = false
    }
  }

  /**
   * Get the current course
   * @returns {Object|null} Course object or null if not found
   */
  get course() {
    if (!this.courseId) return null
    return this.courseRepository.courses.find(c => c.id === this.courseId) || null
  }

  /**
   * Get enrollments for the current course
   * @returns {Array} Array of enrollments for the course
   */
  get courseEnrollments() {
    if (!this.courseId) return []
    return this.enrollmentRepository.allEnrollments.filter(e => e.courseId === this.courseId)
  }

  /**
   * Get student name by student ID
   * @param {string} studentId - Student ID
   * @returns {string} Student name or empty string if not found
   */
  getStudentName(studentId) {
    const student = this.studentRepository.allStudents.find(s => s.id === studentId)
    return student ? `${student.firstName} ${student.lastName}` : ''
  }

  /**
   * Refresh course data
   */
  async refresh() {
    if (this.courseId) {
      await this.initialize(this.courseId)
    }
  }
}