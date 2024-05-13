import pages from '../config'
import createButton from '../createButton'

export const confirmation = <Next extends keyof typeof pages, Prev extends keyof typeof pages>(props: {
  text: string
  acceptText?: string
  cancelText?: string
  next: Next
  prev: Prev
  nextParams: Parameters<(typeof pages)[Next]>[number]
  prevParams: Parameters<(typeof pages)[Prev]>[number]
}) => {
  const { acceptText = 'Да', cancelText = 'Нет' } = props
  return {
    get text() {
      return `${props.text}`
    },

    options(message_id: number) {
      return {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              createButton({
                message_id,
                page: props.next,
                params: props.nextParams,
                text: acceptText,
              }),
              createButton({
                message_id,
                page: props.prev,
                params: props.prevParams,
                text: cancelText,
              }),
            ],
          ],
        },
      }
    },
  }
}
