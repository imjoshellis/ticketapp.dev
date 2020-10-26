import axios from 'axios'

export const buildClient = ({ req }) => {
  const baseURL = process.env.LOCAL_HOST
    ? process.env.LOCAL_HOST
    : 'http://ticketapp.dev'
  if (typeof window === 'undefined') {
    return axios.create({
      baseURL,
      headers: req.headers
    })
  } else {
    return axios.create({ baseURL: '/' })
  }
}

export default buildClient
