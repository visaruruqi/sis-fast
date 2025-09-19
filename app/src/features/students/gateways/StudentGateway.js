export default class StudentGateway {
  async fetchStudents() {
    // Simulate API call with initial data
    // In real app, this would be: return fetch('/api/students').then(r => r.json())
    return [
      {
        id: 'stu001',
        firstName: 'Arben',
        lastName: 'Gashi',
        dateOfBirth: '2003-09-15',
        gender: 'Male',
        email: 'arben.gashi@email.com',
        phone: '+38344111222',
        address: 'Rruga B, Prishtina',
        enrollmentYear: 2022,
        status: 'Active'
      },
      {
        id: 'stu002',
        firstName: 'Donika',
        lastName: 'Krasniqi',
        dateOfBirth: '2002-03-22',
        gender: 'Female',
        email: 'donika.krasniqi@email.com',
        phone: '+38344111223',
        address: 'Dardania, Prishtina',
        enrollmentYear: 2021,
        status: 'Active'
      },
      {
        id: 'stu003',
        firstName: 'Blerim',
        lastName: 'Hoxha',
        dateOfBirth: '2001-05-08',
        gender: 'Male',
        email: 'blerim.hoxha@email.com',
        phone: '+38344111224',
        address: 'Ulqin, Kosovo',
        enrollmentYear: 2020,
        status: 'Archived'
      },
      {
        id: 'stu004',
        firstName: 'Elira',
        lastName: 'Shala',
        dateOfBirth: '2003-11-19',
        gender: 'Female',
        email: 'elira.shala@email.com',
        phone: '+38344111225',
        address: 'Peja, Kosovo',
        enrollmentYear: 2022,
        status: 'Active'
      }
    ]
  }

  async createStudent(student) {
    // Simulate API call
    return { ...student, id: 'stu' + Math.random().toString().slice(2,8) }
  }

  async updateStudent(student) {
    // Simulate API call
    return student
  }

  async archiveStudent(id) {
    // Simulate API call
    return { id, status: 'Archived' }
  }
}
