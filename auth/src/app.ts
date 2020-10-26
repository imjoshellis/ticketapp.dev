import { json } from 'body-parser'
import express from 'express'
import 'express-async-errors'
import { errorHandler, NotFoundError } from '@ije-ticketapp/common'
import cookieSession from 'cookie-session'
import { addCurrentUserRoute } from './routes/currentUser'
import { addSignInRoute } from './routes/signIn'
import { addSignOutRoute } from './routes/signOut'
import { addSignUpRoute } from './routes/signUp'

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
