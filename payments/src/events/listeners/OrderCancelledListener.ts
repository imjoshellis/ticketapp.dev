import { Message } from 'node-nats-streaming'
import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects
} from '@ije-ticketapp/common'
import { QUEUE_GROUP_NAME } from './constants'
import { Order } from '../../models'

class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
  queueGroupName = QUEUE_GROUP_NAME
  async onMessage (data: OrderCancelledEvent['data'], msg: Message) {
    const { id, version } = data

    const order = await Order.findOne({ _id: id, version: version - 1 })

    if (!order) throw new Error('Order not found')
    order.set({ status: OrderStatus.Cancelled })

    try {
      await order.save()
    } catch (err) {
      console.error(err)
    }

    msg.ack()
  }
}

export { OrderCancelledListener }
