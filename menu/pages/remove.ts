import { type Page } from '..'
import prisma from '../../prisma/client'
import createButton from '../createButton'

interface IMain {
  chat_id: string
}

export const remove: Page<IMain> = async (props) => {
  const { subscriptions } = await prisma.user.findUniqueOrThrow({
    where: {
      chat_id: props.chat_id,
    },
    select: {
      id: true,
      subscriptions: {
        select: {
          host: true,
          hostId: true,
          userId: true,
        },
      },
    },
  })

  return {
    get text() {
      return `Выберите ресурс для удаления:`
    },
    options(message_id) {
      return {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            ...subscriptions.map((subscription) => [
              createButton({
                message_id,
                page: 'remove_check',
                params: {
                  chat_id: props.chat_id,
                  host: subscription.host.value,
                  hostId: subscription.hostId,
                  userId: subscription.userId,
                },
                text: subscription.host.value,
              }),
            ]),
            [
              createButton({
                message_id,
                page: 'main',
                params: {
                  chat_id: props.chat_id,
                },
                text: 'Назад',
              }),
            ],
          ],
        },
      }
    },
  }
}
