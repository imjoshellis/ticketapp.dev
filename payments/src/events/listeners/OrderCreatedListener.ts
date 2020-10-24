import { Message } from 'node-nats-streaming'
import { Listener, OrderCreatedEvent, Subjects } from '@ije-ticketapp/common'
import { QUEUE_GROUP_NAME } from './constants'
import { Order } from '../../models'

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  queueGroupName = QUEUE_GROUP_NAME
  async onMessage (data: OrderCreatedEvent['data'], msg: Message) {
    const {
      id,
      status,
      userId,
      version,
      ticket: { price }
    } = data

    const order = Order.build({ id, status, price, userId, version })
    try {
      await order.save()
    } catch (err) {
      console.error(err)
    }
    msg.ack()
  }
}

export { OrderCreatedListener }
