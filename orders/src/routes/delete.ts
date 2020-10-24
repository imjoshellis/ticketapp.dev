import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth
} from '@ije-ticketapp/common'
import { Application, Request, Response } from 'express'
import { OrderCancelledPublisher } from '../events'
import { Order } from '../models'
import { natsWrapper } from '../natsWrapper'

export const addDeleteRoute = (app: Application) => {
  app.delete(
    '/api/orders/:id',
    requireAuth,
    async (req: Request, res: Response) => {
      const order = await Order.findById(req.params.id).populate('ticket')

      if (!order) throw new NotFoundError()
      if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError()

      order.status = OrderStatus.Cancelled
      await order.save()

      new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: { id: order.ticket.id }
      })

      res.send(order)
    }
  )
}
