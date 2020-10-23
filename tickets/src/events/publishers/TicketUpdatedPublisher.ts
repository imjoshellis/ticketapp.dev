import { Publisher, Subjects, TicketUpdatedEvent } from '@ije-ticketapp/common'

class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}

export { TicketUpdatedPublisher }
