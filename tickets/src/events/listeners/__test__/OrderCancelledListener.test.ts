import { OrderCancelledEvent, Subjects } from '@ije-ticketapp/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models'
import { OrderCancelledListener } from '../OrderCancelledListener'
import { natsWrapper } from '../../../natsWrapper'

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)
  const ticket = Ticket.build({ title: 'title', price: 20, userId: 'arst' })
  const orderId = mongoose.Types.ObjectId().toHexString()
  ticket.set({ orderId })
  await ticket.save()

  const data: OrderCancelledEvent['data'] = {
    version: 0,
    id: orderId,
    ticket: { id: ticket.id }
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg, ticket }
}

it('clears the orderId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup()
  await listener.onMessage(data, msg)
  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket).toBeDefined()
  if (!updatedTicket) throw new Error('ticket not found')

  expect(updatedTicket.orderId).toBeUndefined()
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalledTimes(1)
})

it('publishes a ticket:updated event', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1)

  const filteredCalls = (natsWrapper.client
    .publish as jest.Mock).mock.calls.filter(
    c => c[0] === Subjects.TicketUpdated
  ).length

  expect(filteredCalls).toBe(1)
})
