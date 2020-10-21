import { Application, NextFunction, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { BadRequestError, RequestValidationError } from '../errors'
import { User } from '../models'
import jwt from 'jsonwebtoken'

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
    async (req: Request, res: Response, _next: NextFunction) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array())
      }

      const { email, password } = req.body

      const existingUser = await User.findOne({ email })
      if (existingUser) throw new BadRequestError('Email already in use')

      const user = User.build({ email, password })
      await user.save()

      const userJwt = jwt.sign(
        {
          id: user.id,
          email: user.email
        },
        'arst'
      )

      req.session = { userJwt }

      return res.status(201).send(user)
    }
  )
}
