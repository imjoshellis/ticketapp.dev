import axios from 'axios'
import React, { useState } from 'react'

const useRequest = ({ url, method, body, onSuccess }) => {
  const [alerts, setAlerts] = useState({})

  const sendRequest = async () => {
    try {
      const res = await axios[method](url, body)
      onSuccess()
    } catch (err) {
      const alertList = err.response.data.errors
      const everyAlertField = alertList
        .map(e => e.field)
        .filter(field => field !== undefined)
      const alertFieldSet = [...new Set(everyAlertField)]

      const alertObj = {
        other: null
      }

      if (everyAlertField.length !== alertList.length)
        alertObj.other = (
          <div className='alert alert-danger'>
            {alertList
              .filter(e => !!!e.field)
              .map(e => (
                <div key={e.message}>{e.message}</div>
              ))}
          </div>
        )

      for (let field of alertFieldSet) {
        alertObj[field] = (
          <div className='alert alert-danger'>
            {alertList
              .filter(e => e.field === field)
              .map(e => (
                <div key={e.message}>{e.message}</div>
              ))}
          </div>
        )
      }

      setAlerts(alertObj)
    }
  }

  const resetAlerts = () => setAlerts({})

  return { sendRequest, alerts, resetAlerts }
}

export default useRequest
