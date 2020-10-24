export const stripe = {
  charges: {
    create: jest
      .fn()
      .mockImplementation(opts =>
        opts.source === 'tok_visa'
          ? Promise.resolve({ id: 'arstarst' })
          : Promise.reject({ statusCode: 400, message: 'invalid token' })
      )
  }
}
