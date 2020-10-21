import { CustomError, SerializedErrors } from './customError'

export class NotFoundError extends CustomError {
  statusCode = 404
  constructor () {
    super('Not found')

    Object.setPrototypeOf(this, NotFoundError.prototype)
  }

  serializeErrors = () => [{ message: 'Not found' }] as SerializedErrors
}
