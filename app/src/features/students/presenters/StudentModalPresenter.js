import { makeAutoObservable } from 'mobx'

export default class StudentModalPresenter {
  isVisible = false
  student = null
  form = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    status: 'Active'
  }
  isSubmitting = false
  errors = {}

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  get isEdit() {
    return !!this.student
  }

  get modalTitle() {
    return this.isEdit ? 'Edit Student' : 'Add Student'
  }

  open(student = null) {
    this.student = student
    this.isVisible = true
    this.resetForm()
    
    if (student) {
      this.form = { ...student }
    }
  }

  close() {
    this.isVisible = false
    this.resetForm()
    this.clearErrors()
  }

  resetForm() {
    this.form = {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      status: 'Active'
    }
  }

  updateForm(field, value) {
    this.form[field] = value
    // Clear error for this field when user starts typing
    if (this.errors[field]) {
      delete this.errors[field]
    }
  }

  validateForm() {
    this.errors = {}
    
    if (!this.form.firstName?.trim()) {
      this.errors.firstName = 'First name is required'
    }
    
    if (!this.form.lastName?.trim()) {
      this.errors.lastName = 'Last name is required'
    }
    
    if (!this.form.email?.trim()) {
      this.errors.email = 'Email is required'
    } else if (!this.isValidEmail(this.form.email)) {
      this.errors.email = 'Please enter a valid email'
    }
    
    return Object.keys(this.errors).length === 0
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  async save(onSave) {
    if (!this.validateForm()) {
      return
    }

    this.isSubmitting = true
    
    try {
      await onSave({ ...this.form })
      this.close()
    } catch (error) {
      console.error('Error saving student:', error)
      // Could add error handling here
    } finally {
      this.isSubmitting = false
    }
  }

  clearErrors() {
    this.errors = {}
  }
}
