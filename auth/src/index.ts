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

app.listen(3000, () => {
  console.log('Listening on 3000')
})
