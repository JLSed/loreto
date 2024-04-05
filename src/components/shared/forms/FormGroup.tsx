import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface Props {
  groupTitle: ReactNode
  children: ReactNode
  cardContentClassName?: string
}

export default function FormGroup(props: Props) {
  return (
    <Card className='shadow-none'>
      <CardHeader>
        <CardTitle className='text-base'>{props.groupTitle}</CardTitle>
      </CardHeader>
      <CardContent className={cn('space-y-4', props.cardContentClassName)}>
        {props.children}
      </CardContent>
    </Card>
  )
}
