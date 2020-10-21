import { RequestValidationError } from '../errors'
import { Application, NextFunction, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { DatabaseConnectionError } from '../errors'

export const addSignUpRoute = (app: Application) => {
  app.post(
    '/api/users/signup',
    [
      body('email')
        .isEmail()
        .withMessage('Email must be valid'),
      body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters')
    ],
    (req: Request, _res: Response, _next: NextFunction) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array())
      }
      // const { email, password } = req.body
      console.log('Creating a user...')
      throw new DatabaseConnectionError()
      // return res.send({ email, password })
    }
  )
}
