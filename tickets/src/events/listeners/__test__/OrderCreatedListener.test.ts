import { OrderCreatedEvent, OrderStatus } from '@ije-ticketapp/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models'
import { OrderCreatedListener } from '../OrderCreatedListener'
import { natsWrapper } from './../../../natsWrapper'

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client)
  const ticket = Ticket.build({ title: 'title', price: 20, userId: 'arst' })
  await ticket.save()
  const data: OrderCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: 'arst',
    expiresAt: 'arst',
    ticket: { id: ticket.id, price: ticket.price }
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg, ticket }
}

it('sets the orderId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup()
  await listener.onMessage(data, msg)
  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket).toBeDefined()
  if (!updatedTicket) throw new Error('ticket not found')

  expect(updatedTicket.orderId).toBe(data.id)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
