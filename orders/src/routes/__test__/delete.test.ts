import req from 'supertest'
import { app } from '../../app'
import { Order, OrderStatus, Ticket } from '../../models'
import { generateUserCookie } from './../../test/setup'
import mongoose from 'mongoose'

const buildTicket = async () => {
  const ticket = Ticket.build({ price: 20, title: 'title' })
  await ticket.save()
  return ticket
}
import { natsWrapper } from '../../natsWrapper'

it('returns 404 if order does not exist', async () => {
  await req(app)
    .delete('/api/orders/' + mongoose.Types.ObjectId())
    .set('Cookie', generateUserCookie())
    .expect(404)
})

it('returns 401 if order does not belong to user', async () => {
  const ticket = await buildTicket()

  const user1 = generateUserCookie()
  const user2 = generateUserCookie()

  const { body: order } = await req(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket.id })
    .expect(201)

  await req(app)
    .delete('/api/orders/' + order.id)
    .set('Cookie', user2)
    .expect(401)
})

it('cancels correct order for authorized user', async () => {
  const ticket = await buildTicket()

  const user1 = generateUserCookie()

  const { body: createOrder } = await req(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket.id })
    .expect(201)

  const { body: showOrder } = await req(app)
    .delete('/api/orders/' + createOrder.id)
    .set('Cookie', user1)
    .expect(200)

  expect(showOrder.id).toBe(createOrder.id)

  const databaseOrder = await Order.findById(createOrder.id)

  expect(databaseOrder?.status).toBe(OrderStatus.Cancelled)
})

it('publishes an order:canceled event', async () => {
  const ticket = await buildTicket()
  const user1 = generateUserCookie()

  const { body: createOrder } = await req(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket.id })
    .expect(201)

  await req(app)
    .delete('/api/orders/' + createOrder.id)
    .set('Cookie', user1)
    .expect(200)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
