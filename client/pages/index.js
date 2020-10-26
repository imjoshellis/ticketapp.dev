import React from 'react'
import Link from 'next/link'

export const Index = ({ currentUser, tickets, errorMsg }) => {
  if (!tickets || tickets.length === 0)
    return (
      <div>
        <h1>No Tickets Currently Available</h1>
        {errorMsg ? <h4 className='text-danger'>{errorMsg}</h4> : null}
      </div>
    )

  const ticketRows = tickets.map(ticket => (
    <tr key={ticket.id}>
      <td>{ticket.title}</td>
      <td>{ticket.price}</td>
      <td>
        <Link href='/tickets/[ticketId]' as={`/tickets/${ticket.id}`}>
          <a>View Ticket</a>
        </Link>
      </td>
    </tr>
  ))

  return (
    <div>
      <h1>Tickets</h1>
      <table className='table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketRows}</tbody>
      </table>
    </div>
  )
}

Index.getInitialProps = async (ctx, client, currentUser) => {
  try {
    const { data } = await client.get('/api/tickets')
    return { tickets: data }
  } catch (e) {
    const errorMsg =
      'There was a problem with the tickets server. Please try again later.'
    return { errorMsg }
  }
}

export default Index
