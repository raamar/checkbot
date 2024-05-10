import { type Page } from '..'

interface INext {
  text2: string
}

export const next: Page<INext> = (props) => {
  return [
    `${props.text2}\n\n(next)`,
    {
      parse_mode: 'HTML',
      // reply_markup: {
      //   inline_keyboard: [
      //     [
      //       {
      //         text: 'Обновить',
      //         callback_data: 'eyJwYWdlIibWFpbiIsInBheWxvYWQiOnsidGV4dCI6IkhlbGxvIHdvcmxkIGhlbG',
      //       },
      //     ],
      //   ],
      // },
    },
  ]
}
