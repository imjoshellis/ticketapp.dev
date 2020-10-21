import { Application, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'

export const addSignupRoute = (app: Application) => {
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
    (req: Request, res: Response) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).send(errors.array())
      }
      const { email, password } = req.body
      console.log('Creating a user...')
      return res.send({ email, password })
    }
  )
}
