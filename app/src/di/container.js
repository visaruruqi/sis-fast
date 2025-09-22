import { Container } from 'inversify'
import { configureCoreModule } from './modules/core'
import { configureStudentsModule } from './modules/students'
import { configureCoursesModule } from './modules/courses'
import { configureEnrollmentsModule } from './modules/enrollments'
import { configureInstructorsModule } from './modules/instructors'

/**
 * Main Dependency Injection Container
 * Combines all feature modules into a single container
 */
const container = new Container()

// Configure all modules in dependency order
// Core services first (if any)
configureCoreModule(container)

// Feature modules
configureStudentsModule(container)
configureCoursesModule(container)
configureEnrollmentsModule(container)
configureInstructorsModule(container)

export default container
