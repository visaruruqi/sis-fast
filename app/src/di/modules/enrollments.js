/**
 * Enrollments Feature DI Module
 * Contains all dependency bindings for the enrollments feature
 */
import { TYPES } from '../types'
import EnrollmentGateway from '../../features/enrollments/gateways/EnrollmentGateway'
import EnrollmentRepository from '../../features/enrollments/repositories/EnrollmentRepository'
import EnrollmentModalPresenter from '../../features/enrollments/presenters/EnrollmentModalPresenter'

/**
 * Configure all enrollment-related bindings
 * @param {Container} container - The Inversify container
 */
export function configureEnrollmentsModule(container) {
  // Gateways (stateless, can be singletons)
  container.bind(TYPES.EnrollmentGateway).toConstantValue(new EnrollmentGateway())

  // Repositories (singleton - hold permanent state)
  container.bind(TYPES.EnrollmentRepository).toDynamicValue(ctx => {
    return new EnrollmentRepository(ctx.get(TYPES.EnrollmentGateway))
  }).inSingletonScope()

  // Presenters (transient - no permanent state)
  container.bind(TYPES.EnrollmentModalPresenter).toDynamicValue(ctx => {
    return new EnrollmentModalPresenter(ctx.get(TYPES.EnrollmentRepository))
  })
}
