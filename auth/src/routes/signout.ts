import { Application } from 'express'

export const addSignOutRoute = (app: Application) => {
  app.post('/api/users/signout', (req, res) => {
    req.session = null
    res.send({})
  })
}
