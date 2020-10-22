import { CustomError, SerializedErrors } from './CustomError'

export class NotAuthorizedError extends CustomError {
  statusCode = 401
  constructor () {
    super('Not authorized')
    Object.setPrototypeOf(this, NotAuthorizedError.prototype)
  }
  serializeErrors = () => [{ message: 'Not authorized' }] as SerializedErrors
}
