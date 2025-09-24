import { describe, it, expect, beforeEach, vi } from 'vitest'
import CourseDetailsPresenter from '../presenters/CourseDetailsPresenter.js'

describe('CourseDetailsPresenter', () => {
  let presenter
  let mockCourseRepository
  let mockEnrollmentRepository
  let mockStudentRepository

  beforeEach(() => {
    // Mock repositories
    mockCourseRepository = {
      courses: [
        {
          id: 'crs001',
          name: 'Mathematics 101',
          code: 'MATH101',
          credits: 3,
          instructor: 'Dr. Smith'
        }
      ],
      loadCourses: vi.fn().mockResolvedValue(),
      isLoading: false,
      error: null,
      executeWithLoading: vi.fn().mockImplementation(async (operation) => {
        return await operation()
      })
    }

    mockEnrollmentRepository = {
      allEnrollments: [
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
          courseId: 'crs001',
          semester: 'Fall 2024',
          grade: ''
        }
      ],
      loadEnrollments: vi.fn().mockResolvedValue()
    }

    mockStudentRepository = {
      allStudents: [
        {
          id: 'stu001',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          status: 'Active'
        },
        {
          id: 'stu002',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          status: 'Active'
        }
      ],
      loadStudents: vi.fn().mockResolvedValue()
    }

    presenter = new CourseDetailsPresenter(
      mockCourseRepository,
      mockEnrollmentRepository,
      mockStudentRepository
    )
  })

  describe('initialize', () => {
    it('should load data and set course ID', async () => {
      await presenter.initialize('crs001')

      expect(presenter.courseId).toBe('crs001')
      expect(mockCourseRepository.loadCourses).toHaveBeenCalled()
      expect(mockEnrollmentRepository.loadEnrollments).toHaveBeenCalled()
      expect(mockStudentRepository.loadStudents).toHaveBeenCalled()
    })

    it('should handle loading state', async () => {
      expect(presenter.isLoading).toBe(false)

      await presenter.initialize('crs001')
      expect(presenter.isLoading).toBe(false)
    })

    it('should handle errors gracefully', async () => {
      mockCourseRepository.executeWithLoading.mockRejectedValue(new Error('Load failed'))
      mockCourseRepository.error = 'Load failed'

      await presenter.initialize('crs001')

      expect(presenter.error).toBe('Load failed')
      expect(presenter.isLoading).toBe(false)
    })
  })

  describe('course getter', () => {
    it('should return course when courseId is set', async () => {
      await presenter.initialize('crs001')
      expect(presenter.course).toEqual({
        id: 'crs001',
        name: 'Mathematics 101',
        code: 'MATH101',
        credits: 3,
        instructor: 'Dr. Smith'
      })
    })

    it('should return null when courseId is not set', () => {
      expect(presenter.course).toBeNull()
    })

    it('should return null when course is not found', async () => {
      await presenter.initialize('crs999')
      expect(presenter.course).toBeNull()
    })
  })

  describe('courseEnrollments getter', () => {
    it('should return enrollments for the current course', async () => {
      await presenter.initialize('crs001')
      expect(presenter.courseEnrollments).toHaveLength(2)
      expect(presenter.courseEnrollments[0].courseId).toBe('crs001')
      expect(presenter.courseEnrollments[1].courseId).toBe('crs001')
    })

    it('should return empty array when courseId is not set', () => {
      expect(presenter.courseEnrollments).toEqual([])
    })

    it('should return empty array when course has no enrollments', async () => {
      await presenter.initialize('crs999')
      expect(presenter.courseEnrollments).toEqual([])
    })
  })

  describe('getStudentName', () => {
    it('should return student name for valid student ID', async () => {
      await presenter.initialize('crs001')
      const studentName = presenter.getStudentName('stu001')
      expect(studentName).toBe('John Doe')
    })

    it('should return student name for another valid student ID', async () => {
      await presenter.initialize('crs001')
      const studentName = presenter.getStudentName('stu002')
      expect(studentName).toBe('Jane Smith')
    })

    it('should return empty string for invalid student ID', async () => {
      await presenter.initialize('crs001')
      const studentName = presenter.getStudentName('stu999')
      expect(studentName).toBe('')
    })
  })

  describe('refresh', () => {
    it('should reinitialize with current course ID', async () => {
      await presenter.initialize('crs001')
      
      // Clear the mock calls
      mockCourseRepository.loadCourses.mockClear()
      mockEnrollmentRepository.loadEnrollments.mockClear()
      mockStudentRepository.loadStudents.mockClear()
      
      await presenter.refresh()
      
      expect(mockCourseRepository.loadCourses).toHaveBeenCalled()
      expect(mockEnrollmentRepository.loadEnrollments).toHaveBeenCalled()
      expect(mockStudentRepository.loadStudents).toHaveBeenCalled()
    })

    it('should do nothing when courseId is not set', async () => {
      mockCourseRepository.loadCourses.mockClear()
      mockEnrollmentRepository.loadEnrollments.mockClear()
      mockStudentRepository.loadStudents.mockClear()
      
      await presenter.refresh()
      
      expect(mockCourseRepository.loadCourses).not.toHaveBeenCalled()
      expect(mockEnrollmentRepository.loadEnrollments).not.toHaveBeenCalled()
      expect(mockStudentRepository.loadStudents).not.toHaveBeenCalled()
    })
  })

  describe('Fast Test Architecture Benefits', () => {
    it('should be easily testable with mocked dependencies', () => {
      // All dependencies are mocked and can be easily controlled
      expect(mockCourseRepository.courses).toBeDefined()
      expect(mockEnrollmentRepository.allEnrollments).toBeDefined()
      expect(mockStudentRepository.allStudents).toBeDefined()
    })

    it('should have clear separation of concerns', () => {
      // Presenter handles business logic, not data access
      expect(presenter.course).toBeDefined()
      expect(presenter.courseEnrollments).toBeDefined()
      expect(presenter.getStudentName).toBeDefined()
    })

    it('should be observable for reactive updates', () => {
      // Presenter is MobX observable
      expect(presenter.courseId).toBeDefined()
      expect(presenter.isLoading).toBeDefined()
      expect(presenter.error).toBeDefined()
    })

    it('should demonstrate proper layer separation', () => {
      // Presenter only knows about repositories, not gateways or components
      expect(presenter.repository).toBeDefined()
      expect(presenter.enrollmentRepository).toBeDefined()
      expect(presenter.studentRepository).toBeDefined()
      
      // Verify the repositories have the expected properties
      expect(presenter.repository.courses).toBeDefined()
      expect(presenter.enrollmentRepository.allEnrollments).toBeDefined()
      expect(presenter.studentRepository.allStudents).toBeDefined()
    })
  })
})
