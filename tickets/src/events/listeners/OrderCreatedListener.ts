import { Ticket } from '../../models'
import { QUEUE_GROUP_NAME } from './constants'
import { Listener, OrderCreatedEvent, Subjects } from '@ije-ticketapp/common'
import { Message } from 'node-nats-streaming'

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  queueGroupName = QUEUE_GROUP_NAME

  async onMessage (data: OrderCreatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id)
    if (!ticket) throw new Error('ticket not found')

    ticket.set({ orderId: data.id })
    await ticket.save()

    msg.ack()
  }
}

export { OrderCreatedListener }
