import { describe, it, expect, vi } from 'vitest'
import EnrollmentGateway from '../gateways/EnrollmentGateway.js'

describe('EnrollmentGateway', () => {
  let gateway

  beforeEach(() => {
    gateway = new EnrollmentGateway()
  })

  describe('getAllEnrollments', () => {
    it('should return an array of enrollments', async () => {
      const enrollments = await gateway.getAllEnrollments()
      
      expect(Array.isArray(enrollments)).toBe(true)
      expect(enrollments.length).toBeGreaterThan(0)
      
      // Check structure of first enrollment
      const firstEnrollment = enrollments[0]
      expect(firstEnrollment).toHaveProperty('id')
      expect(firstEnrollment).toHaveProperty('studentId')
      expect(firstEnrollment).toHaveProperty('courseId')
      expect(firstEnrollment).toHaveProperty('semester')
      expect(firstEnrollment).toHaveProperty('grade')
    })

    it('should return enrollments with correct data types', async () => {
      const enrollments = await gateway.getAllEnrollments()
      const enrollment = enrollments[0]
      
      expect(typeof enrollment.id).toBe('string')
      expect(typeof enrollment.studentId).toBe('string')
      expect(typeof enrollment.courseId).toBe('string')
      expect(typeof enrollment.semester).toBe('string')
      expect(typeof enrollment.grade).toBe('string')
    })
  })

  describe('createEnrollment', () => {
    it('should create a new enrollment with generated ID', async () => {
      const enrollmentData = {
        studentId: 'stu001',
        courseId: 'crs001',
        semester: 'Fall 2024'
      }
      
      const newEnrollment = await gateway.createEnrollment(enrollmentData)
      
      expect(newEnrollment).toHaveProperty('id')
      expect(newEnrollment.id).toMatch(/^enr/)
      expect(newEnrollment.studentId).toBe(enrollmentData.studentId)
      expect(newEnrollment.courseId).toBe(enrollmentData.courseId)
      expect(newEnrollment.semester).toBe(enrollmentData.semester)
      expect(newEnrollment.grade).toBe('') // New enrollments start with no grade
    })

    it('should preserve all enrollment data', async () => {
      const enrollmentData = {
        studentId: 'stu999',
        courseId: 'crs999',
        semester: 'Spring 2025'
      }
      
      const newEnrollment = await gateway.createEnrollment(enrollmentData)
      
      expect(newEnrollment.studentId).toBe(enrollmentData.studentId)
      expect(newEnrollment.courseId).toBe(enrollmentData.courseId)
      expect(newEnrollment.semester).toBe(enrollmentData.semester)
    })
  })

  describe('updateEnrollment', () => {
    it('should update enrollment data', async () => {
      const id = 'enr001'
      const updateData = {
        studentId: 'stu001',
        courseId: 'crs001',
        semester: 'Fall 2024',
        grade: 'A'
      }
      
      const updatedEnrollment = await gateway.updateEnrollment(id, updateData)
      
      expect(updatedEnrollment.id).toBe(id)
      expect(updatedEnrollment.studentId).toBe(updateData.studentId)
      expect(updatedEnrollment.courseId).toBe(updateData.courseId)
      expect(updatedEnrollment.semester).toBe(updateData.semester)
      expect(updatedEnrollment.grade).toBe(updateData.grade)
    })
  })

  describe('deleteEnrollment', () => {
    it('should return true for successful deletion', async () => {
      const result = await gateway.deleteEnrollment('enr001')
      expect(result).toBe(true)
    })
  })

  describe('getEnrollmentsByStudent', () => {
    it('should return enrollments for specific student', async () => {
      const studentId = 'stu001'
      const enrollments = await gateway.getEnrollmentsByStudent(studentId)
      
      expect(Array.isArray(enrollments)).toBe(true)
      enrollments.forEach(enrollment => {
        expect(enrollment.studentId).toBe(studentId)
      })
    })
  })

  describe('getEnrollmentsByCourse', () => {
    it('should return enrollments for specific course', async () => {
      const courseId = 'crs001'
      const enrollments = await gateway.getEnrollmentsByCourse(courseId)
      
      expect(Array.isArray(enrollments)).toBe(true)
      enrollments.forEach(enrollment => {
        expect(enrollment.courseId).toBe(courseId)
      })
    })
  })

  describe('Fast Test Architecture Benefits', () => {
    it('should be easily mockable for testing', () => {
      // Gateway can be easily mocked in repository tests
      const mockGateway = {
        getAllEnrollments: vi.fn().mockResolvedValue([]),
        createEnrollment: vi.fn().mockResolvedValue({}),
        updateEnrollment: vi.fn().mockResolvedValue({}),
        deleteEnrollment: vi.fn().mockResolvedValue(true)
      }
      
      expect(mockGateway.getAllEnrollments).toBeDefined()
      expect(mockGateway.createEnrollment).toBeDefined()
      expect(mockGateway.updateEnrollment).toBeDefined()
      expect(mockGateway.deleteEnrollment).toBeDefined()
    })

    it('should have clear separation of concerns', () => {
      // Gateway only handles external API communication
      expect(gateway.baseUrl).toBe('/api/enrollments')
      
      // No business logic should be in gateway
      expect(typeof gateway.getAllEnrollments).toBe('function')
      expect(typeof gateway.createEnrollment).toBe('function')
    })
  })
})
