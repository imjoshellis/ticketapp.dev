import { generateUserCookie } from './../../test/setup'
import req from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { Order } from '../../models'
import { OrderStatus } from '@ije-ticketapp/common'

it('returns a 404 if the order does not exist', async () => {
  const orderId = mongoose.Types.ObjectId().toHexString()
  await req(app)
    .post('/api/payments')
    .send({ token: 'arst', orderId })
    .set('Cookie', generateUserCookie())
    .expect(404)
})

it('returns a 401 if the user does not match the order', async () => {
  const id = mongoose.Types.ObjectId().toHexString()
  const userId = mongoose.Types.ObjectId().toHexString()

  const order = Order.build({
    id,
    price: 20,
    status: OrderStatus.Created,
    userId,
    version: 0
  })
  await order.save()

  await req(app)
    .post('/api/payments')
    .send({ token: 'arst', orderId: order.id })
    .set('Cookie', generateUserCookie())
    .expect(401)
})

it('returns a 400 if the order is cancelled', async () => {
  const id = mongoose.Types.ObjectId().toHexString()
  const userId = mongoose.Types.ObjectId().toHexString()

  const order = Order.build({
    id,
    price: 20,
    status: OrderStatus.Cancelled,
    userId,
    version: 0
  })
  await order.save()

  await req(app)
    .post('/api/payments')
    .send({ token: 'arst', orderId: order.id })
    .set('Cookie', generateUserCookie(userId))
    .expect(400)
})

it('returns a 201 when successful', async () => {
  const id = mongoose.Types.ObjectId().toHexString()
  const userId = mongoose.Types.ObjectId().toHexString()

  const order = Order.build({
    id,
    price: 20,
    status: OrderStatus.Created,
    userId,
    version: 0
  })
  await order.save()

  const res = await req(app)
    .post('/api/payments')
    .send({ token: 'arst', orderId: order.id })
    .set('Cookie', generateUserCookie(userId))
    .expect(201)

  expect(res.body.success).toBe(true)
})
