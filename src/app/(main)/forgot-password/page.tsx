'use client'

import FormItem from '@/components/shared/forms/FormItem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSearchParams } from 'next/navigation'
import { FormEvent, useState } from 'react'
import {
  createNewPasswordAction,
  sendEmailResetPasswordLinkAction,
} from './reset-password-actions'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { NewPassword, NewPasswordSchema } from './new-password-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

enum Step {
  EnterEmail,
  ResetLinkSent,
  CreateNewPassword,
  PasswordResetSuccessfully,
}

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams()
  const uid = searchParams.get('uid')
  const [sendingEmail, setSendingEmail] = useState(false)
  const [currentStep, setCurrentStep] = useState<Step>(
    uid ? Step.CreateNewPassword : Step.EnterEmail
  )

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [creatingNewPassword, setCreatingNewPassword] = useState(false)
  const newPasswordForm = useForm<NewPassword>({
    resolver: zodResolver(NewPasswordSchema),
  })
  const errors = newPasswordForm.formState.errors

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSendingEmail(true)
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')?.toString() ?? ''

    console.log('[FRONTEND] Sending password reset request for:', email)

    const res = await sendEmailResetPasswordLinkAction(email)

    console.log('[FRONTEND] Reset email response:', res)

    if (res.ok) {
      setCurrentStep(Step.ResetLinkSent)
    } else {
      const errorMessage =
        res.message || 'Something went wrong, please try again later.'
      console.error('[FRONTEND] Failed to send reset email:', errorMessage)
      toast.error(errorMessage, {
        richColors: true,
      })
    }
    setSendingEmail(false)
  }

  const submitCreateNewPassword = async (data: NewPassword) => {
    setCreatingNewPassword(true)

    console.log('[FRONTEND] Submitting new password for UID:', uid)

    const res = await createNewPasswordAction(
      uid as string,
      data.confirmPassword
    )

    console.log('[FRONTEND] Create password response:', res)

    if (res.ok) {
      setCurrentStep(Step.PasswordResetSuccessfully)
    } else {
      const errorMessage =
        res.message || 'Something went wrong, please try again later.'
      console.error('[FRONTEND] Failed to reset password:', errorMessage)
      toast.error(errorMessage, {
        richColors: true,
      })
    }
    setCreatingNewPassword(false)
  }

  return (
    <div className='border rounded-2xl shadow max-w-md mx-auto p-6 my-12'>
      <div className='font-bold text-purple-600 mb-8'>Loreto Trading</div>

      {currentStep === Step.EnterEmail && (
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -100 }}
        >
          <header className='mb-8'>
            <div className='font-medium text-lg'>Forgot Password</div>
            <p className='text-muted-foreground text-sm'>
              {
                "Enter the email address with your account and we'll send you a link to reset your password."
              }
            </p>
          </header>
          <form onSubmit={handleSubmit}>
            <FormItem title='Account Email Address'>
              <Input
                required
                type='email'
                name='email'
                placeholder='Ente your email'
              />
            </FormItem>
            <div className='flex justify-end mt-4 gap-4'>
              <Link href={'/'}>
                <Button
                  type='button'
                  variant={'ghost'}
                >
                  Back to home
                </Button>
              </Link>
              <Button loading={sendingEmail}>Send Reset Link</Button>
            </div>
          </form>
        </motion.div>
      )}

      {currentStep === Step.ResetLinkSent && (
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: 100 }}
        >
          <h3>Email Sent</h3>
          <p className='text-muted-foreground text-sm mt-1'>
            {
              "We've sent you an email with a link to reset your password. Please check your email and follow the instructions."
            }
          </p>
          <div className='flex justify-end mt-4'>
            <Button onClick={() => setCurrentStep(Step.EnterEmail)}>
              Back
            </Button>
          </div>
        </motion.div>
      )}

      {currentStep === Step.CreateNewPassword && (
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: 100 }}
        >
          <header className='mb-8'>
            <div className='font-medium text-lg'>Create New Password</div>
            <p className='text-muted-foreground text-sm'>
              The password should be different from the previous password.
            </p>
          </header>
          <form
            className='space-y-4'
            onSubmit={newPasswordForm.handleSubmit(submitCreateNewPassword)}
          >
            <FormItem
              title='New Password'
              error={errors?.password?.message}
            >
              <div className='flex items-center gap-1'>
                <Input
                  required
                  type={showPassword ? 'text' : 'password'}
                  {...newPasswordForm.register('password')}
                />
                <Button
                  onClick={() => setShowPassword((s) => !s)}
                  type='button'
                  variant={'outline'}
                  size={'icon'}
                >
                  {showPassword ? (
                    <Eye className='w-4 h-4' />
                  ) : (
                    <EyeOff className='w-4 h-4' />
                  )}
                </Button>
              </div>
            </FormItem>
            <FormItem
              title='Confirm Password'
              error={errors?.confirmPassword?.message}
            >
              <div className='flex items-center gap-1'>
                <Input
                  required
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...newPasswordForm.register('confirmPassword')}
                />
                <Button
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  type='button'
                  variant={'outline'}
                  size={'icon'}
                >
                  {showConfirmPassword ? (
                    <Eye className='w-4 h-4' />
                  ) : (
                    <EyeOff className='w-4 h-4' />
                  )}
                </Button>
              </div>
            </FormItem>
            <div className='flex justify-end pt-2'>
              <Button loading={creatingNewPassword}>Reset Password</Button>
            </div>
          </form>
        </motion.div>
      )}

      {currentStep === Step.PasswordResetSuccessfully && (
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: 100 }}
        >
          <h3>{'Your password has been reset 🎉'}</h3>
          <p className='text-muted-foreground text-sm mt-1'>
            You can now login with your new password.
          </p>
          <div className='flex justify-end mt-6 gap-4'>
            <Link href={'/?open=1'}>
              <Button>Log in</Button>
            </Link>
            <Link href={'/'}>
              <Button variant={'outline'}>Back to home</Button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  )
}
