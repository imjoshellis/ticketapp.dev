import { Application, Request, Response } from 'express'

export const addDeleteRoute = (app: Application) => {
  app.delete('/api/orders/:id', async (_req: Request, res: Response) => {
    res.send({})
  })
}
