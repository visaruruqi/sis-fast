import { makeAutoObservable } from 'mobx'
import Guard from 'guardflow'

export default class StudentRepository {
  students = []
  isLoading = false
  error = null

  constructor(gateway) {
    this.gateway = gateway
    makeAutoObservable(this, {}, { autoBind: true })
    this.loadStudents()
  }

  // Observable getter for all students
  get allStudents() {
    return this.students
  }

  // Observable getter for active students
  get activeStudents() {
    return this.students.filter(s => s.status === 'Active')
  }

  // Observable getter for archived students
  get archivedStudents() {
    return this.students.filter(s => s.status === 'Archived')
  }

  // Load students from gateway (API)
  async loadStudents() {
    this.isLoading = true
    this.error = null
    try {
      const students = await this.gateway.fetchStudents()
      this.students = students
    } catch (error) {
      this.error = error.message
      console.error('Failed to load students:', error)
    } finally {
      this.isLoading = false
    }
  }

  // Save student (create or update)
  async save(student) {
    Guard.Against.NullOrWhiteSpace(student.firstName, 'firstName')
    Guard.Against.NullOrWhiteSpace(student.lastName, 'lastName')
    Guard.Against.NullOrWhiteSpace(student.email, 'email')

    this.isLoading = true
    this.error = null

    try {
      if (student.id) {
        // Update existing student
        const idx = this.students.findIndex(s => s.id === student.id)
        if (idx !== -1) {
          this.students[idx] = student
          // In real app, would call gateway.updateStudent(student)
        }
      } else {
        // Create new student
        student.id = 'stu' + Math.random().toString().slice(2,8)
        this.students.push(student)
        // In real app, would call gateway.createStudent(student)
      }
    } catch (error) {
      this.error = error.message
      console.error('Failed to save student:', error)
    } finally {
      this.isLoading = false
    }
  }

  // Archive student
  async archive(id) {
    this.isLoading = true
    this.error = null

    try {
      const student = this.students.find(s => s.id === id)
      if (student) {
        student.status = 'Archived'
        // In real app, would call gateway.archiveStudent(id)
      }
    } catch (error) {
      this.error = error.message
      console.error('Failed to archive student:', error)
    } finally {
      this.isLoading = false
    }
  }

  // Get student by ID
  getStudentById(id) {
    return this.students.find(s => s.id === id)
  }

  // Search students
  searchStudents(query) {
    if (!query) return this.students
    
    const lowerQuery = query.toLowerCase()
    return this.students.filter(student => 
      student.firstName.toLowerCase().includes(lowerQuery) ||
      student.lastName.toLowerCase().includes(lowerQuery) ||
      student.email.toLowerCase().includes(lowerQuery)
    )
  }
}
