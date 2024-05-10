import { type Page } from '..'
import { addCallbackData } from '../callbackData'

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
              {
                text: 'Назад',
                callback_data: addCallbackData({
                  page: 'main',
                  params: {},
                  message_id,
                }),
              },
            ],
          ],
        },
      }
    },
  }
}
