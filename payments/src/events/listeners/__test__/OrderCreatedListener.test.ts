import { OrderCreatedEvent, OrderStatus } from '@ije-ticketapp/common'
import { natsWrapper } from '../../../natsWrapper'
import { OrderCreatedListener } from '../OrderCreatedListener'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Order } from '../../../models'

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client)

  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: 'arst',
    expiresAt: 'arst',
    status: OrderStatus.Created,
    ticket: {
      id: 'arst',
      price: 20
    }
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg }
}

it('correctly replicates the data', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const order = await Order.findById(data.id)

  expect(order).toBeDefined()
  if (!order) throw new Error('Order not found')

  expect(order.status).toEqual(data.status)
  expect(order.price).toEqual(data.ticket.price)
  expect(order.userId).toEqual(data.userId)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
