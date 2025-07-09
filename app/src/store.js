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
      code: 'CS203',
      description: 'Processes, threads and memory management.',
      credits: 4,
      instructor: 'Prof. Lura K'
    },
    {
      id: 'crs006',
      name: 'Computer Networks',
      code: 'CS204',
      description: 'Network architectures and protocols.',
      credits: 3,
      instructor: 'Prof. Arber M'
    },
    {
      id: 'crs007',
      name: 'Software Engineering',
      code: 'CS205',
      description: 'Software development methodologies.',
      credits: 3,
      instructor: 'Prof. Nora B'
    },
    {
      id: 'crs008',
      name: 'Web Development',
      code: 'CS206',
      description: 'Building modern web applications.',
      credits: 3,
      instructor: 'Prof. Blerim R'
    },
    {
      id: 'crs009',
      name: 'Mobile App Development',
      code: 'CS207',
      description: 'Creating apps for mobile devices.',
      credits: 3,
      instructor: 'Prof. Luljeta P'
    },
    {
      id: 'crs010',
      name: 'Artificial Intelligence',
      code: 'CS301',
      description: 'Introduction to AI concepts.',
      credits: 4,
      instructor: 'Prof. Ardit B'
    },
    {
      id: 'crs011',
      name: 'Machine Learning',
      code: 'CS302',
      description: 'Supervised and unsupervised learning.',
      credits: 4,
      instructor: 'Prof. Vesa T'
    },
    {
      id: 'crs012',
      name: 'Computer Graphics',
      code: 'CS303',
      description: 'Rendering and graphics programming.',
      credits: 3,
      instructor: 'Prof. Ilir D'
    },
    {
      id: 'crs013',
      name: 'Cybersecurity',
      code: 'CS304',
      description: 'Principles of computer security.',
      credits: 3,
      instructor: 'Prof. Leutrim H'
    },
    {
      id: 'crs014',
      name: 'Cloud Computing',
      code: 'CS305',
      description: 'Cloud service models and architectures.',
      credits: 3,
      instructor: 'Prof. Arber M'
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
    }
  ]
})

export default store
