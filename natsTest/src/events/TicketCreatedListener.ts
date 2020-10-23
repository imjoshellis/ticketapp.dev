import { Subjects } from './Subjects'
import { TicketCreatedEvent } from './TicketCreatedEvent'
import { Message } from 'node-nats-streaming'
import { Listener } from './Listener'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
  queueGroupName = 'payments-serve'
  onMessage (data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event data: ', data)
    msg.ack()
  }
}
