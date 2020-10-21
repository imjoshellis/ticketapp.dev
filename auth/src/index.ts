import { NotFoundError } from './errors/notFoundError'
import { errorHandler } from './middlewares/errorHandler'
import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import {
  addCurrentUserRoute,
  addSignInRoute,
  addSignOutRoute,
  addSignUpRoute
} from './routes'
import mongoose from 'mongoose'

const app = express()
app.use(json())

addCurrentUserRoute(app)
addSignInRoute(app)
addSignUpRoute(app)
addSignOutRoute(app)

app.all('*', () => {
  throw new NotFoundError()
})

app.use(errorHandler)

const start = async () => {
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
