import type TelegramBot = require('node-telegram-bot-api')
import pages from './config'

export type Page<T> = (props: T) => {
  text: string
  options?: (message_id: number) => TelegramBot.EditMessageTextOptions
}

const initMenu = (bot: TelegramBot) => {
  const showPage = async <T extends keyof typeof pages>(props: {
    page: T
    chat_id: TelegramBot.ChatId
    params: Parameters<(typeof pages)[T]>[number]
    message_id?: number
  }) => {
    try {
      //@ts-ignore
      const page = pages[props.page](props.params)

      if (!page.options) {
        page.options = () => ({})
      }

      if (!props.message_id) {
        props.message_id = (await bot.sendMessage(props.chat_id, page.text, page.options(0))).message_id
      }

      return await bot.editMessageText(page.text, {
        message_id: props.message_id,
        chat_id: props.chat_id,
        ...page.options(props.message_id),
      })
    } catch (error) {
      throw error
    }
  }

  return {
    showPage,
  }
}

export default initMenu
