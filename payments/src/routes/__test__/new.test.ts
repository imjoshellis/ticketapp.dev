import { generateUserCookie } from './../../test/setup'
import req from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { Order, Payment } from '../../models'
import { OrderStatus } from '@ije-ticketapp/common'
import { stripe } from '../../stripe'

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

it('returns error with an invalid stripe token', async () => {
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

  const token = 'invalid'

  await req(app)
    .post('/api/payments')
    .send({ token, orderId: order.id })
    .set('Cookie', generateUserCookie(userId))
    .expect(400)
})

it('returns a 201 with valid inputs', async () => {
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

  const token = 'tok_visa'

  const res = await req(app)
    .post('/api/payments')
    .send({ token, orderId: order.id })
    .set('Cookie', generateUserCookie(userId))
    .expect(201)

  expect(res.body.success).toBe(true)

  expect(stripe.charges.create).toHaveBeenCalled()

  const chargeMock = stripe.charges.create as jest.Mock
  const chargeOptions = chargeMock.mock.calls[0][0]

  expect(chargeOptions.amount).toBe(order.price * 100)
  expect(chargeOptions.currency).toBe('usd')
  expect(chargeOptions.source).toBe(token)

  const payment = await Payment.findOne({ orderId: order.id })
  expect(payment).toBeDefined()

  if (!payment) throw new Error('payment not found')

  expect(payment.stripeId).toBe(res.body.stripeId)
  expect(payment.orderId).toBe(order.id)
})
