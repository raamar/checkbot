import type TelegramBot = require('node-telegram-bot-api')
import pages from './config'

export type Page<T> = (props: T) => [string, TelegramBot.SendMessageOptions]

const initMenu = (bot: TelegramBot) => {
  const showPage = async <T extends keyof typeof pages>(props: {
    page: T
    chat_id: TelegramBot.ChatId
    params: Parameters<(typeof pages)[T]>['0']
  }) => {
    try {
      //@ts-expect-error
      return await bot.sendMessage(props.chat_id, ...pages[props.page](props.params))
    } catch (error) {
      throw error
    }
  }

  return {
    showPage,
  }
}

export default initMenu
