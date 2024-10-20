'use server'

import { prisma } from '@/common/configs/prisma'
import { emailTransporter } from '@/common/services/email'
import { hashPassword } from '@/lib/server-only-utils'

export async function sendEmailResetPasswordLinkAction(email: string) {
  const user = await prisma.user.findFirst({
    where: {
      email,
      password: {
        not: null,
      },
    },
  })

  if (!user) return { status: 400, ok: false }

  const isDev = process.env.NODE_ENV === 'development'
  const uid = user.id

  await emailTransporter.sendMail({
    from: 'noreply@loretotrading',
    sender: 'noreply@loretotrading',
    cc: ['eechemane29@gmail.com'],
    to: user.email,
    subject: `Here's your password reset link`,
    html: `
        <div style="margin: 2rem auto; max-width: 600px; padding: 1.5rem; font-family: sans-serif; border: 1px solid purple; border-radius: 2rem;">
          <h2>Here's your password reset link</h2>
          <p>
            To reset your password, click the button below. Please do not share this link with anyone.
          </p>
          <br />
          <div>
            <a style="padding: 1.5rem; background-color: purple; color: white; border-radius: 1rem;" href="${
              isDev ? 'http://localhost:3000' : 'https://loreto.vercel.app'
            }/forgot-password?uid=${uid}">
              Reset Password
            </a>
          </div>
          <br />
          <p>
            Best regards,
            <br />
            The Loretotrading Team
          </p>
        </div>
      `,
  })

  return { status: 200, ok: true }
}

export async function createNewPasswordAction(uid: string, password: string) {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findFirst({
      where: {
        id: uid,
        password: {
          not: null,
        },
      },
    })

    if (!user) return { status: 400, ok: false }

    await tx.user.update({
      where: {
        id: uid,
      },
      data: {
        password: hashPassword(password),
      },
    })

    return { status: 200, ok: true }
  })
}
