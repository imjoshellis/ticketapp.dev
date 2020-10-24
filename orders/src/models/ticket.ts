import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
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
  version: number
  isReserved(): Promise<Boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(newTicket: NewTicket): TicketDoc
  findByEvent({
    id,
    version
  }: {
    id: string
    version: number
  }): Promise<TicketDoc | null>
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
      }
    }
  }
)

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.build = (newTicket: NewTicket) =>
  new Ticket({
    _id: newTicket.id,
    title: newTicket.title,
    price: newTicket.price
  })

ticketSchema.statics.findByEvent = ({
  id,
  version
}: {
  id: string
  version: number
}) =>
  Ticket.findOne({
    _id: id,
    version: version - 1
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
