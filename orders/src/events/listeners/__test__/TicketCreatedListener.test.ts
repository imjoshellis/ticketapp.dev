import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models'
import { TicketCreatedEvent } from '@ije-ticketapp/common'
import { natsWrapper } from './../../../natsWrapper'
import { TicketCreatedListener } from '../TicketCreatedListener'
import mongoose from 'mongoose'

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client)
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'title',
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString()
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg }
}

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  const ticket = await Ticket.findById(data.id)

  expect(ticket).toBeDefined()
  if (!ticket) throw new Error('ticket not found')

  expect(ticket.price).toBe(data.price)
  expect(ticket.title).toBe(data.title)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
