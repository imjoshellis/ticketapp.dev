import { QUEUE_GROUP_NAME } from './constants'
import { Listener, OrderCancelledEvent, Subjects } from '@ije-ticketapp/common'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models'
import { TicketUpdatedPublisher } from '../publishers/TicketUpdatedPublisher'

class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
  queueGroupName = QUEUE_GROUP_NAME

  async onMessage (data: OrderCancelledEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id)
    if (!ticket) throw new Error('ticket not found')

    ticket.set({ orderId: undefined })
    await ticket.save()

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId
    })

    msg.ack()
  }
}

export { OrderCancelledListener }
