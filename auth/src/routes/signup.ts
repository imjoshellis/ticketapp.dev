import { BadRequestError, validateRequest } from '@ije-ticketapp/common'
import { Application, Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import { User } from '../models'

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
    validateRequest,
    async (req: Request, res: Response) => {
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
        process.env.JWT_KEY!
      )

      req.session = { userJwt }

      return res.status(201).send(user)
    }
  )
}
