import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError
} from '@ije-ticketapp/common'
import { Application, Request, Response } from 'express'
import { Order } from '../models'

export const addShowRoute = (app: Application) => {
  app.get(
    '/api/orders/:id',
    requireAuth,
    async (req: Request, res: Response) => {
      const order = await Order.findById(req.params.id).populate('ticket')
      if (!order) throw new NotFoundError()
      if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError()
      res.send(order)
    }
  )
}
