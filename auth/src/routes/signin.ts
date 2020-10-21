import { Application, Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import { BadRequestError } from '../errors'
import { User } from '../models'
import { PasswordManager } from '../services'
import { validateRequest } from './../middlewares'

export const addSignInRoute = (app: Application) => {
  app.post(
    '/api/users/signin',
    [
      body('email')
        .isEmail()
        .withMessage('Email must be valid'),
      body('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { email, password } = req.body

      const user = await User.findOne({ email })
      if (!user || !(await PasswordManager.compare(user.password, password)))
        throw new BadRequestError('Invalid credentials')

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
