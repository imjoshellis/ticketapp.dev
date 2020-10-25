import { useEffect, useState } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import { useRequest } from '../../hooks/useRequest'
import Router from 'next/router'

const ShowOrder = ({ order, currentUser }) => {
  const [timeRemaining, setTimeRemaining] = useState(0)
  const { sendRequest, alerts } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: () => Router.push('/orders')
  })
  useEffect(() => {
    const findTimeRemaining = () => {
      const msRemaining = new Date(order.expiresAt) - new Date()
      setTimeRemaining(Math.round(msRemaining / 1000))
    }

    findTimeRemaining()
    const timerId = setInterval(findTimeRemaining, 1000)

    return () => {
      clearInterval(timerId)
    }
  }, [order])

  if (timeRemaining < 0) return <div>Order Expired</div>

  return (
    <div>
      <h1>Payment</h1>
      <h4>(order expires in {timeRemaining} seconds)</h4>
      <StripeCheckout
        className='btn btn-primary'
        token={({ id }) => sendRequest({ token: id })}
        stripeKey='pk_test_51HftQbIriOEAeTJgOToAMiNKKVF1uhxIktJNpPYyJicmHk7SAVbwhyz1rHHfZKJSPdjMhlSZdLWMxWFogmKgYAHp00Wub4dFEo'
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
    </div>
  )
}

ShowOrder.getInitialProps = async (ctx, client) => {
  const { orderId } = ctx.query
  const { data } = await client.get(`/api/orders/${orderId}`)
  return { order: data }
}

export default ShowOrder
