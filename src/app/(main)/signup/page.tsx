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
    <div className='min-h-screen bg-gradient-to-t from-primary/5 via-primary/2 to-background flex items-center justify-center p-4 relative overflow-hidden'>
      {/* Background decoration */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl animate-pulse'></div>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent/10 blur-3xl animate-pulse delay-1000'></div>
      </div>

      <div className='max-w-lg w-full bg-card/95 backdrop-blur-sm p-10 rounded-lg shadow-2xl border border-border animate-in slide-in-from-bottom duration-500 relative z-10'>
        <div className='flex items-center justify-between gap-4 mb-6 animate-in slide-in-from-top duration-500 delay-200'>
          <div className='space-y-1'>
            <h2 className='text-3xl font-bold text-foreground'>Sign up</h2>
            <div className='w-12 h-1 bg-primary rounded-full'></div>
          </div>
          <Link href={'/'}>
            <Button
              variant='secondary'
              className='transition-all duration-300'
            >
              <ArrowLeft className='h-4 w-4 mr-2' />
              Return
            </Button>
          </Link>
        </div>
        <p className='mb-8 text-muted-foreground animate-in fade-in duration-500 delay-300'>
          Create an account to get started with Loreto Trading
        </p>

        <form
          onSubmit={form.handleSubmit(submit)}
          method='POST'
          className='animate-in fade-in duration-500 delay-400'
        >
          <div className='space-y-6'>
            <FormItem
              title='Email'
              error={errors?.email?.message}
            >
              <Input
                placeholder='Enter your email address'
                className='border-2 border-border focus:border-ring transition-all duration-200 h-12 px-4 rounded-lg bg-background text-foreground'
                {...form.register('email')}
              />
            </FormItem>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormItem
                title='First Name'
                error={errors?.firstName?.message}
              >
                <Input
                  placeholder='Enter your first name'
                  className='border-2 border-border focus:border-ring transition-all duration-200 h-12 px-4 rounded-lg bg-background text-foreground'
                  {...form.register('firstName')}
                />
              </FormItem>
              <FormItem
                title='Last Name'
                error={errors?.lastName?.message}
              >
                <Input
                  placeholder='Enter your last name'
                  className='border-2 border-border focus:border-ring transition-all duration-200 h-12 px-4 rounded-lg bg-background text-foreground'
                  {...form.register('lastName')}
                />
              </FormItem>
            </div>
            <FormItem
              title='Create Password (minimum of 6 characters)'
              error={errors?.password?.message}
            >
              <div className='relative'>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Create a strong password'
                  className='border-2 border-border focus:border-ring transition-all duration-200 h-12 px-4 pr-12 rounded-lg bg-background text-foreground'
                  {...form.register('password')}
                />
                <Button
                  onClick={() => setShowPassword((s) => !s)}
                  type='button'
                  variant={'ghost'}
                  size={'sm'}
                  className='absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 hover:bg-accent rounded-md transition-colors'
                >
                  {showPassword ? (
                    <Eye className='w-4 h-4 text-muted-foreground' />
                  ) : (
                    <EyeOff className='w-4 h-4 text-muted-foreground' />
                  )}
                </Button>
              </div>
            </FormItem>
            <FormItem
              title='Confirm Password'
              error={errors?.confirmPassword?.message}
            >
              <div className='relative'>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='Confirm your password'
                  className='border-2 border-border focus:border-ring transition-all duration-200 h-12 px-4 pr-12 rounded-lg bg-background text-foreground'
                  {...form.register('confirmPassword')}
                />
                <Button
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  type='button'
                  variant={'ghost'}
                  size={'sm'}
                  className='absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 hover:bg-accent rounded-md transition-colors'
                >
                  {showConfirmPassword ? (
                    <Eye className='w-4 h-4 text-muted-foreground' />
                  ) : (
                    <EyeOff className='w-4 h-4 text-muted-foreground' />
                  )}
                </Button>
              </div>
            </FormItem>
          </div>

          <div className='mt-8'>
            <Button
              loading={loading}
              className='w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5'
            >
              {loading ? 'Creating your account...' : 'Create Account'}
            </Button>
          </div>

          <div className='mt-8 pt-6 border-t border-border'>
            <p className='text-center text-sm text-muted-foreground'>
              Already have an account?{' '}
              <Link
                href='/?open=1'
                className='text-primary hover:text-primary/80 font-medium transition-colors duration-200'
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>

        <AlertDialog open={isVerification}>
          <AlertDialogContent className='max-w-md mx-auto bg-card/95 backdrop-blur-sm border shadow-2xl'>
            <AlertDialogHeader className='text-center space-y-4'>
              <div className='mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center animate-pulse'>
                <svg
                  className='w-8 h-8 text-primary-foreground'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                  />
                </svg>
              </div>
              <AlertDialogTitle className='text-2xl font-bold text-foreground'>
                Verify Your Email
              </AlertDialogTitle>
              <AlertDialogDescription className='text-muted-foreground'>
                We&apos;ve sent a 6-digit code to your email address. Please
                enter it below to verify your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className='flex flex-col gap-6 justify-center items-center py-4'>
              <InputOTP
                maxLength={6}
                onChange={(value) => {
                  if (value.length === 6) {
                    verifyOTP(value)
                  }
                }}
                className='gap-2'
              >
                <InputOTPGroup className='gap-2'>
                  <InputOTPSlot
                    index={0}
                    className='w-12 h-12 border-2 border-border focus:border-ring rounded-lg text-lg font-semibold bg-background text-foreground'
                  />
                  <InputOTPSlot
                    index={1}
                    className='w-12 h-12 border-2 border-border focus:border-ring rounded-lg text-lg font-semibold bg-background text-foreground'
                  />
                  <InputOTPSlot
                    index={2}
                    className='w-12 h-12 border-2 border-border focus:border-ring rounded-lg text-lg font-semibold bg-background text-foreground'
                  />
                </InputOTPGroup>
                <InputOTPSeparator className='text-muted-foreground' />
                <InputOTPGroup className='gap-2'>
                  <InputOTPSlot
                    index={3}
                    className='w-12 h-12 border-2 border-border focus:border-ring rounded-lg text-lg font-semibold bg-background text-foreground'
                  />
                  <InputOTPSlot
                    index={4}
                    className='w-12 h-12 border-2 border-border focus:border-ring rounded-lg text-lg font-semibold bg-background text-foreground'
                  />
                  <InputOTPSlot
                    index={5}
                    className='w-12 h-12 border-2 border-border focus:border-ring rounded-lg text-lg font-semibold bg-background text-foreground'
                  />
                </InputOTPGroup>
              </InputOTP>
              <div className='text-center'>
                <p className='text-sm text-muted-foreground flex items-center gap-2 justify-center'>
                  {verifying ? (
                    <>
                      <div className='w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin'></div>
                      Verifying your code...
                    </>
                  ) : (
                    <>
                      <div className='w-2 h-2 bg-primary rounded-full'></div>
                      Enter the 6-digit code from your email
                    </>
                  )}
                </p>
              </div>
            </div>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={hasBeenVerified}>
          <AlertDialogContent className='max-w-md mx-auto bg-card/95 backdrop-blur-sm border shadow-2xl'>
            <AlertDialogHeader className='text-center space-y-4'>
              <div className='mx-auto w-20 h-20 bg-primary rounded-full flex items-center justify-center animate-bounce'>
                <svg
                  className='w-10 h-10 text-primary-foreground'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
              <AlertDialogTitle className='text-2xl font-bold text-foreground'>
                Account Verified Successfully! 🎉
              </AlertDialogTitle>
              <AlertDialogDescription className='text-muted-foreground'>
                Welcome to Loreto Trading! Your account has been created and
                verified. You can now sign in and start using our services.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className='mt-6'>
              <AlertDialogAction
                onClick={() => router.push('/?open=1')}
                className='w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300'
              >
                Sign In Now
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
