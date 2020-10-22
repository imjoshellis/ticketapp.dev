import { json } from 'body-parser'
import express from 'express'
import 'express-async-errors'
import { errorHandler, NotFoundError } from '@ije-ticketapp/common'
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

app.all('*', () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
