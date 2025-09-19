/**
 * Application constants
 * Centralizes magic strings and numbers for better maintainability
 */

export const STATUS = {
  ACTIVE: 'Active',
  ARCHIVED: 'Archived'
}

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100
}

export const VALIDATION = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MIN_EMAIL_LENGTH: 5,
  MAX_EMAIL_LENGTH: 100
}

export const SEMESTERS = [
  'Spring 2024',
  'Fall 2024', 
  'Spring 2025',
  'Fall 2025'
]

export const GENDER = {
  MALE: 'Male',
  FEMALE: 'Female',
  OTHER: 'Other'
}

export const API_ENDPOINTS = {
  STUDENTS: '/api/students',
  COURSES: '/api/courses',
  ENROLLMENTS: '/api/enrollments'
}

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  MIN_LENGTH: (min) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max) => `Must be no more than ${max} characters`,
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred'
}
