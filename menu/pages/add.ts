import { type Page } from '..'
import createButton from '../createButton'

interface INext {}

export const add: Page<INext> = (props) => {
  return {
    get text() {
      return `Добавить домен`
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
                params: {},
                text: 'Назад',
              }),
            ],
          ],
        },
      }
    },
  }
}
