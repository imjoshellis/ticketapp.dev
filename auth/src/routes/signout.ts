import { Application } from 'express'

export const addSignOutRoute = (app: Application) => {
  app.post('/api/users/signout', (_, res) => {
    res.send('signout')
  })
}
