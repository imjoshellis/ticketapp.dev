import req from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models'
import { generateUserCookie } from './../../test/setup'

const buildTicket = async () => {
  const ticket = Ticket.build({ price: 20, title: 'title' })
  await ticket.save()
  return ticket
}

it('fetches orders for a particular user', async () => {
  const ticket1 = await buildTicket()
  const ticket2 = await buildTicket()
  const ticket3 = await buildTicket()

  const user1 = generateUserCookie()
  const user2 = generateUserCookie()

  await req(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket1.id })
    .expect(201)

  const { body: order1 } = await req(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket2.id })
    .expect(201)

  const { body: order2 } = await req(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket3.id })
    .expect(201)

  const { body: orders } = await req(app)
    .get('/api/orders')
    .set('Cookie', user2)
    .expect(200)

  expect(orders).toHaveLength(2)
  expect(orders[0]).toEqual(order1)
  expect(orders[1]).toEqual(order2)
})
