import { buildTicket, generateUserCookie } from './../../test/setup'
import req from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { Order, OrderStatus } from '../../models'
import { natsWrapper } from '../../natsWrapper'

it('returns an error if the ticket does not exist', async () => {
  const ticketId = mongoose.Types.ObjectId()
  await req(app)
    .post('/api/orders')
    .set('Cookie', generateUserCookie())
    .send({ ticketId })
    .expect(404)
})

it('returns an error if the ticket is reserved', async () => {
  const ticket = await buildTicket()
  const order = Order.build({
    userId: 'aawftahwfiet',
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket
  })
  await order.save()

  await req(app)
    .post('/api/orders')
    .set('Cookie', generateUserCookie())
    .send({ ticketId: ticket.id })
    .expect(400)
})

it('reserves a ticket', async () => {
  const ticket = await buildTicket()

  await req(app)
    .post('/api/orders')
    .set('Cookie', generateUserCookie())
    .send({ ticketId: ticket.id })
    .expect(201)
})

it('publishes an order:created event', async () => {
  const ticket = await buildTicket()

  await req(app)
    .post('/api/orders')
    .set('Cookie', generateUserCookie())
    .send({ ticketId: ticket.id })
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
