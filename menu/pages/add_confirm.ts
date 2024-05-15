import { type Page } from '..'
import prisma from '../../prisma/client'
import createButton from '../createButton'

interface INext {
  host: string
  chat_id: string
}

export const add_confirm: Page<INext> = async (props, showPage, message_id) => {
  const host = await prisma.host.upsert({
    where: {
      value: props.host,
    },
    create: {
      value: props.host,
      createdBy: {
        connect: {
          chat_id: props.chat_id,
        },
      },
      subscriptions: {
        create: {
          user: {
            connect: {
              chat_id: props.chat_id,
            },
          },
        },
      },
    },
    update: {
      value: props.host,
    },
  })
  return {
    get text() {
      return `Теперь вы отслеживаете ресурс\n\n<code>${host.value}</code>`
    },

    options(message_id) {
      return {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              createButton({
                message_id,
                page: 'main',
                params: {
                  chat_id: props.chat_id,
                },
                text: 'На главную',
              }),
            ],
          ],
        },
      }
    },
  }
}
