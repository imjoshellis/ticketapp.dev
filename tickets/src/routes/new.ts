import { natsWrapper } from './../natsWrapper'
import { body } from 'express-validator'
import { requireAuth, validateRequest } from '@ije-ticketapp/common'
import { Application, Request, Response } from 'express'
import { Ticket } from '../models'
import { TicketCreatedPublisher } from '../events/publishers/TicketCreatedPublisher'

export const addNewRoute = (app: Application) => {
  app.post(
    '/api/tickets',
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

      const ticket = Ticket.build({
        title,
        price,
        userId: req.currentUser!.id
      })
      await ticket.save()

      new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        version: ticket.version,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId
      })

      return res.status(201).send(ticket)
    }
  )
}
