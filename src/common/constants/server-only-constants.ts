import 'server-only'

if (!process.env.GOOGLE_PASSWORD) {
  throw new Error('GOOGLE_PASSWORD env var is not set')
}

export const GOOGLE_PASSWORD = process.env.GOOGLE_PASSWORD
