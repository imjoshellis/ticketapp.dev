import { OrderCreatedEvent, Publisher, Subjects } from '@ije-ticketapp/common'

class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
}

export { OrderCreatedPublisher }
