import { Container } from 'inversify'
import { TYPES } from './types'
import StudentGateway from '../features/students/gateways/StudentGateway'
import StudentRepository from '../features/students/repositories/StudentRepository'
import StudentsPresenter from '../features/students/presenters/StudentsPresenter'
import StudentModalPresenter from '../features/students/presenters/StudentModalPresenter'
import CourseGateway from '../features/courses/gateways/CourseGateway'
import CourseRepository from '../features/courses/repositories/CourseRepository'
import CoursesPresenter from '../features/courses/presenters/CoursesPresenter'
import CourseModalPresenter from '../features/courses/presenters/CourseModalPresenter'

const container = new Container()

container.bind(TYPES.StudentGateway).toConstantValue(new StudentGateway())
container.bind(TYPES.CourseGateway).toConstantValue(new CourseGateway())

// Inversify v7's context object exposes helper methods like `get` rather than
// the older `context.container.get` API. Use `ctx.get` for compatibility.
container.bind(TYPES.StudentRepository).toDynamicValue(ctx => {
  return new StudentRepository(ctx.get(TYPES.StudentGateway))
}).inSingletonScope()

container.bind(TYPES.CourseRepository).toDynamicValue(ctx => {
  return new CourseRepository(ctx.get(TYPES.CourseGateway))
}).inSingletonScope()

container.bind(TYPES.StudentsPresenter).toDynamicValue(ctx => {
  return new StudentsPresenter(ctx.get(TYPES.StudentRepository))
})

container.bind(TYPES.StudentModalPresenter).toDynamicValue(() => {
  return new StudentModalPresenter()
})

container.bind(TYPES.CoursesPresenter).toDynamicValue(ctx => {
  return new CoursesPresenter(ctx.get(TYPES.CourseRepository))
})

container.bind(TYPES.CourseModalPresenter).toDynamicValue(() => {
  return new CourseModalPresenter()
})

export default container
