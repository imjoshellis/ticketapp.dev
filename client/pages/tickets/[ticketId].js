import { useRequest } from '../../hooks/useRequest'
import Router from 'next/router'

const ShowTicket = ({ ticket }) => {
  const { sendRequest, alerts, resetAlerts } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: { ticketId: ticket.id },
    onSuccess: order => Router.push('/orders/[orderId]', `/orders/${order.id}`)
  })

  return (
    <div>
      <h1>{ticket.title}</h1>
      <div>{alerts.other}</div>
      <h4>${ticket.price}</h4>
      <button className='btn btn-primary' onClick={() => sendRequest()}>
        Purchase
      </button>
    </div>
  )
}

ShowTicket.getInitialProps = async (ctx, client) => {
  const { ticketId } = ctx.query
  const { data } = await client.get(`/api/tickets/${ticketId}`)

  return { ticket: data }
}

export default ShowTicket
