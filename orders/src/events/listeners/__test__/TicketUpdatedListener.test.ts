import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models'
import { TicketUpdatedEvent } from '@ije-ticketapp/common'
import { natsWrapper } from '../../../natsWrapper'
import { TicketUpdatedListener } from '../TicketUpdatedListener'
import mongoose from 'mongoose'

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client)

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'title',
    price: 10
  })
  await ticket.save()

  const data: TicketUpdatedEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: 'new title',
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString()
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, ticket, data, msg }
}

it('finds, updates, and saves a ticket', async () => {
  const { listener, ticket, data, msg } = await setup()
  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket).toBeDefined()
  if (!updatedTicket) throw new Error('ticket not found')

  expect(updatedTicket.price).toBe(data.price)
  expect(updatedTicket.title).toBe(data.title)
  expect(updatedTicket.version).toBe(data.version)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalledTimes(1)
})

it('only calls ack if version number is incremented by one', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalledTimes(1)

  data.version++
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalledTimes(2)

  data.version += 2
  try {
    await listener.onMessage(data, msg)
  } catch (err) {}
  expect(msg.ack).toHaveBeenCalledTimes(2)
})
