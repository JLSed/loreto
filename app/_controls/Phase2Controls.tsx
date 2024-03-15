import React from 'react'
import useBoxControls from '../useBoxControls'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'

interface Props {
  controls: ReturnType<typeof useBoxControls>
}

export default function Phase2Controls(props: Props) {
  return (
    <div className='grid gap-4 p-4'>
      <div className='text-muted-foreground small'>Phase II</div>
      <div className='flex items-center justify-between'>
        <label
          htmlFor='logo-size'
          className='small'
        >
          Logo Size
        </label>
        <Input
          type='number'
          id='logo-size'
          placeholder='Logo size'
          value={props.controls.logoSize}
          onChange={(e) => props.controls.setLogoSize(e.target.valueAsNumber)}
          className='w-24'
        />
      </div>
      <Slider
        value={[props.controls.logoSize]}
        max={1000}
        onValueChange={(value) => props.controls.setLogoSize(value[0])}
        step={1}
        className='w-full'
      />
    </div>
  )
}
