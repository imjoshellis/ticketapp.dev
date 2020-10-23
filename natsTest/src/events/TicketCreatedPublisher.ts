import { TicketCreatedEvent } from './TicketCreatedEvent'
import { Publisher } from './Publisher'
import { Subjects } from './Subjects'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}
