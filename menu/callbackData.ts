import { v4 } from 'uuid'
import localStorage from '../sessionsData/localStorage'
import pages from './config'
import { Optional } from '@prisma/client/runtime/library'

const addCallbackData = <T extends keyof typeof pages>(data: {
  page: T
  params: Parameters<(typeof pages)[T]>['0']
}) => {
  const id = v4()
  localStorage.setItem(id, JSON.stringify(data))
  return id
}

type GetCallbackData = (
  id: string
) => { page: keyof typeof pages; params: Parameters<(typeof pages)[keyof typeof pages]>['0'] } | null

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
