import { Application } from 'express'

export const addSignoutRoute = (app: Application) => {
  app.post('/api/users/signout', (_, res) => {
    res.send('signout')
  })
}
