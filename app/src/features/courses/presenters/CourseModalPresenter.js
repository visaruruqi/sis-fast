import { makeAutoObservable } from 'mobx'

export default class CourseModalPresenter {
  form = {
    id: '',
    name: '',
    code: '',
    credits: 0,
    instructorId: '',
    description: ''
  }
  errors = {}
  isSubmitting = false
  modalTitle = 'Add Course'
  isEdit = false
  instructorOptions = []

  constructor(instructorRepository) {
    this.instructorRepository = instructorRepository
    makeAutoObservable(this, {}, { autoBind: true })
  }

  async loadInstructorOptions() {
    try {
      await this.instructorRepository.loadInstructors()
      this.instructorOptions = this.instructorRepository.getInstructorOptions()
      console.log('Loaded instructor options:', this.instructorOptions)
    } catch (error) {
      console.error('Failed to load instructor options:', error)
      this.instructorOptions = []
    }
  }

  async open(course = null) {
    this.resetForm()
    
    // Load instructor options when modal opens
    await this.loadInstructorOptions()
    
    if (course) {
      // Handle both old and new course data structure
      const courseData = { ...course }
      
      // If course has old 'instructor' field, convert it to 'instructorId'
      if (courseData.instructor && !courseData.instructorId) {
        // For now, we'll need to find the instructor by name
        // This is a temporary fix - in a real app, you'd want to migrate the data
        courseData.instructorId = courseData.instructor
        delete courseData.instructor
      }
      
      Object.assign(this.form, courseData)
      this.isEdit = true
      this.modalTitle = 'Edit Course'
    } else {
      this.isEdit = false
      this.modalTitle = 'Add Course'
    }
    this.errors = {}
  }

  close() {
    this.resetForm()
    this.errors = {}
    this.isSubmitting = false
  }

  updateForm(field, value) {
    this.form[field] = value
    if (this.errors[field]) {
      this.errors[field] = '' // Clear error on input
    }
  }

  validate() {
    this.errors = {}
    
    // Check if name is null, undefined, or whitespace
    if (!this.form.name || this.form.name.trim() === '') {
      this.errors.name = 'Course name is required.'
    }
    
    // Check if code is null, undefined, or whitespace
    if (!this.form.code || this.form.code.trim() === '') {
      this.errors.code = 'Course code is required.'
    }
    
    // Check if instructorId is null, undefined, or whitespace
    if (!this.form.instructorId || this.form.instructorId.trim() === '') {
      this.errors.instructorId = 'Instructor is required.'
    }
    
    // Check if credits is valid
    if (!this.form.credits || this.form.credits <= 0) {
      this.errors.credits = 'Credits must be greater than 0.'
    }
    
    // Validate course code format (e.g., CS101, MATH201)
    if (this.form.code && !/^[A-Z]{2,4}\d{3,4}$/.test(this.form.code)) {
      this.errors.code = 'Course code must be in format like CS101 or MATH201.'
    }
    
    return Object.keys(this.errors).length === 0
  }

  async save() {
    if (!this.validate()) {
      return
    }

    this.isSubmitting = true
    try {
      // Return the form data so the parent can save it
      return { ...this.form }
    } catch (error) {
      console.error('Error preparing course data:', error)
      throw error
    } finally {
      this.isSubmitting = false
    }
  }

  resetForm() {
    this.form = {
      id: '',
      name: '',
      code: '',
      credits: 0,
      instructorId: '',
      description: ''
    }
  }
}
