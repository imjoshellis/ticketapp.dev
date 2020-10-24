import mongoose from 'mongoose'

interface NewPayment {
  stripeId: string
  orderId: string
}

interface PaymentDoc extends mongoose.Document {
  stripeId: string
  orderId: string
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(newPayment: NewPayment): PaymentDoc
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    stripeId: { type: String, required: true }
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

paymentSchema.statics.build = (newPayment: NewPayment) => {
  const { orderId, stripeId } = newPayment
  return new Payment({ orderId, stripeId })
}

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  'Payment',
  paymentSchema
)

export { Payment }
