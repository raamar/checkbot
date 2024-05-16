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
          host: {
            select: {
              checks: {
                orderBy: {
                  createdAt: 'desc',
                },
                take: 5,
              },
              value: true,
            },
          },
        },
      },
    },
  })

  return {
    get text() {
      return (
        `Список ресурсов:\n\n` +
        subscriptions
          .map((item) => {
            const avg_time =
              item.host.checks.reduce((sum, { time }) => {
                return sum + time
              }, 0) / item.host.checks.length

            if (item.host.checks.length < 1) {
              return `~        <code>${item.host.value}</code> в очереди`
            }

            const last_check = item.host.checks[0]

            const emoji_status = last_check.status === 200 ? '🟢' : '🔴'

            return (
              `${emoji_status}     <code>${item.host.value}</code>\n` +
              `          Код ответа: <b>${last_check.status}</b>\n` +
              `          HTTPS: <b>${last_check.https ? '✅' : '❌'}</b>\n` +
              `          Ср. отклик: <b>${(avg_time / 1000).toFixed(2)}</b> с\n` +
              `          Время: <b>${new Date(last_check.createdAt).toLocaleDateString('RU', {
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}</b>`
            )
          })
          .join('\n\n')
      )
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
                text: '🔄 Обновить',
              }),
            ],
            [
              createButton({
                message_id,
                page: 'add',
                params: {
                  chat_id: props.chat_id,
                },
                text: '+ Добавить ресурс',
              }),
            ],
            [
              createButton({
                message_id,
                page: 'remove',
                params: {
                  chat_id: props.chat_id,
                },
                text: '— Удалить ресурс',
              }),
            ],
          ],
        },
      }
    },
  }
}
