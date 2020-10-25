import React from 'react'
import Link from 'next/link'

export const Index = ({ currentUser, tickets }) => {
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

  if (!tickets || tickets.length === 0)
    return (
      <div>
        <h1>No Tickets Available</h1>
      </div>
    )

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
  const { data } = await client.get('/api/tickets')
  return { tickets: data }
}

export default Index
