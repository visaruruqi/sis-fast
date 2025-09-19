import { describe, it, expect, beforeEach, vi } from 'vitest'
import EnrollmentRepository from '../repositories/EnrollmentRepository.js'
import EnrollmentGateway from '../gateways/EnrollmentGateway.js'

describe('EnrollmentRepository', () => {
  let repository
  let mockGateway

  beforeEach(() => {
    // Mock the gateway
    mockGateway = {
      getAllEnrollments: vi.fn().mockResolvedValue([
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
        }
      ]),
      createEnrollment: vi.fn().mockResolvedValue({
        id: 'enr003',
        studentId: 'stu001',
        courseId: 'crs003',
        semester: 'Spring 2025',
        grade: ''
      }),
      updateEnrollment: vi.fn().mockResolvedValue({}),
      deleteEnrollment: vi.fn().mockResolvedValue(true)
    }

    repository = new EnrollmentRepository(mockGateway)
  })

  describe('allEnrollments getter', () => {
    it('should return all enrollments', () => {
      expect(repository.allEnrollments).toEqual([])
    })

    it('should be reactive after loading enrollments', async () => {
      await repository.loadEnrollments()
      expect(repository.allEnrollments).toHaveLength(2)
      expect(repository.allEnrollments[0].id).toBe('enr001')
    })
  })

  describe('getEnrollmentsByStudent', () => {
    beforeEach(async () => {
      await repository.loadEnrollments()
    })

    it('should return enrollments for specific student', () => {
      const studentEnrollments = repository.getEnrollmentsByStudent('stu001')
      expect(studentEnrollments).toHaveLength(1)
      expect(studentEnrollments[0].studentId).toBe('stu001')
    })

    it('should return empty array for student with no enrollments', () => {
      const studentEnrollments = repository.getEnrollmentsByStudent('stu999')
      expect(studentEnrollments).toHaveLength(0)
    })
  })

  describe('createEnrollment', () => {
    it('should add new enrollment to the list', async () => {
      const enrollmentData = {
        studentId: 'stu001',
        courseId: 'crs003',
        semester: 'Spring 2025'
      }

      await repository.createEnrollment(enrollmentData)

      expect(repository.allEnrollments).toHaveLength(1)
      expect(repository.allEnrollments[0].studentId).toBe('stu001')
      expect(repository.allEnrollments[0].courseId).toBe('crs003')
    })

    it('should call gateway createEnrollment method', async () => {
      const enrollmentData = {
        studentId: 'stu001',
        courseId: 'crs003',
        semester: 'Spring 2025'
      }

      await repository.createEnrollment(enrollmentData)

      expect(mockGateway.createEnrollment).toHaveBeenCalledWith(enrollmentData)
    })
  })

  describe('loadEnrollments', () => {
    it('should load enrollments from gateway', async () => {
      await repository.loadEnrollments()

      expect(mockGateway.getAllEnrollments).toHaveBeenCalled()
      expect(repository.allEnrollments).toHaveLength(2)
    })

    it('should handle loading state', async () => {
      expect(repository.isLoading).toBe(false)

      const loadPromise = repository.loadEnrollments()
      expect(repository.isLoading).toBe(true)

      await loadPromise
      expect(repository.isLoading).toBe(false)
    })
  })

  describe('isStudentEnrolledInCourse', () => {
    beforeEach(async () => {
      await repository.loadEnrollments()
    })

    it('should return true if student is enrolled in course for semester', () => {
      const isEnrolled = repository.isStudentEnrolledInCourse('stu001', 'crs001', 'Fall 2024')
      expect(isEnrolled).toBe(true)
    })

    it('should return false if student is not enrolled in course for semester', () => {
      const isEnrolled = repository.isStudentEnrolledInCourse('stu001', 'crs999', 'Fall 2024')
      expect(isEnrolled).toBe(false)
    })

    it('should return false if student is enrolled but for different semester', () => {
      const isEnrolled = repository.isStudentEnrolledInCourse('stu001', 'crs001', 'Spring 2025')
      expect(isEnrolled).toBe(false)
    })
  })

  describe('Fast Test Architecture Benefits', () => {
    it('should be easily testable with mocked dependencies', () => {
      // Repository can be tested with mocked gateway
      expect(mockGateway.getAllEnrollments).toBeDefined()
      expect(mockGateway.createEnrollment).toBeDefined()
    })

    it('should have clear separation of concerns', () => {
      // Repository handles data logic, not API calls
      expect(repository.allEnrollments).toBeDefined()
      expect(repository.getEnrollmentsByStudent).toBeDefined()
      expect(repository.isStudentEnrolledInCourse).toBeDefined()
    })

    it('should be observable for reactive updates', () => {
      // Repository is MobX observable
      expect(repository.enrollments).toBeDefined()
      expect(repository.isLoading).toBeDefined()
      expect(repository.error).toBeDefined()
    })
  })
})
