'use client'

import FormItem from '@/components/shared/forms/FormItem'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { toast } from 'sonner'

export default function SignInButton() {
  const searchParams = useSearchParams()
  const [loggingIn, setLoggingIn] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setLoggingIn(true)
    const res = await signIn('credentials', {
      redirect: false,
      email: formData.get('email')?.toString() ?? '',
      password: formData.get('password')?.toString() ?? '',
    })
    setLoggingIn(false)

    if (res?.ok) {
      window.location.reload()
      return
    }

    if (res?.status === 401) {
      toast.error(
        'Login failed, make sure your username and password are correct',
        {
          richColors: true,
        }
      )
      return
    }

    toast.error(res?.error ?? 'Something went wrong, please try again later', {
      richColors: true,
    })
  }

  return (
    <>
      <AlertDialog defaultOpen={searchParams.get('open') === '1'}>
        <AlertDialogTrigger asChild>
          <Button variant={'outline'}>Sign in</Button>
        </AlertDialogTrigger>
        <AlertDialogContent className='max-w-md'>
          <AlertDialogHeader>
            <AlertDialogTitle>Continue to Loreto Trading</AlertDialogTitle>
            <AlertDialogDescription>
              Login using your email and password or you can sign in with
              Google.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form
            className='space-y-4'
            onSubmit={handleSubmit}
          >
            <FormItem title={'Email'}>
              <Input
                name='email'
                placeholder='Enter your email'
                required
              />
            </FormItem>
            <FormItem title={'Password'}>
              <div className='flex items-center gap-1'>
                <Input
                  name='password'
                  placeholder='Password'
                  type={showPassword ? 'text' : 'password'}
                  required
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
            <div>
              <Button
                loading={loggingIn}
                variant={'default'}
                className='w-full'
              >
                Log in
              </Button>
              <Link
                href='/forgot-password'
                className='text-sm text-muted-foreground float-right mt-2'
              >
                Forgot password
              </Link>
            </div>
          </form>
          <div className='text-center'>or</div>
          <Button
            variant={'secondary'}
            onClick={async () => {
              await signIn('google', {
                redirect: true,
                callbackUrl: '/',
              })
            }}
          >
            <Image
              src='https://www.svgrepo.com/show/475656/google-color.svg'
              alt=''
              width={20}
              height={20}
              className='mr-2'
            />
            Continue with Google
          </Button>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
