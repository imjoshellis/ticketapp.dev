import Router from 'next/router'
import React, { useState } from 'react'
import useRequest from '../../hooks/useRequest'

export const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { sendRequest, alerts, resetAlerts } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: { email, password },
    onSuccess: () => Router.push('/')
  })

  const resetForm = () => {
    setEmail('')
    setPassword('')
    resetAlerts()
  }

  const handleSubmit = async event => {
    event.preventDefault()

    await sendRequest()
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        {alerts.other}
        <div className='form-group'>
          <label htmlFor='' className='text-uppercase font-weight-bold'>
            email address
          </label>
          {alerts.email}
          <input
            type='email'
            name='email'
            id='email'
            className='form-control'
            onChange={e => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='' className='text-uppercase font-weight-bold'>
            password
          </label>
          {alerts.password}
          <input
            type='password'
            name='password'
            id='password'
            className='form-control'
            onChange={e => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <button
          className='btn btn-danger text-uppercase font-weight-bold'
          type='reset'
          onClick={resetForm}
        >
          reset
        </button>
        <button
          className='btn btn-primary text-uppercase font-weight-bold ml-2'
          type='submit'
        >
          sign in
        </button>
      </form>
    </div>
  )
}

export default SignIn
