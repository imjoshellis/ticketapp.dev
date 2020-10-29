const Account = ({ currentUser: { email, tickets, orders } }) => {
  return (
    <div>
      <h2>User Info</h2>
      <p>Email: {email}</p>
      <h3>Tickets</h3>
      <ul>
        {tickets
          ? tickets
              .filter(ticket => ticket.userId === currentUser.id)
              .map(ticket => (
                <li key={ticket.id}>
                  {ticket.title}: ${ticket.price}
                </li>
              ))
          : 'No completed purchases'}
      </ul>
      <h3>Orders</h3>
      <ul>
        {orders
          ? orders.map(order => (
              <li key={order.id}>
                {order.ticket.title}: ${order.ticket.price} - {order.status}
              </li>
            ))
          : 'No completed purchases'}
      </ul>
    </div>
  )
}

export default Account
