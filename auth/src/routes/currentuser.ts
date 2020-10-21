import jwt from 'jsonwebtoken'
import { Application } from 'express'

export const addCurrentUserRoute = (app: Application) => {
  app.get('/api/users/currentuser', (req, res) => {
    if (!req.session?.userJwt) return res.send({ currentUser: null })
    try {
      const currentUser = jwt.verify(req.session.userJwt, process.env.JWT_KEY!)
      return res.send({ currentUser })
    } catch (e) {
      return res.send({ currentUser: null })
    }
  })
}
