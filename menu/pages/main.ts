import { type Page } from '..'
import { addCallbackData } from '../callbackData'

interface IMain {}

export const main: Page<IMain> = (props) => {
  return {
    get text() {
      return `Вы на главном экране`
    },
    options(message_id) {
      return {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Добавить домен',
                callback_data: addCallbackData({
                  page: 'add',
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
