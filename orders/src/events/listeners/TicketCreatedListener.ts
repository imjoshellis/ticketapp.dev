import { Listener, Subjects, TicketCreatedEvent } from '@ije-ticketapp/common'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models'
import { QUEUE_GROUP_NAME } from './constants'

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
  queueGroupName = QUEUE_GROUP_NAME

  async onMessage (data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data
    try {
      const ticket = Ticket.build({ id, title, price })
      await ticket.save()
      msg.ack()
    } catch (err) {}
  }
}

export { TicketCreatedListener }
