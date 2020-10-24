import { Message } from 'node-nats-streaming'
import { Ticket, Order } from '../../../models'
import {
  ExpirationCompleteEvent,
  OrderStatus,
  Subjects
} from '@ije-ticketapp/common'
import { natsWrapper } from './../../../natsWrapper'
import { ExpirationCompleteListener } from '../ExpirationCompleteListener'
import mongoose from 'mongoose'

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client)

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    price: 20,
    title: 'title'
  })
  await ticket.save()

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'arst',
    expiresAt: new Date(),
    ticket
  })
  await order.save()

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg, order, ticket }
}

it('cancels an order', async () => {
  const { listener, data, msg } = await setup()

  const createdOrder = await Order.findById(data.orderId)
  expect(createdOrder).toBeDefined()
  if (!createdOrder) throw new Error('order not found')
  expect(createdOrder.status).toBe(OrderStatus.Created)

  await listener.onMessage(data, msg)
  const cancelledOrder = await Order.findById(data.orderId)

  expect(cancelledOrder).toBeDefined()
  if (!cancelledOrder) throw new Error('order not found')

  expect(cancelledOrder.status).toBe(OrderStatus.Cancelled)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})

it('publishes an order:cancelled event', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1)

  const filteredCalls = (natsWrapper.client
    .publish as jest.Mock).mock.calls.filter(
    c => c[0] === Subjects.OrderCancelled
  ).length

  expect(filteredCalls).toBe(1)
})
