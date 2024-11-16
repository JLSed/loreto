import { ReactNode } from 'react'

export default function StatusWithDot(props: {
  color?: string
  label: ReactNode
}) {
  return (
    <div className='flex items-center gap-2'>
      <div
        className='rounded-full w-3 h-3'
        style={{ backgroundColor: props.color ?? 'grey' }}
      />
      {props.label}
    </div>
  )
}
