import { type Page } from '..'
import { addCallbackData } from '../callbackData'

interface IMain {
  counter: number
}

export const main: Page<IMain> = (props) => {
  const callback_id =
    props.counter >= 3
      ? addCallbackData({
          page: 'next',
          params: { text2: 'всё' },
        })
      : addCallbackData({
          page: 'main',
          params: { counter: props.counter + 1 },
        })

  return [
    `${props.counter}\n\n(main)`,
    {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: props.counter < 3 ? 'Дальше' : 'В конец',
              callback_data: callback_id,
            },
          ],
        ],
      },
    },
  ]
}
