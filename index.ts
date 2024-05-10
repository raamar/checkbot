import consoleStamp from 'console-stamp'
import getUserByChatId from './service/getUserByChatId'
import TelegramBot = require('node-telegram-bot-api')
import initMenu from './menu'
import { getCallbackData } from './menu/callbackData'

consoleStamp(console)

void (() => {
  const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {
    polling: true,
  })

  bot.getMe().then(({ username }) => {
    console.log('BOT started')
    console.log(`https://web.telegram.org/k/#@${username}`)
  })

  const menu = initMenu(bot)

  bot.onText(/\/start/, async (msg) => {
    try {
      const user = await getUserByChatId(msg.chat.id.toString())

      await menu.showPage({
        chat_id: user.chat_id,
        page: 'main',
        params: {
          counter: 1,
        },
      })
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
        return
      }
      console.error(error)
    }
  })

  bot.on('callback_query', async (query) => {
    try {
      const id = query?.message?.chat?.id?.toString()
      const { data: data_id } = query

      if (!id || !data_id) {
        return
      }

      const user = await getUserByChatId(id)
      const data = getCallbackData(data_id)

      if (!data) {
        return
      }

      await menu.showPage({
        chat_id: user.chat_id,
        page: data.page,
        params: data.params,
        message_id: data.message_id,
      })
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
        return
      }
      console.error(error)
    }
  })

  // bot.onText(/\/add (.+)/, (msg, match) => {
  //   if (!match) {
  //     return
  //   }

  //   const { id } = msg.chat
  //   const url = match[1]

  //   bot.sendMessage(id, url)
  // })
})()
