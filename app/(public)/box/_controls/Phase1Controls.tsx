import React from 'react'
import useBoxControls from '../useBoxControls'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  controls: ReturnType<typeof useBoxControls>
}

export default function Phase1Controls(props: Props) {
  return (
    <div className='grid gap-4 px-4'>
      <div className='space-y-1'>
        <Label htmlFor='po-number'>PO #</Label>
        <Input
          id='po-number'
          placeholder='PO #'
          value={props.controls.poNumber}
          onChange={(e) => props.controls.setPoNumber(e.target.value)}
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
        <Label htmlFor='item-number'>ITEM #</Label>
        <Input
          id='item-number'
          placeholder='ITEM #'
          value={props.controls.itemNumber}
          onChange={(e) => props.controls.setItemNumber(e.target.value)}
        />
      </div>
      <div className='space-y-1'>
        <Label htmlFor='quantity'>Quantity</Label>
        <Input
          type='number'
          id='quantity'
          placeholder='Quantity'
          value={props.controls.quantity}
          onChange={(e) => props.controls.setQuantity(e.target.valueAsNumber)}
        />
      </div>
      <div className='space-y-1'>
        <Label htmlFor='desc'>Description</Label>
        <Textarea
          id='desc'
          placeholder='Description'
          value={props.controls.description}
          onChange={(e) => props.controls.setDescription(e.target.value)}
        />
      </div>
      <div className='space-y-1'>
        <Label htmlFor='weight'>Weight</Label>
        <Input
          id='weight'
          placeholder='Weight'
          value={props.controls.weight}
          onChange={(e) => props.controls.setWeight(e.target.value)}
        />
      </div>
      <div className='space-y-1'>
        <Label htmlFor='meas'>Meas</Label>
        <Input
          id='meas'
          placeholder='Meas'
          value={props.controls.meas}
          onChange={(e) => props.controls.setMeas(e.target.value)}
        />
      </div>
    </div>
  )
}
