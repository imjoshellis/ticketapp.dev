type SerializedError = {
  message: string
  field?: string
}

export type SerializedErrors = [SerializedError, ...SerializedError[]]

export abstract class CustomError extends Error {
  abstract statusCode: number
  constructor (message: string) {
    super(message)

    Object.setPrototypeOf(this, CustomError.prototype)
  }

  abstract serializeErrors (): SerializedErrors
}
