import { requireAuth } from '@ije-ticketapp/common'
import { Application, Request, Response } from 'express'
import { Order } from '../models'

export const addAllRoute = (app: Application) => {
  app.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
    const orders = await Order.find({ userId: req.currentUser!.id }).populate(
      'ticket'
    )
    res.send(orders)
  })
}
