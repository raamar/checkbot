import consoleStamp from 'console-stamp'
import getUserByChatId from './service/getUserByChatId'
import TelegramBot = require('node-telegram-bot-api')

consoleStamp(console)

void (() => {
  const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {
    polling: true,
  })

  bot.onText(/\/start/, async (msg) => {
    try {
      const user = await getUserByChatId(msg.chat.id.toString())
      await bot.sendMessage(user.chat_id, `<code>${JSON.stringify(user, null, 2)}</code>`, {
        parse_mode: 'HTML',
      })
    } catch (error) {
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
