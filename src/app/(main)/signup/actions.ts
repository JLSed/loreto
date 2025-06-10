'use server'

import { prisma } from '@/common/configs/prisma'
import { NewUser } from './new-user-schema'
import { hashPassword } from '@/lib/server-only-utils'
import { randomIntSequenceString } from '@/lib/utils'
import { emailTransporter } from '@/common/services/email'

export async function verifyOTPAction(otp: string, email: string) {
  const user = await prisma.user.findFirst({
    where: {
      email,
      randomOTP: otp,
    },
  })

  if (!user) {
    return { status: 400, ok: false }
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      randomOTP: null,
      verified: true,
    },
  })

  return {
    ok: true,
    status: 200,
  }
}

export async function createUser(input: NewUser, username: string) {
  return await prisma.$transaction(async (tx) => {
    const userExist = await tx.user.findFirst({
      where: {
        email: input.email,
      },
    })

    if (userExist) return { status: 409 }

    const randomOTP = randomIntSequenceString(6)

    const newUserEntry = await tx.user.create({
      data: {
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        username,
        password: hashPassword(input.password),
        randomOTP: randomOTP,
      },
    })

    const emailRecipient = newUserEntry.email

    await emailTransporter.sendMail({
      from: 'noreply@loretotrading',
      sender: 'noreply@loretotrading',
      to: emailRecipient,
      subject: `${randomOTP} is your verification code`,
      html: `
        <div style="margin: 2rem auto; max-width: 600px; padding: 1.5rem; font-family: sans-serif; border: 1px solid purple; border-radius: 2rem;">
          <h1>Welcome, <span style="text-transform: capitalize">${newUserEntry.firstName} ${newUserEntry.lastName}</span> 🎉 </h1>
          <p>Welcome to Loreto Trading. We are happy to have you here. To get started with your account, please verify your email. Your OTP is:</p>
          <h2>${randomOTP}</h2>
          <p>Thank you.</p>
        </div>
      `,
    })

    return { status: 201, id: newUserEntry.id }
  })
}
