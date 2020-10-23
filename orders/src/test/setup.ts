import jwt from 'jsonwebtoken'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { Ticket } from '../models'

jest.mock('../natsWrapper')

let mongo: MongoMemoryServer

beforeAll(async () => {
  process.env.JWT_KEY = 'arstneio'

  mongo = new MongoMemoryServer()
  const mongoUri = await mongo.getUri()
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
})

beforeEach(async () => {
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections()
  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

export const generateUserCookie = () => {
  const payload = {
    email: 'arst@arst.arst',
    password: 'arst',
    id: mongoose.Types.ObjectId()
  }

  const userJwt = jwt.sign(payload, process.env.JWT_KEY!)
  const session = { userJwt }
  const sessionJSON = JSON.stringify(session)
  const base64 = Buffer.from(sessionJSON).toString('base64')

  return [`express:sess=${base64}`]
}

export const buildTicket = async () => {
  const id = mongoose.Types.ObjectId().toHexString()
  const ticket = Ticket.build({ id, price: 20, title: 'title' })
  await ticket.save()
  return ticket
}
