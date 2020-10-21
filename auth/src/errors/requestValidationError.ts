import { ValidationError } from 'express-validator'
import { CustomError, SerializedErrors } from './CustomError'

export class RequestValidationError extends CustomError {
  statusCode = 400
  constructor (public errors: ValidationError[]) {
    super('Invalid request params')

    Object.setPrototypeOf(this, RequestValidationError.prototype)
  }

  serializeErrors = () =>
    this.errors.map(err => ({
      message: err.msg,
      field: err.param
    })) as SerializedErrors
}
