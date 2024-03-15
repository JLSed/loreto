import React from 'react'
import useBoxControls from '../useBoxControls'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'

interface Props {
  controls: ReturnType<typeof useBoxControls>
}

export default function Phase2Controls(props: Props) {
  return (
    <div className='grid gap-4 p-4'>
      <div className='text-muted-foreground small'>Phase II</div>
      <div className='flex items-center justify-between'>
        <Label htmlFor='logo-size'>Logo Size</Label>
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
      <div className='space-y-1'>
        <Label htmlFor='box-name'>Box Name</Label>
        <Input
          id='box-name'
          placeholder='Box Name'
          value={props.controls.boxName}
          onChange={(e) => props.controls.setBoxName(e.target.value)}
        />
      </div>
      <div className='space-y-1'>
        <Label htmlFor='code-number'>CODE #</Label>
        <Input
          id='code-number'
          placeholder='Code'
          value={props.controls.codeNumber}
          onChange={(e) => props.controls.setCodeNumber(e.target.value)}
        />
      </div>
      <div className='space-y-1'>
        <Label htmlFor='ctn-number'>CTN #</Label>
        <Input
          id='ctn-number'
          placeholder='CTN #'
          value={props.controls.ctnNumber}
          onChange={(e) => props.controls.setCtnNumber(e.target.value)}
        />
      </div>
    </div>
  )
}
