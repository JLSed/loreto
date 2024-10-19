import nodemailer from 'nodemailer'
import { GOOGLE_PASSWORD } from '../constants/server-only-constants'

export const createTransport = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'eechemane29@gmail.com',
      pass: GOOGLE_PASSWORD,
    },
  })
}
