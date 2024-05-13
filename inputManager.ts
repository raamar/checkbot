import type TelegramBot = require('node-telegram-bot-api')

type InputType = 'text' | 'media' | 'selfContact' | 'number'

type GetReturnTypeByInputType<T extends InputType> = T extends 'number' ? number : T extends 'media' ? string[] : string

interface IQueue {
  [id: string]: {
    type: InputType
    resolve: (input: unknown) => void
    onUpdate: (input: string) => void
  }
}

const queue: IQueue = {}

export const getInput = <T extends InputType>(props: {
  user_id: string
  type: T
  onUpdate?: (input: string) => void
}): Promise<GetReturnTypeByInputType<T>> => {
  const { onUpdate, type, user_id } = props

  if (type === 'media') {
    console.warn('Input Manager не принимает type media')
    return
  }

  return new Promise((resolve) => {
    queue[user_id] = {
      onUpdate,
      resolve,
      type,
    }
  })
}

export const handleInput = (user_id: number, msg: TelegramBot.Message & TelegramBot.CallbackQuery) => {
  const queueItem = queue[user_id]

  if (!queueItem) return false

  if (queueItem.type === 'media') {
    console.warn('Input Manager не принимает type media')
    return
  }

  const data = {
    text: msg?.text,
    selfContact: msg?.contact?.phone_number,
    number: parseFloat(msg?.text),
    dialog: msg?.message?.reply_markup?.inline_keyboard?.flat().find((button) => button.callback_data === msg.data)
      .text,
  }

  if (queueItem.type === 'number' && isNaN(data[queueItem.type])) {
    return
  }

  if (data[queueItem.type] === undefined) {
    return
  }

  if (queueItem.type === 'selfContact' && msg?.contact?.user_id !== user_id) {
    return
  }

  queueItem.resolve(data[queueItem.type])

  queue[user_id] = undefined

  return true
}
