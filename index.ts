import consoleStamp from 'console-stamp'
import getUserByChatId from './service/getUserByChatId'
import TelegramBot = require('node-telegram-bot-api')
import initMenu from './menu'
import { getCallbackData } from './menu/callbackData'
import { handleInput } from './inputManager'
import { update } from './tasks/update'

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

  bot.on('message', (msg) => {
    if (handleInput(msg.chat.id, msg)) {
      bot.deleteMessage(msg.chat.id, msg.message_id)
    }
  })

  bot.onText(/\/start/, async (msg) => {
    try {
      const user = await getUserByChatId(msg.chat.id.toString())

      await menu.showPage({
        chat_id: user.chat_id,
        page: 'main',
        params: {
          chat_id: user.chat_id,
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

  bot.onText(/\/add/, async (msg) => {
    try {
      const user = await getUserByChatId(msg.chat.id.toString())

      await menu.showPage({
        chat_id: user.chat_id,
        page: 'add',
        params: {
          chat_id: user.chat_id,
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
      const data = getCallbackData(id, data_id)

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

  // schedule('* * * * *', update)
  update(bot)
})()
