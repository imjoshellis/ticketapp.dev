import { body } from 'express-validator'
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest
} from '@ije-ticketapp/common'
import { Application, Request, Response } from 'express'
import { Ticket } from '../models'
import { natsWrapper } from '../natsWrapper'
import { TicketUpdatedPublisher } from '../events/publishers/TicketUpdatedPublisher'

export const addUpdateRoute = (app: Application) => {
  app.put(
    '/api/tickets/:id',
    requireAuth,
    [
      body('title')
        .notEmpty()
        .withMessage('Title is required'),
      body('price')
        .isFloat({ gt: 0 })
        .withMessage('Price must be greater than zero')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { title, price } = req.body
      const { id } = req.params
      let ticket

      try {
        ticket = await Ticket.findById(id)
      } catch (e) {
        throw new NotFoundError()
      }

      if (!ticket) throw new NotFoundError()

      if (ticket.userId !== req.currentUser!.id) throw new NotAuthorizedError()

      ticket.set({ title, price })
      await ticket.save()

      new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id as string,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId
      })

      res.send(ticket)
    }
  )
}
