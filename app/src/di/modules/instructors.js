/**
 * Instructors Feature DI Module
 * Contains all dependency bindings for the instructors feature
 */
import { TYPES } from '../types'
import InstructorGateway from '../../features/instructors/gateways/InstructorGateway'
import InstructorRepository from '../../features/instructors/repositories/InstructorRepository'
import InstructorsPresenter from '../../features/instructors/presenters/InstructorsPresenter'
import InstructorModalPresenter from '../../features/instructors/presenters/InstructorModalPresenter'

/**
 * Configure all instructor-related bindings
 * @param {Container} container - The Inversify container
 */
export function configureInstructorsModule(container) {
  // Gateways (stateless, can be singletons)
  container.bind(TYPES.InstructorGateway).toConstantValue(new InstructorGateway())

  // Repositories (singleton - hold permanent state)
  container.bind(TYPES.InstructorRepository).toDynamicValue(ctx => {
    return new InstructorRepository(ctx.get(TYPES.InstructorGateway))
  }).inSingletonScope()

  // Presenters (transient - no permanent state)
  container.bind(TYPES.InstructorsPresenter).toDynamicValue(ctx => {
    return new InstructorsPresenter(ctx.get(TYPES.InstructorRepository))
  })

  container.bind(TYPES.InstructorModalPresenter).toDynamicValue(() => {
    return new InstructorModalPresenter()
  })
}
