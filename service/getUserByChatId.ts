import prisma from '../prisma/client'

const getUserByChatId = (chat_id: string) => {
  return prisma.user.upsert({
    where: {
      chat_id,
    },
    create: {
      chat_id,
    },
    update: {},
  })
}

export default getUserByChatId
