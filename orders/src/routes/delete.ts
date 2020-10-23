import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth
} from '@ije-ticketapp/common'
import { Application, Request, Response } from 'express'
import { Order } from '../models'

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

      res.send(order)
    }
  )
}
