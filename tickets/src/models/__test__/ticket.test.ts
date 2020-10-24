import { Ticket } from '../ticket'

it('implements optimistic concurrency control', async done => {
  const ticket = await Ticket.build({
    title: 'title',
    price: 20,
    userId: 'arst'
  })

  await ticket.save()

  const firstInstance = await Ticket.findById(ticket.id)
  const secondInstance = await Ticket.findById(ticket.id)

  firstInstance?.set({ title: 'first title' })
  secondInstance?.set({ title: 'second title' })

  await firstInstance?.save()

  try {
    await secondInstance!.save()
  } catch (err) {
    return done()
  }

  throw new Error('should have returned in the above try/catch')
})

it('increments version number on save', async () => {
  const ticket = await Ticket.build({
    title: 'title',
    price: 20,
    userId: 'arst'
  })

  await ticket.save()
  expect(ticket.version).toBe(0)

  await ticket.save()
  expect(ticket.version).toBe(1)

  await ticket.save()
  expect(ticket.version).not.toBe(1)
})
