import { describe, it, expect, vi, beforeEach } from 'vitest'
import StudentRepository from '../repositories/StudentRepository.js'

describe('StudentRepository', () => {
  let repository
  let mockGateway

  beforeEach(() => {
    // Mock gateway
    mockGateway = {
      fetchStudents: vi.fn().mockResolvedValue([
        {
          id: 'stu123',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          status: 'Active'
        },
        {
          id: 'stu456',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          status: 'Active'
        }
      ]),
      createStudent: vi.fn().mockImplementation((studentData) => {
        const newStudent = { ...studentData, id: 'stu' + Math.random().toString().slice(2,8) }
        return Promise.resolve(newStudent)
      }),
      updateStudent: vi.fn().mockImplementation((studentData) => {
        return Promise.resolve(studentData)
      }),
      archiveStudent: vi.fn().mockImplementation((id) => {
        return Promise.resolve({ id, status: 'Archived' })
      })
    }

    repository = new StudentRepository(mockGateway)
  })

  describe('allStudents', () => {
    it('should return all students from repository', () => {
      const students = repository.allStudents
      
      expect(students).toHaveLength(2)
      expect(students[0].firstName).toBe('John')
      expect(students[1].firstName).toBe('Jane')
    })

    it('should return empty array when repository has no students', async () => {
      mockGateway.fetchStudents.mockResolvedValue([])
      const newRepository = new StudentRepository(mockGateway)
      
      expect(newRepository.allStudents).toEqual([])
    })
  })

  describe('activeStudents', () => {
    it('should return only active students', () => {
      const activeStudents = repository.activeStudents
      
      expect(activeStudents).toHaveLength(2)
      expect(activeStudents.every(s => s.status === 'Active')).toBe(true)
    })
  })

  describe('archivedStudents', () => {
    it('should return only archived students', () => {
      // Add an archived student
      repository.students.push({
        id: 'stu789',
        firstName: 'Archived',
        lastName: 'Student',
        email: 'archived@example.com',
        status: 'Archived'
      })

      const archivedStudents = repository.archivedStudents
      
      expect(archivedStudents).toHaveLength(1)
      expect(archivedStudents[0].status).toBe('Archived')
    })
  })

  describe('save', () => {
    describe('creating new student', () => {
      it('should add new student with generated ID', async () => {
        const newStudent = {
          firstName: 'Alice',
          lastName: 'Johnson',
          email: 'alice.johnson@example.com',
          status: 'Active'
        }

        const initialLength = repository.students.length
        
        await repository.save(newStudent)
        
        expect(repository.students).toHaveLength(initialLength + 1)
        const savedStudent = repository.students[repository.students.length - 1]
        expect(savedStudent.id).toMatch(/^stu\d{6}$/)
        expect(savedStudent.firstName).toBe(newStudent.firstName)
        expect(savedStudent.lastName).toBe(newStudent.lastName)
        expect(savedStudent.email).toBe(newStudent.email)
      })

      it('should validate required fields for new student', async () => {
        const invalidStudent = {
          firstName: '',
          lastName: 'Johnson',
          email: 'alice.johnson@example.com'
        }

        await expect(repository.save(invalidStudent)).rejects.toThrow('firstName')
      })

      it('should validate all required fields', async () => {
        const testCases = [
          { student: { firstName: '', lastName: 'Johnson', email: 'test@test.com' }, field: 'firstName' },
          { student: { firstName: 'Alice', lastName: '', email: 'test@test.com' }, field: 'lastName' },
          { student: { firstName: 'Alice', lastName: 'Johnson', email: '' }, field: 'email' }
        ]

        for (const { student, field } of testCases) {
          await expect(repository.save(student)).rejects.toThrow(field)
        }
      })
    })

    describe('updating existing student', () => {
      it('should update existing student by ID', async () => {
        const updatedStudent = {
          id: 'stu123',
          firstName: 'John Updated',
          lastName: 'Doe Updated',
          email: 'john.updated@example.com',
          status: 'Active'
        }

        await repository.save(updatedStudent)
        
        const student = repository.students.find(s => s.id === 'stu123')
        expect(student).toEqual(updatedStudent)
        expect(repository.students).toHaveLength(2) // Should not add new student
      })

      it('should validate required fields for existing student', async () => {
        const invalidStudent = {
          id: 'stu123',
          firstName: '',
          lastName: 'Doe',
          email: 'john.doe@example.com'
        }

        await expect(repository.save(invalidStudent)).rejects.toThrow('firstName')
      })

      it('should not update if student ID not found', async () => {
        const nonExistentStudent = {
          id: 'stu999',
          firstName: 'Non',
          lastName: 'Existent',
          email: 'non@existent.com'
        }

        const initialStudents = [...repository.students]
        
        await repository.save(nonExistentStudent)
        
        expect(repository.students).toEqual(initialStudents)
      })
    })
  })

  describe('archive', () => {
    it('should set student status to Archived', async () => {
      await repository.archive('stu123')
      
      const student = repository.students.find(s => s.id === 'stu123')
      expect(student.status).toBe('Archived')
    })

    it('should not affect other students', async () => {
      await repository.archive('stu123')
      
      const otherStudent = repository.students.find(s => s.id === 'stu456')
      expect(otherStudent.status).toBe('Active')
    })

    it('should handle non-existent student ID gracefully', async () => {
      await expect(repository.archive('stu999')).resolves.not.toThrow()
    })

    it('should not change array length when archiving', async () => {
      const initialLength = repository.students.length
      
      await repository.archive('stu123')
      
      expect(repository.students).toHaveLength(initialLength)
    })
  })

  describe('getStudentById', () => {
    it('should return student by ID', () => {
      const student = repository.getStudentById('stu123')
      
      expect(student).toBeDefined()
      expect(student.firstName).toBe('John')
    })

    it('should return undefined for non-existent ID', () => {
      const student = repository.getStudentById('stu999')
      
      expect(student).toBeUndefined()
    })
  })

  describe('searchStudents', () => {
    it('should return all students when query is empty', () => {
      const results = repository.searchStudents('')
      
      expect(results).toHaveLength(2)
    })

    it('should search by first name', () => {
      const results = repository.searchStudents('John')
      
      expect(results).toHaveLength(1)
      expect(results[0].firstName).toBe('John')
    })

    it('should search by last name', () => {
      const results = repository.searchStudents('Smith')
      
      expect(results).toHaveLength(1)
      expect(results[0].lastName).toBe('Smith')
    })

    it('should search by email', () => {
      const results = repository.searchStudents('john.doe')
      
      expect(results).toHaveLength(1)
      expect(results[0].email).toBe('john.doe@example.com')
    })

    it('should be case insensitive', () => {
      const results = repository.searchStudents('JOHN')
      
      expect(results).toHaveLength(1)
      expect(results[0].firstName).toBe('John')
    })
  })

  describe('Fast Test Architecture Benefits', () => {
    it('demonstrates isolated testing - no external dependencies', async () => {
      // This test shows how we can test business logic without:
      // - Database connections
      // - API calls
      // - File system access
      // - Network requests
      
      const student = {
        firstName: 'Test',
        lastName: 'Student',
        email: 'test@student.com'
      }

      await repository.save(student)
      
      const savedStudent = repository.students.find(s => s.email === 'test@student.com')
      expect(savedStudent).toBeDefined()
      expect(savedStudent.firstName).toBe('Test')
    })

    it('demonstrates easy scenario testing', async () => {
      // Test different data scenarios easily
      const scenarios = [
        { status: 'Active', expected: 'Active' },
        { status: 'Archived', expected: 'Archived' },
        { status: 'Suspended', expected: 'Suspended' }
      ]

      for (const { status, expected } of scenarios) {
        const student = {
          firstName: 'Scenario',
          lastName: 'Test',
          email: `scenario-${status.toLowerCase()}@test.com`,
          status
        }

        await repository.save(student)
        
        const savedStudent = repository.students.find(s => s.email === `scenario-${status.toLowerCase()}@test.com`)
        expect(savedStudent.status).toBe(expected)
      }
    })
  })
})