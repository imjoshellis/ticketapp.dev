import { Application } from 'express'

export const addSignInRoute = (app: Application) => {
  app.post('/api/users/signin', (_, res) => {
    res.send('signin')
  })
}
