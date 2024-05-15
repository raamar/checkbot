import { type Page } from '..'
import prisma from '../../prisma/client'
import createButton from '../createButton'

interface INext {
  hostId: number
  userId: number
  chat_id: string
}

export const remove_done: Page<INext> = async (props, showPage, message_id) => {
  await prisma.subscription.delete({
    where: {
      userId_hostId: {
        hostId: props.hostId,
        userId: props.userId,
      },
    },
  })
  return {
    get text() {
      return `Ресурс удален.`
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
