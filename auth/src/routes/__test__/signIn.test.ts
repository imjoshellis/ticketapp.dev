import request from 'supertest'
import { app } from '../../app'
import { testUserSignUp } from '../../test/setup'

it('returns 400 on invalid signup', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(400)
})

it('returns 400 on incorrect password', async () => {
  await testUserSignUp()

  return request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'passwrd' })
    .expect(400)
})

it('returns cookie on valid credentials', async () => {
  await testUserSignUp()

  const res = await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(200)

  expect(res.get('Set-Cookie')).toBeDefined()
})
