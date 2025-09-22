import { makeObservable, observable, action, computed } from 'mobx'
import Guard from 'guardflow'
import { BaseRepository } from '../../../core/BaseRepository.js'
import { STATUS } from '../../../core/constants.js'

export default class InstructorRepository extends BaseRepository {
  instructors = []

  constructor(gateway) {
    super(gateway)
    makeObservable(this, {
      instructors: observable,
      allInstructors: computed,
      activeInstructors: computed,
      archivedInstructors: computed,
      loadInstructors: action,
      save: action,
      delete: action,
      archive: action
    })
    this.loadInstructors()
  }

  // Observable getter for all instructors
  get allInstructors() {
    return this.instructors
  }

  // Get active instructors only
  get activeInstructors() {
    return this.instructors.filter(i => i.status === STATUS.ACTIVE)
  }

  // Get archived instructors only
  get archivedInstructors() {
    return this.instructors.filter(i => i.status === STATUS.ARCHIVED)
  }

  // Load instructors from gateway (API)
  async loadInstructors() {
    return this.executeWithLoading(async () => {
      this.instructors = await this.gateway.fetchInstructors()
    })
  }

  // Save instructor (create or update)
  async save(instructor) {
    Guard.Against.NullOrWhiteSpace(instructor.firstName, 'firstName')
    Guard.Against.NullOrWhiteSpace(instructor.lastName, 'lastName')
    Guard.Against.NullOrWhiteSpace(instructor.email, 'email')

    return this.executeWithLoading(async () => {
      // Set default status for new instructors
      if (!instructor.id && !instructor.status) {
        instructor.status = STATUS.ACTIVE
      }

      if (instructor.id) {
        // Update existing instructor
        const updatedInstructor = await this.gateway.updateInstructor(instructor)
        const idx = this.instructors.findIndex(i => i.id === instructor.id)
        if (idx !== -1) {
          this.instructors[idx] = updatedInstructor
        }
      } else {
        // Create new instructor
        const newInstructor = await this.gateway.createInstructor(instructor)
        this.instructors.push(newInstructor)
      }
    })
  }

  // Delete instructor (only if no courses assigned)
  async delete(id) {
    return this.executeWithLoading(async () => {
      // Check if instructor has any courses assigned
      const hasCourses = await this.gateway.hasInstructorCourses(id)
      if (hasCourses) {
        throw new Error('Cannot delete instructor with assigned courses. Please archive instead.')
      }
      
      await this.gateway.deleteInstructor(id)
      this.instructors = this.instructors.filter(i => i.id !== id)
    })
  }

  // Archive instructor (set status to archived)
  async archive(id) {
    return this.executeWithLoading(async () => {
      await this.gateway.archiveInstructor(id)
      const instructor = this.instructors.find(i => i.id === id)
      if (instructor) {
        instructor.status = STATUS.ARCHIVED
      }
    })
  }

  // Get instructor by ID
  getInstructorById(id) {
    return this.instructors.find(i => i.id === id)
  }

  // Search instructors
  searchInstructors(query) {
    if (!query) return this.instructors
    
    const lowerQuery = query.toLowerCase()
    return this.instructors.filter(instructor => 
      instructor.firstName.toLowerCase().includes(lowerQuery) ||
      instructor.lastName.toLowerCase().includes(lowerQuery) ||
      instructor.email.toLowerCase().includes(lowerQuery) ||
      instructor.department.toLowerCase().includes(lowerQuery)
    )
  }

  // Get instructor display name
  getInstructorDisplayName(instructor) {
    return this.gateway.getInstructorDisplayName(instructor)
  }

  // Get instructors for dropdown (formatted for select options)
  getInstructorOptions() {
    return this.instructors.map(instructor => ({
      value: instructor.id,
      label: this.getInstructorDisplayName(instructor),
      instructor: instructor
    }))
  }
}
