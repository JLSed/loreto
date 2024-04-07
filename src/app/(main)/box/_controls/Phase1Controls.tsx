import { useMemo } from 'react'
import useBoxControls from '../useBoxControls'

import AddMarking from './AddMarking'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

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
      {markings.map((m) => {
        return (
          <div
            key={m.label.replaceAll(' ', '-')}
            className='grid space-y-2'
          >
            <Label className='text-xs'>{m.label}</Label>
            <Input
              placeholder={'Edit value here...'}
              value={m.value}
              onChange={(e) =>
                props.controls.updateMarkValue({
                  ...m,
                  value: e.target.value,
                })
              }
            />
          </div>
        )
      })}

      <AddMarking controls={props.controls} />
    </div>
  )
}
