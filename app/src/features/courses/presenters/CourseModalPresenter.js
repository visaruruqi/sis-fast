import { makeAutoObservable } from 'mobx'
import Guard from 'guardflow'

export default class CourseModalPresenter {
  form = {
    id: '',
    name: '',
    code: '',
    credits: 0,
    instructor: '',
    description: ''
  }
  errors = {}
  isSubmitting = false
  modalTitle = 'Add Course'
  isEdit = false

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  open(course = null) {
    this.resetForm()
    if (course) {
      Object.assign(this.form, course)
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
    
    if (Guard.Against.NullOrWhiteSpace(this.form.name)) {
      this.errors.name = 'Course name is required.'
    }
    
    if (Guard.Against.NullOrWhiteSpace(this.form.code)) {
      this.errors.code = 'Course code is required.'
    }
    
    if (Guard.Against.NullOrWhiteSpace(this.form.instructor)) {
      this.errors.instructor = 'Instructor is required.'
    }
    
    if (!this.form.credits || this.form.credits <= 0) {
      this.errors.credits = 'Credits must be greater than 0.'
    }
    
    // Validate course code format (e.g., CS101, MATH201)
    if (this.form.code && !/^[A-Z]{2,4}\d{3,4}$/.test(this.form.code)) {
      this.errors.code = 'Course code must be in format like CS101 or MATH201.'
    }
    
    return Object.keys(this.errors).length === 0
  }

  async save(onSaveCallback) {
    if (!this.validate()) {
      return
    }

    this.isSubmitting = true
    try {
      // Simulate async save operation
      await new Promise(resolve => setTimeout(resolve, 300))
      onSaveCallback({ ...this.form })
      this.close()
    } catch (error) {
      console.error('Error saving course:', error)
      // Handle error, e.g., set a general error message
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
      instructor: '',
      description: ''
    }
  }
}
