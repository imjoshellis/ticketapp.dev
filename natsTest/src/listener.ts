import nats, { Message } from 'node-nats-streaming'
import { randomBytes } from 'crypto'

console.clear()

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
})

stan.on('connect', () => {
  console.log('Listener connected to NATS')

  stan.on('close', () => {
    console.clear()
    console.log('NATS connection closed')
    process.exit()
  })

  const options = stan.subscriptionOptions().setManualAckMode(true)
  const subscription = stan.subscribe(
    'ticket:created',
    'order-srv-queue-group',
    options
  )
  subscription.on('message', (msg: Message) => {
    const data = msg.getData()
    if (typeof data === 'string') {
      console.log('Received Message #', msg.getSequence())
      console.log('Data: ', JSON.parse(data))
    }
    msg.ack()
  })
})

process.on('SIGINT', () => stan.close())
process.on('SIGTERM', () => stan.close())
