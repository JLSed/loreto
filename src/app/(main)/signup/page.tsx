'use client'

import FormItem from '@/components/shared/forms/FormItem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { NewUser, NewUserSchema } from './new-user-schema'
import { useState } from 'react'
import { createUser } from './actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const router = useRouter()
  const form = useForm<NewUser>({
    resolver: zodResolver(NewUserSchema),
  })

  const [loading, setLoading] = useState(false)
  const submit = async (data: NewUser) => {
    const username = `${data.firstName} ${data.lastName}`
    try {
      setLoading(true)
      const res = await createUser(data, username)
      if (res.status === 409) {
        form.setError('email', {
          message: 'Email is unavailable. Please use a different one.',
        })
      } else if (res.status === 201) {
        toast.success('Account created successfully. You may now login.', {
          richColors: true,
        })
        form.reset()
        alert('You will be redirected to the login page.')
        router.push('/login')
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

  return (
    <div className='max-w-md m-auto p-4 border rounded my-14'>
      <h2>Sign up</h2>
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
            title='Create Password'
            error={errors?.password?.message}
          >
            <Input
              type='password'
              {...form.register('password')}
            />
          </FormItem>
          <FormItem
            title='Confirm Password'
            error={errors?.confirmPassword?.message}
          >
            <Input
              type='password'
              {...form.register('confirmPassword')}
            />
          </FormItem>
        </div>

        <div className='flex justify-end mt-8'>
          <Button loading={loading}>Create account</Button>
        </div>
      </form>
    </div>
  )
}
