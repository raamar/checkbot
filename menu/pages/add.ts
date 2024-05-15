import { type Page } from '..'
import { getInput } from '../../inputManager'
import createButton from '../createButton'

interface INext {
  chat_id: string
}

export const add: Page<INext> = async (props, showPage, message_id) => {
  getInput({
    user_id: props.chat_id,
    type: 'text',
  }).then((url) => {
    showPage({
      page: 'confirm',
      chat_id: props.chat_id,
      message_id,
      params: {
        chat_id: props.chat_id,
        url,
      },
    })
  })

  return {
    get text() {
      return `Введите адрес ресурса:`
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
}
