import { Application } from 'express'

export const addSigninRoute = (app: Application) => {
  app.post('/api/users/signin', (_, res) => {
    res.send('signin')
  })
}
