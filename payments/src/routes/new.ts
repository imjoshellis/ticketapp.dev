// import { natsWrapper } from './../natsWrapper'
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest
} from '@ije-ticketapp/common'
import { Application, Request, Response } from 'express'
import { body } from 'express-validator'
import { Order } from '../models'
import { stripe } from '../stripe'

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
      const { token, orderId } = req.body
      const order = await Order.findById(orderId)

      if (!order) throw new NotFoundError()
      if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError()
      if (order.status !== OrderStatus.Created)
        throw new BadRequestError(`Order status is ${order.status}`)

      stripe.charges.create({
        amount: order.price * 100,
        source: token,
        currency: 'usd'
      })

      res.status(201).send({ success: true })
    }
  )
}
