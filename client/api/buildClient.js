import axios from 'axios'

export const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    return axios.create({
      baseURL: 'http://ticketapp.dev',
      headers: req.headers
    })
  } else {
    return axios.create({ baseURL: '/' })
  }
}

export default buildClient
