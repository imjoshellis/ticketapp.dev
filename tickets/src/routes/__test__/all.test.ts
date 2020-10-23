import req from 'supertest'
import { app } from '../../app'
import { generateUserCookie } from '../../test/setup'

const createTicket = () => {
  const title = 'title'
  const price = 10
  return req(app)
    .post('/api/tickets')
    .set('Cookie', generateUserCookie())
    .send({ title, price })
    .expect(201)
}

it('can fetch a list of tickets', async () => {
  const resEmpty = await req(app)
    .get('/api/tickets')
    .expect(200)

  expect(resEmpty.body.length).toEqual(0)

  const n = 3
  for (let i = 0; i < n; i++) {
    await createTicket()
  }

  const res = await req(app)
    .get('/api/tickets')
    .expect(200)

  expect(res.body.length).toEqual(n)
})
