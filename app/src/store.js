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
    },
    {
      id: 'stu005',
      firstName: 'Jeton',
      lastName: 'Pula',
      dateOfBirth: '2004-01-11',
      gender: 'Male',
      email: 'jeton.pula@email.com',
      phone: '+38344111226',
      address: 'Vushtrri, Kosovo',
      enrollmentYear: 2023,
      status: 'Active'
    },
    {
      id: 'stu006',
      firstName: 'Drita',
      lastName: 'Sahiti',
      dateOfBirth: '2002-07-30',
      gender: 'Female',
      email: 'drita.sahiti@email.com',
      phone: '+38344111227',
      address: 'Gjilan, Kosovo',
      enrollmentYear: 2021,
      status: 'Active'
    }
  ],
  courses: [
    {
      id: 'crs001',
      name: 'Introduction to Programming',
      code: 'CS101',
      description: 'Learn programming basics.',
      credits: 4,
      instructor: 'Prof. Ilir D'
    },
    {
      id: 'crs002',
      name: 'Data Structures',
      code: 'CS102',
      description: 'Introduction to data structures.',
      credits: 4,
      instructor: 'Prof. Vesa T'
    },
    {
      id: 'crs003',
      name: 'Algorithms',
      code: 'CS201',
      description: 'Algorithm design and analysis.',
      credits: 4,
      instructor: 'Prof. Ardit B'
    },
    {
      id: 'crs004',
      name: 'Databases',
      code: 'CS202',
      description: 'Relational database design.',
      credits: 3,
      instructor: 'Prof. Leutrim H'
    },
    {
      id: 'crs005',
      name: 'Operating Systems',
      code: 'CS301',
      description: 'Process management and concurrency.',
      credits: 4,
      instructor: 'Prof. Shkelzen M'
    },
    {
      id: 'crs006',
      name: 'Computer Networks',
      code: 'CS302',
      description: 'Network protocols and architecture.',
      credits: 3,
      instructor: 'Prof. Ardian R'
    }
  ],
  enrollments: [
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
    },
    {
      id: 'enr003',
      studentId: 'stu003',
      courseId: 'crs003',
      semester: 'Spring 2024',
      grade: 'B'
    },
    {
      id: 'enr004',
      studentId: 'stu004',
      courseId: 'crs001',
      semester: 'Fall 2024',
      grade: ''
    },
    {
      id: 'enr005',
      studentId: 'stu005',
      courseId: 'crs005',
      semester: 'Spring 2025',
      grade: ''
    },
    {
      id: 'enr006',
      studentId: 'stu006',
      courseId: 'crs006',
      semester: 'Spring 2025',
      grade: ''
    }
  ]
})

export default store
