import { Listener, Subjects, TicketUpdatedEvent } from '@ije-ticketapp/common'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models'
import { QUEUE_GROUP_NAME } from './constants'

class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
  queueGroupName = QUEUE_GROUP_NAME

  async onMessage (data: TicketUpdatedEvent['data'], msg: Message) {
    const { id, version, title, price } = data
    try {
      const ticket = await Ticket.findByEvent({ id, version })
      if (!ticket) throw new Error('ticket not found')
      ticket.set({ title, price })
      await ticket.save()

      msg.ack()
    } catch (err) {}
  }
}

export { TicketUpdatedListener }
