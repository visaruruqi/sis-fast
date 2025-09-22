/**
 * Students Feature DI Module
 * Contains all dependency bindings for the students feature
 */
import { TYPES } from '../types'
import StudentGateway from '../../features/students/gateways/StudentGateway'
import StudentRepository from '../../features/students/repositories/StudentRepository'
import StudentsPresenter from '../../features/students/presenters/StudentsPresenter'
import StudentModalPresenter from '../../features/students/presenters/StudentModalPresenter'
import StudentDetailsPresenter from '../../features/students/presenters/StudentDetailsPresenter'

/**
 * Configure all student-related bindings
 * @param {Container} container - The Inversify container
 */
export function configureStudentsModule(container) {
  // Gateways (stateless, can be singletons)
  container.bind(TYPES.StudentGateway).toConstantValue(new StudentGateway())

  // Repositories (singleton - hold permanent state)
  container.bind(TYPES.StudentRepository).toDynamicValue(ctx => {
    return new StudentRepository(ctx.get(TYPES.StudentGateway))
  }).inSingletonScope()

  // Presenters (transient - no permanent state)
  container.bind(TYPES.StudentsPresenter).toDynamicValue(ctx => {
    return new StudentsPresenter(ctx.get(TYPES.StudentRepository))
  })

  container.bind(TYPES.StudentModalPresenter).toDynamicValue(() => {
    return new StudentModalPresenter()
  })

  container.bind(TYPES.StudentDetailsPresenter).toDynamicValue(ctx => {
    return new StudentDetailsPresenter(
      ctx.get(TYPES.StudentRepository),
      ctx.get(TYPES.EnrollmentRepository),
      ctx.get(TYPES.CourseRepository)
    )
  })
}
