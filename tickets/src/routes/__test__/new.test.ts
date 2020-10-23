import { generateUserCookie } from './../../test/setup'
import { Ticket } from '../../../models'
import req from 'supertest'
import { app } from '../../app'

it('has a route handler listening to /api/tickets for post requests', async () => {
  const res = await req(app)
    .post('/api/tickets')
    .send({})

  expect(res.status).not.toEqual(404)
})

it('returns 401 if the user is not signed in', async () => {
  await req(app)
    .post('/api/tickets')
    .send({})
    .expect(401)
})

it('does not return 401 if the user is signed in', async () => {
  const res = await req(app)
    .post('/api/tickets')
    .set('Cookie', generateUserCookie())
    .send({})

  expect(res.status).not.toEqual(401)
})

it('returns an error if invalid title is provided', async () => {
  await req(app)
    .post('/api/tickets')
    .set('Cookie', generateUserCookie())
    .send({ title: '', price: 10 })
    .expect(400)

  await req(app)
    .post('/api/tickets')
    .set('Cookie', generateUserCookie())
    .send({ price: 10 })
    .expect(400)
})

it('returns an error if invalid title is provided', async () => {
  await req(app)
    .post('/api/tickets')
    .set('Cookie', generateUserCookie())
    .send({ title: 'title', price: -10 })
    .expect(400)

  await req(app)
    .post('/api/tickets')
    .set('Cookie', generateUserCookie())
    .send({ title: 'title' })
    .expect(400)
})

it('creates a ticket with valid inputs', async () => {
  const startTickets = await Ticket.find({})
  expect(startTickets.length).toEqual(0)

  const title = 'arstarsteawfth'
  const price = 23
  await req(app)
    .post('/api/tickets')
    .set('Cookie', generateUserCookie())
    .send({ title, price })
    .expect(201)

  const endTickets = await Ticket.find({})
  expect(endTickets.length).toEqual(1)

  expect(endTickets[0].title).toEqual(title)
  expect(endTickets[0].price).toEqual(price)
})
