/**
 * EnrollmentGateway - External interface for enrollment API calls
 * Following Fast Test Architecture pattern
 */
export default class EnrollmentGateway {
  constructor() {
    // In a real app, this would be the API base URL
    this.baseUrl = '/api/enrollments'
  }

  /**
   * Get all enrollments from the API
   * @returns {Promise<Array>} Array of enrollment objects
   */
  async getAllEnrollments() {
    // Simulate API call with initial data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'enr001',
            studentId: 'stu001',
            courseId: 'crs001',
            semester: 'Fall 2024',
            grade: 'A'
          },
          {
            id: 'enr002',
            studentId: 'stu002',
            courseId: 'crs002',
            semester: 'Fall 2024',
            grade: ''
          },
          {
            id: 'enr003',
            studentId: 'stu003',
            courseId: 'crs003',
            semester: 'Spring 2024',
            grade: 'B'
          },
          {
            id: 'enr004',
            studentId: 'stu004',
            courseId: 'crs001',
            semester: 'Fall 2024',
            grade: ''
          }
        ])
      }, 100)
    })
  }

  /**
   * Create a new enrollment
   * @param {Object} enrollmentData - Enrollment data
   * @returns {Promise<Object>} Created enrollment with ID
   */
  async createEnrollment(enrollmentData) {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newEnrollment = {
          ...enrollmentData,
          id: 'enr' + Math.random().toString().slice(2, 8),
          grade: '' // New enrollments start with no grade
        }
        resolve(newEnrollment)
      }, 200)
    })
  }

  /**
   * Update an existing enrollment
   * @param {string} id - Enrollment ID
   * @param {Object} enrollmentData - Updated enrollment data
   * @returns {Promise<Object>} Updated enrollment
   */
  async updateEnrollment(id, enrollmentData) {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id,
          ...enrollmentData
        })
      }, 200)
    })
  }

  /**
   * Delete an enrollment
   * @param {string} id - Enrollment ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteEnrollment(id) {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 200)
    })
  }

  /**
   * Get enrollments for a specific student
   * @param {string} studentId - Student ID
   * @returns {Promise<Array>} Array of enrollments for the student
   */
  async getEnrollmentsByStudent(studentId) {
    const allEnrollments = await this.getAllEnrollments()
    return allEnrollments.filter(enrollment => enrollment.studentId === studentId)
  }

  /**
   * Get enrollments for a specific course
   * @param {string} courseId - Course ID
   * @returns {Promise<Array>} Array of enrollments for the course
   */
  async getEnrollmentsByCourse(courseId) {
    const allEnrollments = await this.getAllEnrollments()
    return allEnrollments.filter(enrollment => enrollment.courseId === courseId)
  }
}
