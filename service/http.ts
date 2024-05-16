import axios from 'axios'

const http = axios.create({
  timeout: Number(process.env.CHECK_TIMEOUT),
})

http.interceptors.request.use((config) => {
  config.headers['request-startTime'] = process.hrtime()
  return config
})

http.interceptors.response.use((response) => {
  const start = response.config.headers['request-startTime']
  const end = process.hrtime(start)
  const milliseconds = Math.round(end[0] * 1000 + end[1] / 1000000)

  response.headers['request-duration'] = milliseconds
  response.headers['is-https'] = ((response.request?.protocol || '') as string).includes('https')
  return response
})

export default http
