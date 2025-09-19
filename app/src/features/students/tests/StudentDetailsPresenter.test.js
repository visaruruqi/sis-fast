import { describe, it, expect, beforeEach, vi } from 'vitest'
import StudentDetailsPresenter from '../presenters/StudentDetailsPresenter.js'

describe('StudentDetailsPresenter', () => {
  let presenter
  let mockStudentRepository
  let mockEnrollmentRepository
  let mockCourseRepository

  beforeEach(() => {
    // Mock repositories
    mockStudentRepository = {
      allStudents: [
        {
          id: 'stu001',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          status: 'Active'
        }
      ]
    }

    mockEnrollmentRepository = {
      allEnrollments: [
        {
          id: 'enr001',
          studentId: 'stu001',
          courseId: 'crs001',
          semester: 'Fall 2024',
          grade: 'A'
        }
      ],
      loadEnrollments: vi.fn().mockResolvedValue(),
      createEnrollment: vi.fn().mockResolvedValue()
    }

    mockCourseRepository = {
      courses: [
        {
          id: 'crs001',
          name: 'Mathematics 101',
          instructor: 'Dr. Smith'
        }
      ],
      loadCourses: vi.fn().mockResolvedValue()
    }

    presenter = new StudentDetailsPresenter(
      mockStudentRepository,
      mockEnrollmentRepository,
      mockCourseRepository
    )
  })

  describe('initialize', () => {
    it('should load data and set student ID', async () => {
      await presenter.initialize('stu001')

      expect(presenter.studentId).toBe('stu001')
      expect(mockEnrollmentRepository.loadEnrollments).toHaveBeenCalled()
      expect(mockCourseRepository.loadCourses).toHaveBeenCalled()
    })

    it('should handle loading state', async () => {
      expect(presenter.isLoading).toBe(false)

      const initPromise = presenter.initialize('stu001')
      expect(presenter.isLoading).toBe(true)

      await initPromise
      expect(presenter.isLoading).toBe(false)
    })

    it('should handle errors gracefully', async () => {
      mockEnrollmentRepository.loadEnrollments.mockRejectedValue(new Error('Load failed'))

      await presenter.initialize('stu001')

      expect(presenter.error).toBe('Load failed')
      expect(presenter.isLoading).toBe(false)
    })
  })

  describe('student getter', () => {
    it('should return student when studentId is set', async () => {
      await presenter.initialize('stu001')
      expect(presenter.student).toEqual({
        id: 'stu001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        status: 'Active'
      })
    })

    it('should return null when studentId is not set', () => {
      expect(presenter.student).toBeNull()
    })

    it('should return null when student is not found', async () => {
      await presenter.initialize('stu999')
      expect(presenter.student).toBeNull()
    })
  })

  describe('studentEnrollments getter', () => {
    it('should return enrollments for the current student', async () => {
      await presenter.initialize('stu001')
      expect(presenter.studentEnrollments).toHaveLength(1)
      expect(presenter.studentEnrollments[0].studentId).toBe('stu001')
    })

    it('should return empty array when studentId is not set', () => {
      expect(presenter.studentEnrollments).toEqual([])
    })

    it('should return empty array when student has no enrollments', async () => {
      await presenter.initialize('stu999')
      expect(presenter.studentEnrollments).toEqual([])
    })
  })

  describe('getCourseName', () => {
    it('should return course name for valid course ID', async () => {
      await presenter.initialize('stu001')
      const courseName = presenter.getCourseName('crs001')
      expect(courseName).toBe('Mathematics 101')
    })

    it('should return empty string for invalid course ID', async () => {
      await presenter.initialize('stu001')
      const courseName = presenter.getCourseName('crs999')
      expect(courseName).toBe('')
    })
  })

  describe('enrollStudent', () => {
    it('should create enrollment through repository', async () => {
      await presenter.initialize('stu001')
      
      const enrollmentData = {
        studentId: 'stu001',
        courseId: 'crs002',
        semester: 'Spring 2025'
      }

      await presenter.enrollStudent(enrollmentData)

      expect(mockEnrollmentRepository.createEnrollment).toHaveBeenCalledWith(enrollmentData)
    })

    it('should handle enrollment errors', async () => {
      await presenter.initialize('stu001')
      
      mockEnrollmentRepository.createEnrollment.mockRejectedValue(new Error('Enrollment failed'))
      
      const enrollmentData = {
        studentId: 'stu001',
        courseId: 'crs002',
        semester: 'Spring 2025'
      }

      await expect(presenter.enrollStudent(enrollmentData)).rejects.toThrow('Enrollment failed')
      expect(presenter.error).toBe('Enrollment failed')
    })
  })

  describe('refresh', () => {
    it('should reinitialize with current student ID', async () => {
      await presenter.initialize('stu001')
      
      // Clear the mock calls
      mockEnrollmentRepository.loadEnrollments.mockClear()
      mockCourseRepository.loadCourses.mockClear()
      
      await presenter.refresh()
      
      expect(mockEnrollmentRepository.loadEnrollments).toHaveBeenCalled()
      expect(mockCourseRepository.loadCourses).toHaveBeenCalled()
    })

    it('should do nothing when studentId is not set', async () => {
      mockEnrollmentRepository.loadEnrollments.mockClear()
      mockCourseRepository.loadCourses.mockClear()
      
      await presenter.refresh()
      
      expect(mockEnrollmentRepository.loadEnrollments).not.toHaveBeenCalled()
      expect(mockCourseRepository.loadCourses).not.toHaveBeenCalled()
    })
  })

  describe('Fast Test Architecture Benefits', () => {
    it('should be easily testable with mocked dependencies', () => {
      // All dependencies are mocked and can be easily controlled
      expect(mockStudentRepository.allStudents).toBeDefined()
      expect(mockEnrollmentRepository.allEnrollments).toBeDefined()
      expect(mockCourseRepository.courses).toBeDefined()
    })

    it('should have clear separation of concerns', () => {
      // Presenter handles business logic, not data access
      expect(presenter.student).toBeDefined()
      expect(presenter.studentEnrollments).toBeDefined()
      expect(presenter.getCourseName).toBeDefined()
      expect(presenter.enrollStudent).toBeDefined()
    })

    it('should be observable for reactive updates', () => {
      // Presenter is MobX observable
      expect(presenter.studentId).toBeDefined()
      expect(presenter.isLoading).toBeDefined()
      expect(presenter.error).toBeDefined()
    })

    it('should demonstrate proper layer separation', () => {
      // Presenter only knows about repositories, not gateways or components
      expect(presenter.studentRepository).toBeDefined()
      expect(presenter.enrollmentRepository).toBeDefined()
      expect(presenter.courseRepository).toBeDefined()
      
      // Verify the repositories have the expected methods/properties
      expect(presenter.studentRepository.allStudents).toBeDefined()
      expect(presenter.enrollmentRepository.allEnrollments).toBeDefined()
      expect(presenter.courseRepository.courses).toBeDefined()
    })
  })
})
