import { Application, Request, Response } from 'express'

export const addAllRoute = (app: Application) => {
  app.get('/api/orders', async (_req: Request, res: Response) => {
    res.send({})
  })
}
