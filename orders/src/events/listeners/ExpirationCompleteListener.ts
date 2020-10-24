import { Message } from 'node-nats-streaming'
import { QUEUE_GROUP_NAME } from './constants'
import {
  Listener,
  Subjects,
  ExpirationCompleteEvent
} from '@ije-ticketapp/common'
import { Order, OrderStatus } from '../../models'
import { OrderCancelledPublisher } from '../publishers/OrderCancelledPublisher'

class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
  queueGroupName = QUEUE_GROUP_NAME

  async onMessage (data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket')
    if (!order) throw new Error('Order not found')
    if (order.status === OrderStatus.Complete) return msg.ack()

    order.set({ status: OrderStatus.Cancelled })
    await order.save()
    new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: { id: order.ticket.id }
    })

    msg.ack()
  }
}
export { ExpirationCompleteListener }
