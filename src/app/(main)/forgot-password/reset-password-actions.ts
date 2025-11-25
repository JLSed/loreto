'use server'

import { prisma } from '@/common/configs/prisma'
import { emailTransporter } from '@/common/services/email'
import { hashPassword } from '@/lib/server-only-utils'

export async function sendEmailResetPasswordLinkAction(email: string) {
  try {
    console.log('[RESET_PASSWORD] Starting password reset request for email:', email)
    
    const user = await prisma.user.findFirst({
      where: {
        email,
        password: {
          not: null,
        },
      },
    })

    if (!user) {
      console.log('[RESET_PASSWORD] User not found or has no password set for email:', email)
      return { status: 400, ok: false, message: 'User not found' }
    }

    console.log('[RESET_PASSWORD] User found, ID:', user.id)

    const isDev = process.env.NODE_ENV === 'development'
    const uid = user.id
    const resetLink = `${isDev ? 'http://localhost:3000' : 'https://loreto.vercel.app'}/forgot-password?uid=${uid}`

    console.log('[RESET_PASSWORD] Environment:', isDev ? 'development' : 'production')
    console.log('[RESET_PASSWORD] Reset link generated:', resetLink)
    console.log('[RESET_PASSWORD] Attempting to send email to:', user.email)

    await emailTransporter.sendMail({
      from: 'noreply@loretotrading',
      sender: 'noreply@loretotrading',
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
            <a style="padding: 1.5rem; background-color: purple; color: white; border-radius: 1rem;" href="${resetLink}">
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

    console.log('[RESET_PASSWORD] Email sent successfully to:', user.email)
    return { status: 200, ok: true, message: 'Reset email sent successfully' }
  } catch (error) {
    console.error('[RESET_PASSWORD] Error in sendEmailResetPasswordLinkAction:', error)
    console.error('[RESET_PASSWORD] Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return { status: 500, ok: false, message: 'Failed to send reset email', error: error instanceof Error ? error.message : String(error) }
  }
}

export async function createNewPasswordAction(uid: string, password: string) {
  try {
    console.log('[CREATE_PASSWORD] Starting password creation for UID:', uid)
    console.log('[CREATE_PASSWORD] Password length:', password?.length || 0)

    return await prisma.$transaction(async (tx) => {
      console.log('[CREATE_PASSWORD] Transaction started')

      const user = await tx.user.findFirst({
        where: {
          id: uid,
          password: {
            not: null,
          },
        },
      })

      if (!user) {
        console.log('[CREATE_PASSWORD] User not found or has no existing password for UID:', uid)
        return { status: 400, ok: false, message: 'Invalid user or user does not have a password set' }
      }

      console.log('[CREATE_PASSWORD] User found:', { id: user.id, email: user.email })
      console.log('[CREATE_PASSWORD] Hashing new password...')

      const hashedPassword = hashPassword(password)
      console.log('[CREATE_PASSWORD] Password hashed successfully, length:', hashedPassword?.length || 0)

      console.log('[CREATE_PASSWORD] Updating user password in database...')
      await tx.user.update({
        where: {
          id: uid,
        },
        data: {
          password: hashedPassword,
        },
      })

      console.log('[CREATE_PASSWORD] Password updated successfully for user:', user.email)
      return { status: 200, ok: true, message: 'Password reset successfully' }
    })
  } catch (error) {
    console.error('[CREATE_PASSWORD] Error in createNewPasswordAction:', error)
    console.error('[CREATE_PASSWORD] Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      uid,
    })
    return { 
      status: 500, 
      ok: false, 
      message: 'Failed to reset password',
      error: error instanceof Error ? error.message : String(error)
    }
  }
}
