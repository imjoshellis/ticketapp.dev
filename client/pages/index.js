import React from 'react'
import buildClient from '../api/buildClient'

export const Index = ({ currentUser }) => {
  return (
    <div>
      <h1>welcome home</h1>
      {currentUser ? `signed in as ${currentUser.email}` : 'not signed in'}
    </div>
  )
}

Index.getInitialProps = async context => {
  const client = buildClient(context)
  const { data } = await client.get('/api/users/currentuser')

  return data
}

export default Index
