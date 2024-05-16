declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_NAME: string
      DB_USER: string
      DB_PASSWORD: string
      DB_HOST: string
      DB_PORT: string
      TELEGRAM_TOKEN: string
      DATABASE_URL: string
      MAX_SUBSCRIPTIONS: string
      CHECK_TIMEOUT: string
    }
  }
}

export {}
