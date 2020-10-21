import { CustomError, SerializedErrors } from './CustomError'

export class BadRequestError extends CustomError {
  statusCode = 400
  constructor (public message: string) {
    super(message)

    Object.setPrototypeOf(this, BadRequestError.prototype)
  }

  serializeErrors = () => [{ message: this.message }] as SerializedErrors
}
