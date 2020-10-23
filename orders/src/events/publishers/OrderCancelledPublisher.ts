import { OrderCancelledEvent, Publisher, Subjects } from '@ije-ticketapp/common'

class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}

export { OrderCancelledPublisher }
