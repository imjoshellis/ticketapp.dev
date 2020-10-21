import { json } from 'body-parser'
import express from 'express'
import 'express-async-errors'
import { NotFoundError } from './errors/NotFoundError'
import { errorHandler } from './middlewares'
import {
  addCurrentUserRoute,
  addSignInRoute,
  addSignOutRoute,
  addSignUpRoute
} from './routes'
import mongoose from 'mongoose'
import cookieSession from 'cookie-session'

const app = express()
app.set('trust proxy', true)
app.use(json())

app.use(cookieSession({ signed: false, secure: true }))

addCurrentUserRoute(app)
addSignInRoute(app)
addSignUpRoute(app)
addSignOutRoute(app)

app.all('*', () => {
  throw new NotFoundError()
})

app.use(errorHandler)

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log('Connected to MongoDB')
  } catch (err) {
    console.error(err)
  }
}

start()

app.listen(3000, () => {
  console.log('Listening on 3000')
})
