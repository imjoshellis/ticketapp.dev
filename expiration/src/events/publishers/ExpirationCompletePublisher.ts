import {
  Subjects,
  ExpirationCompleteEvent,
  Publisher
} from '@ije-ticketapp/common'

class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
}

export { ExpirationCompletePublisher }
