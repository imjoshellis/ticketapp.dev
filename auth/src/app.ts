import { json } from 'body-parser'
import express from 'express'
import 'express-async-errors'
import { errorHandler, NotFoundError } from '@ije-ticketapp/common'
import {
  addCurrentUserRoute,
  addSignInRoute,
  addSignOutRoute,
  addSignUpRoute
} from './routes'
import cookieSession from 'cookie-session'

const app = express()
app.set('trust proxy', true)
app.use(json())

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
)

addCurrentUserRoute(app)
addSignInRoute(app)
addSignUpRoute(app)
addSignOutRoute(app)

app.all('*', () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
