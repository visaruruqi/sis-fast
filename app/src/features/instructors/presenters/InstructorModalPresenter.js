import { makeAutoObservable } from 'mobx'

export default class InstructorModalPresenter {
  form = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    title: ''
  }
  errors = {}
  isSubmitting = false
  modalTitle = 'Add Instructor'
  isEdit = false

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  open(instructor = null) {
    this.resetForm()
    if (instructor) {
      Object.assign(this.form, instructor)
      this.isEdit = true
      this.modalTitle = 'Edit Instructor'
    } else {
      this.isEdit = false
      this.modalTitle = 'Add Instructor'
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
    
    // Check if firstName is null, undefined, or whitespace
    if (!this.form.firstName || this.form.firstName.trim() === '') {
      this.errors.firstName = 'First name is required.'
    }
    
    // Check if lastName is null, undefined, or whitespace
    if (!this.form.lastName || this.form.lastName.trim() === '') {
      this.errors.lastName = 'Last name is required.'
    }
    
    // Check if email is null, undefined, or whitespace
    if (!this.form.email || this.form.email.trim() === '') {
      this.errors.email = 'Email is required.'
    }
    
    // Check if department is null, undefined, or whitespace
    if (!this.form.department || this.form.department.trim() === '') {
      this.errors.department = 'Department is required.'
    }
    
    // Check if title is null, undefined, or whitespace
    if (!this.form.title || this.form.title.trim() === '') {
      this.errors.title = 'Title is required.'
    }
    
    // Validate email format
    if (this.form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
      this.errors.email = 'Please enter a valid email address.'
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
      console.error('Error preparing instructor data:', error)
      throw error
    } finally {
      this.isSubmitting = false
    }
  }

  resetForm() {
    this.form = {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      title: ''
    }
  }
}
