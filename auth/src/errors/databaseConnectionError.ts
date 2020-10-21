import { CustomError, SerializedErrors } from './CustomError'

export class DatabaseConnectionError extends CustomError {
  statusCode = 500
  reason = 'Error connecting to database'
  constructor () {
    super('Error connecting to database')

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }

  serializeErrors = () => [{ message: this.reason }] as SerializedErrors
}
