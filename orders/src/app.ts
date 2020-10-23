import { currentUser, errorHandler, NotFoundError } from '@ije-ticketapp/common'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import express from 'express'
import 'express-async-errors'
import {
  addAllRoute,
  addDeleteRoute,
  addNewRoute,
  addShowRoute
} from './routes'

const app = express()
app.set('trust proxy', true)
app.use(json())

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
)

app.use(currentUser)

addNewRoute(app)
addShowRoute(app)
addDeleteRoute(app)
addAllRoute(app)

app.all('*', () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
