import { useMemo } from 'react'
import useBoxControls from '../useBoxControls'

import AddMarking from './AddMarking'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Cross2Icon } from '@radix-ui/react-icons'

interface Props {
  controls: ReturnType<typeof useBoxControls>
}

export default function Phase1Controls(props: Props) {
  const markings = useMemo(
    () => props.controls.markings.filter((m) => m.phase === 1),
    [props.controls.markings]
  )

  return (
    <div className='grid gap-4 px-4'>
      <div className='text-sm text-center p-4 bg-muted rounded'>
        💡Right click a marking on the box to edit.
      </div>

      {markings.map((m) => {
        return (
          <div
            key={m.label.replaceAll(' ', '-')}
            className='flex items-center justify-between'
          >
            <Label>{m.label}</Label>
            <Button
              size={'icon'}
              variant={'ghost'}
            >
              <Cross2Icon className='w-3 h-3' />
            </Button>
          </div>
        )
      })}

      <AddMarking controls={props.controls} />
    </div>
  )
}
