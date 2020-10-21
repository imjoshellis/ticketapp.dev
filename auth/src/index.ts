import { errorHandler } from './middlewares/errorHandler'
import express from 'express'
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

app.use(errorHandler)

app.listen(3000, () => {
  console.log('Listening on 3000')
})
