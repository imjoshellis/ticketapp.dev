import mongoose from 'mongoose'

interface NewOrder {
  userId: string
  status: string
  expiresAt: Date
  ticket: TicketDoc
}

interface OrderDoc extends mongoose.Document {
  userId: string
  status: string
  expiresAt: Date
  ticket: TicketDoc
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(newOrder: NewOrder): OrderDoc
}

const ticketSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    status: { type: String, required: true },
    expiresAt: { type: mongoose.Schema.Types.Date },
    ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }
  },
  {
    toJSON: {
      transform (_doc, ret) {
        ret.id = ret._id
        delete ret._id
      }
    },
    versionKey: false
  }
)

ticketSchema.statics.build = (newOrder: NewOrder) => new Order(newOrder)

const Order = mongoose.model<OrderDoc, OrderModel>('Order', ticketSchema)

export { Order }
