export default class CourseGateway {
  constructor() {
    // Maintain state in the gateway to persist data across navigation
    this.courses = [
      {
        id: 'crs001',
        name: 'Introduction to Programming',
        code: 'CS101',
        description: 'Learn programming basics.',
        credits: 4,
        instructorId: 'inst001'
      },
      {
        id: 'crs002',
        name: 'Data Structures',
        code: 'CS102',
        description: 'Introduction to data structures.',
        credits: 4,
        instructorId: 'inst002'
      },
      {
        id: 'crs003',
        name: 'Algorithms',
        code: 'CS201',
        description: 'Algorithm design and analysis.',
        credits: 4,
        instructorId: 'inst001'
      },
      {
        id: 'crs004',
        name: 'Databases',
        code: 'CS202',
        description: 'Relational database design.',
        credits: 3,
        instructorId: 'inst003'
      },
      {
        id: 'crs005',
        name: 'Operating Systems',
        code: 'CS203',
        description: 'Processes, threads and memory management.',
        credits: 4,
        instructorId: 'inst004'
      },
      {
        id: 'crs006',
        name: 'Computer Networks',
        code: 'CS204',
        description: 'Network architectures and protocols.',
        credits: 3,
        instructorId: 'inst001'
      },
      {
        id: 'crs007',
        name: 'Software Engineering',
        code: 'CS205',
        description: 'Software development methodologies.',
        credits: 3,
        instructorId: 'inst002'
      },
      {
        id: 'crs008',
        name: 'Web Development',
        code: 'CS206',
        description: 'Building modern web applications.',
        credits: 3,
        instructorId: 'inst003'
      },
      {
        id: 'crs009',
        name: 'Mobile App Development',
        code: 'CS207',
        description: 'Creating apps for mobile devices.',
        credits: 3,
        instructorId: 'inst004'
      },
      {
        id: 'crs010',
        name: 'Artificial Intelligence',
        code: 'CS301',
        description: 'Introduction to AI concepts.',
        credits: 4,
        instructorId: 'inst001'
      },
      {
        id: 'crs011',
        name: 'Machine Learning',
        code: 'CS302',
        description: 'Supervised and unsupervised learning.',
        credits: 4,
        instructorId: 'inst002'
      },
      {
        id: 'crs012',
        name: 'Computer Graphics',
        code: 'CS303',
        description: 'Rendering and graphics programming.',
        credits: 3,
        instructorId: 'inst001'
      },
      {
        id: 'crs013',
        name: 'Cybersecurity',
        code: 'CS304',
        description: 'Principles of computer security.',
        credits: 3,
        instructorId: 'inst003'
      },
      {
        id: 'crs014',
        name: 'Cloud Computing',
        code: 'CS305',
        description: 'Cloud service models and architectures.',
        credits: 3,
        instructorId: 'inst001'
      }
    ]
  }

  async fetchCourses() {
    // Return the current state instead of hardcoded data
    return [...this.courses]
  }

  async createCourse(courseData) {
    // Add new course to the gateway's state
    const newCourse = { ...courseData, id: 'crs' + Math.random().toString().slice(2,8) }
    this.courses.push(newCourse)
    return newCourse
  }

  async updateCourse(courseData) {
    // Update course in the gateway's state
    const index = this.courses.findIndex(c => c.id === courseData.id)
    if (index !== -1) {
      this.courses[index] = courseData
    }
    return courseData
  }

  async deleteCourse(id) {
    // Remove course from the gateway's state
    this.courses = this.courses.filter(c => c.id !== id)
    return { success: true }
  }
}
