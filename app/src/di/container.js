import { Container } from 'inversify'
import { TYPES } from './types'
import StudentGateway from '../features/students/gateways/StudentGateway'
import StudentRepository from '../features/students/repositories/StudentRepository'
import StudentsPresenter from '../features/students/presenters/StudentsPresenter'
import StudentModalPresenter from '../features/students/presenters/StudentModalPresenter'
import StudentDetailsPresenter from '../features/students/presenters/StudentDetailsPresenter'
import CourseGateway from '../features/courses/gateways/CourseGateway'
import CourseRepository from '../features/courses/repositories/CourseRepository'
import CoursesPresenter from '../features/courses/presenters/CoursesPresenter'
import CourseModalPresenter from '../features/courses/presenters/CourseModalPresenter'
import CourseDetailsPresenter from '../features/courses/presenters/CourseDetailsPresenter'
import EnrollmentGateway from '../features/enrollments/gateways/EnrollmentGateway'
import EnrollmentRepository from '../features/enrollments/repositories/EnrollmentRepository'
import EnrollmentModalPresenter from '../features/enrollments/presenters/EnrollmentModalPresenter'

const container = new Container()

container.bind(TYPES.StudentGateway).toConstantValue(new StudentGateway())
container.bind(TYPES.CourseGateway).toConstantValue(new CourseGateway())
container.bind(TYPES.EnrollmentGateway).toConstantValue(new EnrollmentGateway())

// Inversify v7's context object exposes helper methods like `get` rather than
// the older `context.container.get` API. Use `ctx.get` for compatibility.
container.bind(TYPES.StudentRepository).toDynamicValue(ctx => {
  return new StudentRepository(ctx.get(TYPES.StudentGateway))
}).inSingletonScope()

container.bind(TYPES.CourseRepository).toDynamicValue(ctx => {
  return new CourseRepository(ctx.get(TYPES.CourseGateway))
}).inSingletonScope()

container.bind(TYPES.EnrollmentRepository).toDynamicValue(ctx => {
  return new EnrollmentRepository(ctx.get(TYPES.EnrollmentGateway))
}).inSingletonScope()

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

container.bind(TYPES.CoursesPresenter).toDynamicValue(ctx => {
  return new CoursesPresenter(ctx.get(TYPES.CourseRepository))
})

container.bind(TYPES.CourseModalPresenter).toDynamicValue(() => {
  return new CourseModalPresenter()
})

container.bind(TYPES.CourseDetailsPresenter).toDynamicValue(ctx => {
  return new CourseDetailsPresenter(
    ctx.get(TYPES.CourseRepository),
    ctx.get(TYPES.EnrollmentRepository),
    ctx.get(TYPES.StudentRepository)
  )
})

container.bind(TYPES.EnrollmentModalPresenter).toDynamicValue(ctx => {
  return new EnrollmentModalPresenter(ctx.get(TYPES.EnrollmentRepository))
})

export default container
