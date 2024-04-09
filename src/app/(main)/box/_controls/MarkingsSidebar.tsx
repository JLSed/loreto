import useBoxControls from '../useBoxControls'

import AddMarking from './AddMarking'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Cross2Icon } from '@radix-ui/react-icons'

interface Props {
  controls: ReturnType<typeof useBoxControls>
}

export default function MarkingsSidebar(props: Props) {
  return (
    <div className='grid px-4'>
      <div className='text-sm text-balance text-center p-4 bg-muted rounded-md mb-2'>
        Right click on a marking inside the box to edit.
      </div>

      {props.controls.markings.map((m) => {
        return (
          <div
            key={m.label.replaceAll(' ', '-')}
            className='flex items-center justify-between'
          >
            <Label>{m.label}</Label>
            <Button
              onClick={() => props.controls.removeMarking(m)}
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
