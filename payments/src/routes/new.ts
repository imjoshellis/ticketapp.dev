import { natsWrapper } from './../natsWrapper'
import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest
} from '@ije-ticketapp/common'
import { Application, Request, Response } from 'express'
import { body } from 'express-validator'
import { Order } from '../models'

export const addNewRoute = (app: Application) => {
  app.post(
    '/api/payments',
    requireAuth,
    [
      body('token')
        .not()
        .isEmpty()
        .withMessage('Token must be defined'),
      body('orderId')
        .not()
        .isEmpty()
        .withMessage('Order id must be defined')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      res.status(201).send({ success: true })
    }
  )
}
