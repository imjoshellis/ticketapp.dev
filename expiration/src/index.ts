import { OrderCreatedListener } from './events/listeners/OrderCreatedListener'
import { natsWrapper } from './natsWrapper'

const start = async () => {
  const { NATS_CLIENT_ID, NATS_CLUSTER_ID, NATS_URL } = process.env

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

    new OrderCreatedListener(natsWrapper.client).listen()
  } catch (err) {
    console.error(err)
  }
}

start()
