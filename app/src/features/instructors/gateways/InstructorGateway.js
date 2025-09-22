/**
 * InstructorGateway - External interface for instructor API calls
 * Following Fast Test Architecture pattern
 */
export default class InstructorGateway {
  constructor() {
    // Maintain state in the gateway to persist data across navigation
    this.instructors = [
      {
        id: 'inst001',
        firstName: 'Prof. Ilir',
        lastName: 'Dervishi',
        email: 'ilir.dervishi@university.edu',
        department: 'Computer Science',
        title: 'Professor',
        status: 'Active'
      },
      {
        id: 'inst002',
        firstName: 'Prof. Vesa',
        lastName: 'Toska',
        email: 'vesa.toska@university.edu',
        department: 'Computer Science',
        title: 'Associate Professor',
        status: 'Active'
      },
      {
        id: 'inst003',
        firstName: 'Dr. Arben',
        lastName: 'Gashi',
        email: 'arben.gashi@university.edu',
        department: 'Mathematics',
        title: 'Assistant Professor',
        status: 'Active'
      },
      {
        id: 'inst004',
        firstName: 'Dr. Donika',
        lastName: 'Krasniqi',
        email: 'donika.krasniqi@university.edu',
        department: 'Physics',
        title: 'Assistant Professor',
        status: 'Active'
      }
    ]
  }

  async fetchInstructors() {
    // Return the current state instead of hardcoded data
    return [...this.instructors]
  }

  async createInstructor(instructorData) {
    // Add new instructor to the gateway's state
    const newInstructor = { 
      ...instructorData, 
      id: 'inst' + Math.random().toString().slice(2,8),
      status: instructorData.status || 'Active'
    }
    this.instructors.push(newInstructor)
    return newInstructor
  }

  async updateInstructor(instructorData) {
    // Update instructor in the gateway's state
    const index = this.instructors.findIndex(i => i.id === instructorData.id)
    if (index !== -1) {
      this.instructors[index] = instructorData
    }
    return instructorData
  }

  async deleteInstructor(id) {
    // Remove instructor from the gateway's state
    this.instructors = this.instructors.filter(i => i.id !== id)
    return { success: true }
  }

  async archiveInstructor(id) {
    // Set instructor status to archived
    const instructor = this.instructors.find(i => i.id === id)
    if (instructor) {
      instructor.status = 'Archived'
    }
    return { success: true }
  }

  async hasInstructorCourses(instructorId) {
    // In a real app, this would check the course repository
    // For now, we'll simulate by checking if instructor has certain IDs that have courses
    const instructorsWithCourses = ['inst001', 'inst002', 'inst003', 'inst004'] // All current instructors have courses
    return instructorsWithCourses.includes(instructorId)
  }

  // Helper method to get instructor display name
  getInstructorDisplayName(instructor) {
    return `${instructor.title} ${instructor.firstName} ${instructor.lastName}`
  }
}
