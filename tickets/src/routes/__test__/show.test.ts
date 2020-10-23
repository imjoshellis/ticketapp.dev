import req from 'supertest'
import { app } from '../../app'
import { generateUserCookie } from '../../test/setup'
import mongoose from 'mongoose'

it('returns 404 if the id is invalid format', async () => {
  await req(app)
    .get('/api/tickets/ieawfhtiaehrstawftieharst')
    .expect(404)
})

it('returns 404 if the id is valid format but not found', async () => {
  const id = mongoose.Types.ObjectId().toHexString()
  await req(app)
    .get('/api/tickets/' + id)
    .expect(404)
})

it('returns the ticket if the ticket is found', async () => {
  const title = 'title'
  const price = 10

  const createRes = await req(app)
    .post('/api/tickets')
    .set('Cookie', generateUserCookie())
    .send({ title, price })
    .expect(201)

  const showRes = await req(app)
    .get('/api/tickets/' + createRes.body.id)
    .expect(200)

  expect(showRes.body.title).toEqual(title)
  expect(showRes.body.price).toEqual(price)
})
