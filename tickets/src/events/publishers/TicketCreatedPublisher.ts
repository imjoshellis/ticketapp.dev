import { Publisher, Subjects, TicketCreatedEvent } from '@ije-ticketapp/common'

class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}

export { TicketCreatedPublisher }
