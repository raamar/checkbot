import { type Page } from '..'
import createButton from '../createButton'

interface INext {
  chat_id: string
  url: string
}

export const confirm: Page<INext> = async (props) => {
  try {
    const match = props.url.match(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/gim)

    if (!match || match[0].indexOf('.') < 0) {
      throw new Error()
    }

    const url = match[0].toLocaleLowerCase()
    return {
      get text() {
        return `<code>${url}</code>`
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
                  text: 'Назад',
                }),
              ],
            ],
          },
        }
      },
    }
  } catch (error) {
    return {
      get text() {
        return 'Введите адрес ресурса еще раз.'
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
                  text: 'Выйти',
                }),
                createButton({
                  message_id,
                  page: 'add',
                  params: {
                    chat_id: props.chat_id,
                  },
                  text: 'Повторить ввод',
                }),
              ],
            ],
          },
        }
      },
    }
  }
}
