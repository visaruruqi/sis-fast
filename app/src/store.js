import { reactive } from 'vue'

const store = reactive({
  students: [
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
    }
  ],
  courses: [
    {
      id: 'crs001',
      name: 'Introduction to Programming',
      code: 'CS101',
      description: 'Learn programming basics.',
      credits: 4
    }
  ],
  enrollments: [
    {
      id: 'enr001',
      studentId: 'stu001',
      courseId: 'crs001',
      semester: 'Fall 2024',
      grade: 'A'
    }
  ]
})

export default store
