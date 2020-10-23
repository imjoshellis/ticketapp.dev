import { body } from 'express-validator'
import { requireAuth, validateRequest } from '@ije-ticketapp/common'
import { Application, Request, Response } from 'express'

export const addNewRoute = (app: Application) => {
  app.post(
    '/api/orders',
    requireAuth,
    [
      body('ticketId')
        .not()
        .isEmpty()
        .withMessage('Ticket id must be defined')
    ],
    validateRequest,
    async (_req: Request, res: Response) => {
      res.send({})
    }
  )
}
