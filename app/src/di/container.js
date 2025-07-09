import { Container } from 'inversify'
import { TYPES } from './types'
import store from '../store'
import StudentGateway from '../gateways/StudentGateway'
import StudentRepository from '../repositories/StudentRepository'
import StudentsPresenter from '../presenters/StudentsPresenter'

const container = new Container()

container.bind(TYPES.Store).toConstantValue(store)
container.bind(TYPES.StudentGateway).toConstantValue(new StudentGateway())
container.bind(TYPES.StudentRepository).toDynamicValue(ctx => {
  return new StudentRepository(
    ctx.container.get(TYPES.Store),
    ctx.container.get(TYPES.StudentGateway)
  )
}).inSingletonScope()
container.bind(TYPES.StudentsPresenter).toDynamicValue(ctx => {
  return new StudentsPresenter(ctx.container.get(TYPES.StudentRepository))
})

export default container
