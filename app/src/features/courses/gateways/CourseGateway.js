export default class CourseGateway {
  async fetchCourses() {
    // Simulate API call with initial data
    // In real app, this would be: return fetch('/api/courses').then(r => r.json())
    return [
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
    ]
  }

  async createCourse(course) {
    // Simulate API call
    return { ...course, id: 'crs' + Math.random().toString().slice(2,8) }
  }

  async updateCourse(course) {
    // Simulate API call
    return course
  }

  async deleteCourse(id) {
    // Simulate API call
    return { success: true }
  }
}
