import { type Page } from '..'
import createButton from '../createButton'

interface INext {
  chat_id: string
  host: string
  hostId: number
  userId: number
}

export const remove_check: Page<INext> = async (props) => {
  return {
    get text() {
      return `Подтвердите удаление:\n\n` + `<s><code>${props.host}</code></s>`
    },

    options(message_id) {
      return {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              createButton({
                message_id,
                page: 'remove_done',
                params: {
                  chat_id: props.chat_id,
                  hostId: props.hostId,
                  userId: props.userId,
                },
                text: 'Подтверждаю',
              }),
            ],
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
