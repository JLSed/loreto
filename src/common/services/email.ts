import nodemailer from 'nodemailer'
import { GOOGLE_PASSWORD } from '../constants/server-only-constants'

const createTransport = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'eechemane29@gmail.com',
      // user: 'loretotrd@gmail.com', TOBE
      pass: GOOGLE_PASSWORD,
    },
  })
}

export const emailTransporter = createTransport()
