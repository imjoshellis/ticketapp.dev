import { Application } from 'express'

export const addSignupRoute = (app: Application) => {
  app.post('/api/users/signup', (_, res) => {
    res.send('signup')
  })
}
