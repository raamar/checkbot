//@ts-nocheck

import prisma from '../prisma/client'
import { AxiosError } from 'axios'
import http from '../service/http'
import type TelegramBot = require('node-telegram-bot-api')

export const update = async (bot: TelegramBot) => {
  console.info('Starting update')
  try {
    const hosts = await prisma.host.findMany({
      where: {
        subscriptions: {
          some: {
            hostId: {
              gt: -1,
            },
          },
        },
      },
      select: {
        id: true,
        value: true,
        subscriptions: {
          select: {
            user: {
              select: {
                id: true,
                chat_id: true,
              },
            },
          },
        },
      },
    })

    const results = await Promise.all(
      hosts.map(async (item) => {
        try {
          const response = await http.get('http://' + item.value)

          const time = Number(response.headers['request-duration'])
          const https = Boolean(response.headers['is-https'])
          const { status } = response

          return {
            hostId: item.id,
            subscriptions: item.subscriptions,
            host: item.value,
            time,
            https,
            status,
          }
        } catch (error) {
          if (error instanceof AxiosError) {
            console.error(error)
            return {
              hostId: item.id,
              host: item.value,
              subscriptions: item.subscriptions,
              time: error?.response?.headers['request-duration'] ?? Number(process.env.CHECK_TIMEOUT),
              https: error?.response?.headers['is-https'] ?? false,
              status: error?.response?.status ?? 408,
            }
          }
        }
      })
    )

    await prisma.check.createMany({
      data: results.map((item) => {
        return {
          hostId: item.hostId,
          https: item.https,
          status: item.status,
          time: item.time,
        }
      }),
    })

    const messages = results
      .filter((item) => item.status !== 200)
      .map((item) => {
        return item.subscriptions.map(({ user }) => ({
          user: user.chat_id,
          message:
            `❗️❗️❗️ Ресурс <code>${item.host}</code>: код ответа <b>${item.status}</b>❗️❗️❗️` +
            `\n\n В меню - <b>/start</b>`,
        }))
      })
      .flat()

    await Promise.all(messages.map(({ user, message }) => bot.sendMessage(user, message, { parse_mode: 'HTML' })))
  } catch (error) {
    console.error(error)
  }
}
