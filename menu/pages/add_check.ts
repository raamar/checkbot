import { type Page } from '..'
import createButton from '../createButton'

interface INext {
  chat_id: string
  url: string
}

export const add_check: Page<INext> = async (props) => {
  try {
    const regex = new RegExp(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/gim).exec(props.url)

    if (!regex || regex[1].indexOf('.') < 0) {
      throw new Error()
    }

    const host = regex[1].toLocaleLowerCase()

    return {
      get text() {
        return `Подтвердите ввод:\n\n` + `<code>${host}</code>`
      },

      options(message_id) {
        return {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [
                createButton({
                  message_id,
                  page: 'add_confirm',
                  params: {
                    host,
                    chat_id: props.chat_id,
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
