import { makeObservable, observable, action, computed } from 'mobx'
import Guard from 'guardflow'
import { BaseRepository } from '../../../core/BaseRepository.js'
import { STATUS } from '../../../core/constants.js'

export default class StudentRepository extends BaseRepository {
  students = []

  constructor(gateway) {
    super(gateway)
    makeObservable(this, {
      students: observable,
      allStudents: computed,
      activeStudents: computed,
      archivedStudents: computed,
      loadStudents: action,
      save: action,
      archive: action
    })
    this.loadStudents()
  }

  // Observable getter for all students
  get allStudents() {
    return this.students
  }

  // Observable getter for active students
  get activeStudents() {
    return this.students.filter(s => s.status === STATUS.ACTIVE)
  }

  // Observable getter for archived students
  get archivedStudents() {
    return this.students.filter(s => s.status === STATUS.ARCHIVED)
  }

  // Load students from gateway (API)
  async loadStudents() {
    return this.executeWithLoading(async () => {
      this.students = await this.gateway.fetchStudents()
    })
  }

  // Save student (create or update)
  async save(student) {
    Guard.Against.NullOrWhiteSpace(student.firstName, 'firstName')
    Guard.Against.NullOrWhiteSpace(student.lastName, 'lastName')
    Guard.Against.NullOrWhiteSpace(student.email, 'email')

    return this.executeWithLoading(async () => {
      if (student.id) {
        // Update existing student
        const updatedStudent = await this.gateway.updateStudent(student)
        const idx = this.students.findIndex(s => s.id === student.id)
        if (idx !== -1) {
          this.students[idx] = updatedStudent
        }
      } else {
        // Create new student
        const newStudent = await this.gateway.createStudent(student)
        this.students.push(newStudent)
      }
    })
  }

  // Archive student
  async archive(id) {
    return this.executeWithLoading(async () => {
      await this.gateway.archiveStudent(id)
      const student = this.students.find(s => s.id === id)
      if (student) {
        student.status = STATUS.ARCHIVED
      }
    })
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
