import { Container } from 'inversify'
import { TYPES } from './types'
import store from '../store'
import StudentGateway from '../gateways/StudentGateway'
import StudentRepository from '../repositories/StudentRepository'
import StudentsPresenter from '../presenters/StudentsPresenter'

const container = new Container()

container.bind(TYPES.Store).toConstantValue(store)
container.bind(TYPES.StudentGateway).toConstantValue(new StudentGateway())
// Inversify v7's context object exposes helper methods like `get` rather than
// the older `context.container.get` API. Use `ctx.get` for compatibility.
container.bind(TYPES.StudentRepository).toDynamicValue(ctx => {
  return new StudentRepository(
    ctx.get(TYPES.Store),
    ctx.get(TYPES.StudentGateway)
  )
}).inSingletonScope()
container.bind(TYPES.StudentsPresenter).toDynamicValue(ctx => {
  return new StudentsPresenter(ctx.get(TYPES.StudentRepository))
})

export default container
