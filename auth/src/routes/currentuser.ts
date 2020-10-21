import { Application } from 'express'

export const addCurrentUserRoute = (app: Application) => {
  app.get('/api/users/currentuser', (_, res) => {
    res.send('current user')
  })
}
