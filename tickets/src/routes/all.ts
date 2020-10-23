import { Application, Request, Response } from 'express'
import { Ticket } from '../../models'

export const addAllRoute = (app: Application) => {
  app.get('/api/tickets', async (_req: Request, res: Response) => {
    const tickets = await Ticket.find({})
    res.send(tickets)
  })
}
