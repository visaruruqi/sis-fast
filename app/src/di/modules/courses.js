/**
 * Courses Feature DI Module
 * Contains all dependency bindings for the courses feature
 */
import { TYPES } from '../types'
import CourseGateway from '../../features/courses/gateways/CourseGateway'
import CourseRepository from '../../features/courses/repositories/CourseRepository'
import CoursesPresenter from '../../features/courses/presenters/CoursesPresenter'
import CourseModalPresenter from '../../features/courses/presenters/CourseModalPresenter'
import CourseDetailsPresenter from '../../features/courses/presenters/CourseDetailsPresenter'

/**
 * Configure all course-related bindings
 * @param {Container} container - The Inversify container
 */
export function configureCoursesModule(container) {
  // Gateways (stateless, can be singletons)
  container.bind(TYPES.CourseGateway).toConstantValue(new CourseGateway())

  // Repositories (singleton - hold permanent state)
  container.bind(TYPES.CourseRepository).toDynamicValue(ctx => {
    return new CourseRepository(ctx.get(TYPES.CourseGateway))
  }).inSingletonScope()

  // Presenters (transient - no permanent state)
  container.bind(TYPES.CoursesPresenter).toDynamicValue(ctx => {
    return new CoursesPresenter(ctx.get(TYPES.CourseRepository), ctx.get(TYPES.InstructorRepository))
  })

  container.bind(TYPES.CourseModalPresenter).toDynamicValue(ctx => {
    return new CourseModalPresenter(ctx.get(TYPES.InstructorRepository))
  })

  container.bind(TYPES.CourseDetailsPresenter).toDynamicValue(ctx => {
    return new CourseDetailsPresenter(
      ctx.get(TYPES.CourseRepository),
      ctx.get(TYPES.EnrollmentRepository),
      ctx.get(TYPES.StudentRepository)
    )
  })
}
