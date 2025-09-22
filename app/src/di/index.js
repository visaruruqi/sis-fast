/**
 * Dependency Injection Module
 * Central export point for all DI-related functionality
 */

// Main container
export { default as container } from './container'

// Type definitions
export { TYPES } from './types'

// Individual modules (for advanced usage)
export { configureStudentsModule } from './modules/students'
export { configureCoursesModule } from './modules/courses'
export { configureEnrollmentsModule } from './modules/enrollments'
export { configureCoreModule } from './modules/core'

// Convenience function to get a service
export function getService(type) {
  return container.get(type)
}

// Convenience function to get multiple services
export function getServices(...types) {
  return types.map(type => container.get(type))
}
