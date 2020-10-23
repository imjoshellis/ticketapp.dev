import { Application, Request, Response } from 'express'

export const addShowRoute = (app: Application) => {
  app.get('/api/orders/:id', async (_req: Request, res: Response) => {
    res.send({})
  })
}
