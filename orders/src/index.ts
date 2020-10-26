import { app } from './app'
import mongoose from 'mongoose'
import { natsWrapper } from './natsWrapper'
import { TicketCreatedListener, TicketUpdatedListener } from './events'
import { ExpirationCompleteListener } from './events/listeners/ExpirationCompleteListener'
import { PaymentCreatedListener } from './events/listeners/PaymentCreatedListener'

const start = async () => {
  console.log('Starting Orders Service (/api/orders)')
  const {
    JWT_KEY,
    MONGO_URI,
    NATS_CLIENT_ID,
    NATS_CLUSTER_ID,
    NATS_URL
  } = process.env

  if (!JWT_KEY) throw new Error('JWT_KEY must be defined')
  if (!MONGO_URI) throw new Error('MONGO_URI must be defined')
  if (!NATS_CLIENT_ID) throw new Error('NATS_CLIENT_ID must be defined')
  if (!NATS_CLUSTER_ID) throw new Error('NATS_CLUSTER_ID must be defined')
  if (!NATS_URL) throw new Error('NATS_URL must be defined')

  try {
    await natsWrapper.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL)

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed')
      process.exit()
    })
    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())

    new TicketCreatedListener(natsWrapper.client).listen()
    new TicketUpdatedListener(natsWrapper.client).listen()
    new ExpirationCompleteListener(natsWrapper.client).listen()
    new PaymentCreatedListener(natsWrapper.client).listen()

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log('Connected to MongoDB')
  } catch (err) {
    console.error(err)
  }

  app.listen(3000, () => {
    console.log('Listening on 3000')
  })
}

start()
