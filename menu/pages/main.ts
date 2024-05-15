import { type Page } from '..'
import prisma from '../../prisma/client'
import createButton from '../createButton'

interface IMain {
  chat_id: string
}

export const main: Page<IMain> = async (props) => {
  const { subscriptions } = await prisma.user.findUniqueOrThrow({
    where: {
      chat_id: props.chat_id,
    },
    select: {
      subscriptions: {
        select: {
          host: true,
        },
      },
    },
  })

  return {
    get text() {
      return `Список ресурсов:\n` + subscriptions.map((item) => item.host)
    },
    options(message_id) {
      return {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              createButton({
                message_id,
                page: 'add',
                params: {
                  chat_id: props.chat_id,
                },
                text: 'Добавить домен',
              }),
            ],
          ],
        },
      }
    },
  }
}
