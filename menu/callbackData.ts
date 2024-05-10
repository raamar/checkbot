import { v4 } from 'uuid'
import localStorage from '../sessionsData/localStorage'
import pages from './config'

const addCallbackData = <T extends keyof typeof pages>(data: {
  page: T
  params: Parameters<(typeof pages)[T]>['0']
  message_id?: number
}) => {
  if (!data.message_id) {
    return '0'
  }

  const id = v4()
  localStorage.setItem(id, JSON.stringify(data))
  return id
}

type GetCallbackData = (id: string) => Parameters<typeof addCallbackData>['0'] | null

const getCallbackData: GetCallbackData = (id: string) => {
  try {
    const raw = localStorage?.getItem(id)
    if (!raw) {
      return null
    }

    const data = JSON.parse(raw)
    localStorage.removeItem(id)

    return data
  } catch (error) {
    return null
  }
}

export { addCallbackData, getCallbackData }
