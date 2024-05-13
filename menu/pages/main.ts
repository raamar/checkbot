import { type Page } from '..'
import createButton from '../createButton'

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
              createButton({
                message_id,
                page: 'add',
                params: {},
                text: 'Добавить домен',
              }),
            ],
          ],
        },
      }
    },
  }
}
