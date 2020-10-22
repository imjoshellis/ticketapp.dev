import { NotAuthorizedError } from '../errors'
import { Request, Response, NextFunction } from 'express'

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) throw new NotAuthorizedError()
  next()
}
