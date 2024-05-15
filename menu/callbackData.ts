import localStorage from '../sessionsData/localStorage'
import pages from './config'

const createIfNotExists = (user_id: string) => {
  try {
    localStorage.getItem(user_id)
  } catch (_) {
    localStorage.setItem(user_id, '{}')
  }
}
const addCallbackData = <T extends keyof typeof pages>(data: {
  page: T
  params: Parameters<(typeof pages)[T]>['0']
  message_id?: number
}) => {
  if (!data.message_id) {
    return '0'
  }

  createIfNotExists(data.params.chat_id)

  const root_id = `${data.params.chat_id}_${data.message_id}_`
  const callbackData = JSON.parse(localStorage?.getItem(data.params.chat_id) || '{}')
  const id = root_id + Object.keys(callbackData).filter((key) => key.includes(root_id)).length

  localStorage.setItem(
    data.params.chat_id,
    JSON.stringify(
      Object.assign(callbackData, {
        [id]: data,
      })
    )
  )
  return id
}

type GetCallbackData = (user_id: string, id: string) => Parameters<typeof addCallbackData>['0'] | null

const getCallbackData: GetCallbackData = (user_id, id) => {
  try {
    const raw = localStorage.getItem(user_id)

    if (!raw) {
      return null
    }

    const data = JSON.parse(raw)
    const item = data[id]

    if (!item) {
      return null
    }

    delete data[id]
    localStorage.setItem(user_id, JSON.stringify(data))

    return item
  } catch (error) {
    return null
  }
}

const clearCallbackData = (user_id: string) => {
  createIfNotExists(user_id)

  localStorage.setItem(user_id, '{}')
}

export { addCallbackData, getCallbackData, clearCallbackData }
