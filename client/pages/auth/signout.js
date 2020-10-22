import { useEffect } from 'react'
import useRequest from '../../hooks/useRequest'
import Router from 'next/router'

export default () => {
  const { sendRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/')
  })
  useEffect(() => sendRequest(), [])
  return <div>Signing out...</div>
}
