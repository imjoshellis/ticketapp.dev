import { NotFoundError } from '@ije-ticketapp/common'
import { Application, Request, Response } from 'express'
import { Ticket } from '../../models'

export const addShowRoute = (app: Application) => {
  app.get('/api/tickets/:id', async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      const ticket = await Ticket.findById(id)
      if (!ticket) throw new NotFoundError()
      res.send(ticket)
    } catch (e) {
      throw new NotFoundError()
    }
  })
}
