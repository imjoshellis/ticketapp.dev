import { CustomError, SerializedErrors } from './CustomError'

export class NotFoundError extends CustomError {
  statusCode = 404
  constructor () {
    super('Not found')

    Object.setPrototypeOf(this, NotFoundError.prototype)
  }

  serializeErrors = () => [{ message: 'Not found' }] as SerializedErrors
}
