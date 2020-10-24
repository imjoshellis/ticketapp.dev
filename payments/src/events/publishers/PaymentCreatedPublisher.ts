import { PaymentCreatedEvent, Publisher, Subjects } from '@ije-ticketapp/common'

class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
}

export { PaymentCreatedPublisher }
