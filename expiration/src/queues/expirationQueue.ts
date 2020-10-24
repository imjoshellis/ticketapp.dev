import { natsWrapper } from './../natsWrapper'
import Queue from 'bull'
import { ExpirationCompletePublisher } from '../events/publishers/ExpirationCompletePublisher'

interface Payload {
  orderId: string
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST
  }
})

expirationQueue.process(async job => {
  const { orderId } = job.data
  new ExpirationCompletePublisher(natsWrapper.client).publish({ orderId })
})

export { expirationQueue }
