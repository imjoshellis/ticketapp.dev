import { useState } from 'react'
import { useRequest } from '../../hooks/useRequest'
import Router from 'next/router'

const NewTicket = () => {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const { sendRequest, alerts, resetAlerts } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: { title, price },
    onSuccess: () => Router.push('/')
  })

  const onPriceBlur = () => {
    const value = parseFloat(price)
    if (isNaN(value)) return
    setPrice(value.toFixed(2))
  }

  const handleSubmit = async event => {
    event.preventDefault()

    await sendRequest()
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Create a ticket</h1>
        {alerts.other}
        <div className='form-group'>
          <label htmlFor=''>Title</label>
          {alerts.title}
          <input
            className='form-control'
            type='text'
            name='title'
            id='title'
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor=''>Price ($usd)</label>
          {alerts.price}
          <input
            className='form-control'
            type='number'
            name='price'
            id='price'
            value={price}
            onBlur={onPriceBlur}
            onChange={e => setPrice(e.target.value)}
          />
        </div>
        <button className='btn btn-primary' type='submit'>
          Submit
        </button>
      </form>
    </div>
  )
}

export default NewTicket
