import mongoose from 'mongoose'
import { Order, OrderStatus } from '.'

interface NewTicket {
  id: string
  title: string
  price: number
}

export interface TicketDoc extends mongoose.Document {
  title: string
  price: number
  isReserved(): Promise<Boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(newTicket: NewTicket): TicketDoc
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    toJSON: {
      transform (_, ret) {
        ret.id = ret._id
        delete ret._id
      },
      versionKey: false
    }
  }
)

ticketSchema.statics.build = (newTicket: NewTicket) =>
  new Ticket({
    _id: newTicket.id,
    title: newTicket.title,
    price: newTicket.price
  })

ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ]
    }
  })
  return !!existingOrder
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket }
