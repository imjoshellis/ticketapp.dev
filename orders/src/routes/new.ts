import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest
} from '@ije-ticketapp/common'
import { Application, Request, Response } from 'express'
import { body } from 'express-validator'
import { Order, Ticket, OrderStatus } from '../models'

const EXPIRATION_WINDOW_SECONDS = 15 * 60

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
    async (req: Request, res: Response) => {
      const { ticketId } = req.body

      const ticket = await Ticket.findById(ticketId)
      if (!ticket) throw new NotFoundError()
      if (await ticket.isReserved())
        throw new BadRequestError('Ticket is already reserved')

      const expiresAt = new Date()
      expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_WINDOW_SECONDS)

      const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt,
        ticket
      })

      await order.save()

      res.status(201).send(order)
    }
  )
}
