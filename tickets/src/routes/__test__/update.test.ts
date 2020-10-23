import req from 'supertest'
import { app } from '../../app'
import { generateUserCookie } from '../../test/setup'
import mongoose from 'mongoose'
import { natsWrapper } from '../../natsWrapper'

const validTitle = 'title'
const validPrice = 10
const validTicket = { title: validTitle, price: validPrice }

const createTicket = () => {
  return req(app)
    .post('/api/tickets')
    .set('Cookie', generateUserCookie())
    .send(validTicket)
    .expect(201)
}

it('returns a 404 if the provided id does not exist', async () => {
  const id = mongoose.Types.ObjectId().toHexString()
  await req(app)
    .put('/api/tickets/' + id)
    .set('Cookie', generateUserCookie())
    .send(validTicket)
    .expect(404)
})

it('returns a 404 if the provided id is invalid', async () => {
  await req(app)
    .put('/api/tickets/ahwefhtaerst')
    .set('Cookie', generateUserCookie())
    .send(validTicket)
    .expect(404)
})

it('returns a 401 if the user is not authenticated', async () => {
  const id = mongoose.Types.ObjectId().toHexString()
  await req(app)
    .put('/api/tickets/' + id)
    .send(validTicket)
    .expect(401)
})

it('returns a 401 if the user does not own the ticket', async () => {
  const {
    body: { id }
  } = await createTicket()

  await req(app)
    .put('/api/tickets/' + id)
    .set('Cookie', generateUserCookie('badUserId'))
    .send(validTicket)
    .expect(401)
})

it('returns a 400 if the user provides an invalid title or price', async () => {
  const createRes = await createTicket()

  await req(app)
    .put('/api/tickets/' + createRes.body.id)
    .send({ ...validTicket, price: -10 })
    .set('Cookie', generateUserCookie())
    .expect(400)

  await req(app)
    .put('/api/tickets/' + createRes.body.id)
    .send({ ...validTicket, title: '' })
    .set('Cookie', generateUserCookie())
    .expect(400)
})

it('updates the ticket with valid inputs', async () => {
  const newTitle = 'new ' + validTitle
  const newPrice = 20 + validPrice
  const newTicket = { title: newTitle, price: newPrice }
  const createRes = await createTicket()

  const updateRes = await req(app)
    .put('/api/tickets/' + createRes.body.id)
    .send(newTicket)
    .set('Cookie', generateUserCookie())
    .expect(200)

  expect(updateRes.body.price).toEqual(newTicket.price)
  expect(updateRes.body.title).toEqual(newTicket.title)

  const showRes = await req(app)
    .get('/api/tickets/' + createRes.body.id)
    .expect(200)

  expect(showRes.body.price).toEqual(newTicket.price)
  expect(showRes.body.title).toEqual(newTicket.title)
})

it('publishes an event', async () => {
  const newTitle = 'new ' + validTitle
  const newPrice = 20 + validPrice
  const newTicket = { title: newTitle, price: newPrice }
  const createRes = await createTicket()

  await req(app)
    .put('/api/tickets/' + createRes.body.id)
    .send(newTicket)
    .set('Cookie', generateUserCookie())
    .expect(200)

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2)
})
