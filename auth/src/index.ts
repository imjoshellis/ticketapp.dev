import express from 'express'
import { json } from 'body-parser'
import {
  addCurrentUserRoute,
  addSigninRoute,
  addSignoutRoute,
  addSignupRoute
} from './routes'

const app = express()
app.use(json())

addCurrentUserRoute(app)
addSigninRoute(app)
addSignupRoute(app)
addSignoutRoute(app)

app.listen(3000, () => {
  console.log('Listening on 3000')
})
