import { addCallbackData } from './callbackData'
import pages from './config'

interface CreateButtonProps<T extends keyof typeof pages> {
  text: string
  page: Parameters<typeof addCallbackData<T>>['0']['page']
  params: Parameters<typeof addCallbackData<T>>['0']['params']
  message_id: Parameters<typeof addCallbackData<T>>['0']['message_id']
}
const createButton = <T extends keyof typeof pages>(props: CreateButtonProps<T>) => {
  return {
    text: props.text,
    callback_data: addCallbackData({
      page: props.page,
      params: props.params,
      message_id: props.message_id,
    }),
  }
}

export default createButton
