import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface NewTicket {
  title: string
  price: number
  userId: string
}

interface TicketDoc extends mongoose.Document {
  title: string
  price: number
  userId: string
  version: number
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(newTicket: NewTicket): TicketDoc
}

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    userId: { type: String, required: true }
  },
  {
    toJSON: {
      transform (_doc, ret) {
        ret.id = ret._id
        delete ret._id
      }
    }
  }
)

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.build = (newTicket: NewTicket) => new Ticket(newTicket)

export const Ticket = mongoose.model<TicketDoc, TicketModel>(
  'Ticket',
  ticketSchema
)
