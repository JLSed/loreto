'use client'

import FormItem from '@/components/shared/forms/FormItem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { NewUser, NewUserSchema } from './new-user-schema'
import { useState } from 'react'
import { createUser, verifyOTPAction } from './actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { ArrowLeft, ChevronLeft, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

export default function SignUpPage() {
  const router = useRouter()
  const form = useForm<NewUser>({
    resolver: zodResolver(NewUserSchema),
  })

  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [isVerification, setIsVerification] = useState(false)
  const [hasBeenVerified, setHasBeenVerified] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const submit = async (data: NewUser) => {
    const password = data.password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{6,}$/

    if (!passwordRegex.test(password)) {
      form.setError('password', {
        message:
          'Password must contain uppercase, lowercase, number, and symbol.',
      })
      return
    }

    const username = `${data.firstName} ${data.lastName}`
    try {
      setLoading(true)
      const res = await createUser(data, username)
      if (res.status === 409) {
        form.setError('email', {
          message: 'Email is unavailable. Please use a different one.',
        })
      } else if (res.status === 201) {
        setIsVerification(true)
      }
    } catch (error: any) {
      if (error?.code) {
        toast.error(`An error occured: ${error?.code}`, {
          richColors: true,
        })
      } else {
        toast.error('An unknown error occurred. Please try again.', {
          richColors: true,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const errors = form.formState.errors

  const verifyOTP = async (value: string) => {
    setVerifying(true)
    const res = await verifyOTPAction(value, form.getValues('email'))
    setVerifying(false)

    if (res.status === 200) {
      form.reset()
      setIsVerification(false)
      setHasBeenVerified(true)
    } else {
      toast.error('Invalid OTP. Please try again.', {
        richColors: true,
      })
    }
  }

  return (
    <div className='max-w-md m-auto p-4 border rounded my-14'>
      <div className='flex items-center justify-between gap-4 mb-2'>
        <h2>Sign up</h2>
        <Link href={'/'}>
          <Button variant='secondary'>
            <ArrowLeft className='h-5 w-5' />
            Return
          </Button>
        </Link>
      </div>
      <p className='mb-8'>Create an account to get started</p>

      <form
        onSubmit={form.handleSubmit(submit)}
        method='POST'
      >
        <div className='space-y-4'>
          <FormItem
            title='Email'
            error={errors?.email?.message}
          >
            <Input
              placeholder='Enter email'
              {...form.register('email')}
            />
          </FormItem>
          <FormItem
            title='First Name'
            error={errors?.firstName?.message}
          >
            <Input
              placeholder='Enter your first name'
              {...form.register('firstName')}
            />
          </FormItem>
          <FormItem
            title='Last Name'
            error={errors?.lastName?.message}
          >
            <Input
              placeholder='Enter your last name'
              {...form.register('lastName')}
            />
          </FormItem>
          <FormItem
            title='Create Password (minimum of 6 characters)'
            error={errors?.password?.message}
          >
            <div className='flex items-center gap-1'>
              <Input
                type={showPassword ? 'text' : 'password'}
                {...form.register('password')}
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
                type={showConfirmPassword ? 'text' : 'password'}
                {...form.register('confirmPassword')}
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
        </div>

        <div className='flex justify-end mt-8'>
          <Button loading={loading}>Create account</Button>
        </div>
      </form>

      <AlertDialog open={isVerification}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>One-Time Password</AlertDialogTitle>
            <AlertDialogDescription>
              Please enter the one-time password sent to your email to verify
              your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className='flex flex-col gap-3 justify-center items-center'>
            <InputOTP
              maxLength={6}
              onChange={(value) => {
                if (value.length === 6) {
                  verifyOTP(value)
                }
              }}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <p>
              {verifying
                ? 'Checking validity...'
                : 'Please enter the OTP sent to your email'}
            </p>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={hasBeenVerified}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Your account has been verified 🎉
            </AlertDialogTitle>
            <AlertDialogDescription>
              You may now login to your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => router.push('/?open=1')}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
