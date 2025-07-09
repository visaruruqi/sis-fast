import Guard from 'guardflow'
export default class StudentRepository {
  constructor(store, gateway) {
    this.store = store
    this.gateway = gateway
  }

  getAll() {
    return this.store.students
  }

  save(student) {
    Guard.Against.NullOrWhiteSpace(student.firstName, 'firstName')
    Guard.Against.NullOrWhiteSpace(student.lastName, 'lastName')
    Guard.Against.NullOrWhiteSpace(student.email, 'email')

    if (student.id) {
      const idx = this.store.students.findIndex(s => s.id === student.id)
      if (idx !== -1) this.store.students[idx] = student
    } else {
      student.id = 'stu' + Math.random().toString().slice(2,8)
      this.store.students.push(student)
    }
  }

  archive(id) {
    const s = this.store.students.find(st => st.id === id)
    if (s) s.status = 'Archived'
  }
}
