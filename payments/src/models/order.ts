import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { OrderStatus } from '@ije-ticketapp/common'
import mongoose from 'mongoose'

interface NewOrder {
  id: string
  version: number
  price: number
  userId: string
  status: OrderStatus
}

interface OrderDoc extends mongoose.Document {
  version: number
  price: number
  userId: string
  status: OrderStatus
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(newOrder: NewOrder): OrderDoc
}

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, required: true }
  },
  {
    toJSON: {
      transform (_, ret) {
        ret.id = ret._id
        delete ret._id
      }
    }
  }
)

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (newOrder: NewOrder) => {
  const { id, version, price, userId, status } = newOrder
  new Order({ _id: id, version, price, userId, status })
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order }
