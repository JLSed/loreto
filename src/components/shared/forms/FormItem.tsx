import { Label } from '@/components/ui/label'
import React, { ReactNode } from 'react'

interface Props {
  title: ReactNode
  name?: string
  children: ReactNode
  error?: ReactNode
}

export default function FormItem(props: Props) {
  return (
    <div className='space-y-1'>
      <Label htmlFor={props.name}>{props.title}</Label>
      {props.children}
      {props.error && (
        <div className='text-xs text-red-700 font-medium'>{props.error}</div>
      )}
    </div>
  )
}
