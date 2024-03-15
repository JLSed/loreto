'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { Slider } from '@/components/ui/slider'
import useBoxControls from './useBoxControls'

import Panels from './Panels'

export default function Home() {
  const controls = useBoxControls()

  const {
    height,
    setHeight,
    pixelWidth,
    pixelLength,
    widthRef,
    lengthRef,
    heightRef,
    applyChanges,
  } = controls

  return (
    <main className='grid grid-cols-[250px_1fr] pr-4 py-4'>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          applyChanges()
        }}
        aria-label='controls'
        className='flex flex-col p-4 pt-0 gap-4'
      >
        <div className='border-b py-3 flex items-center justify-between'>
          <div className='text-muted-foreground small'>Controls</div>
          <Button size={'sm'}>Apply</Button>
        </div>
        <div className='flex items-center justify-between'>
          <label
            htmlFor='Width'
            className='small'
          >
            Width
          </label>
          <Input
            ref={widthRef}
            id='Width'
            type='number'
            placeholder='Width'
            defaultValue={pixelWidth}
            key={pixelWidth}
            className='w-24'
          />
        </div>
        <div className='flex items-center justify-between'>
          <label
            htmlFor='Length'
            className='small'
          >
            Length
          </label>
          <Input
            ref={lengthRef}
            id='Length'
            type='number'
            placeholder='Length'
            defaultValue={pixelLength}
            key={pixelLength}
            className='w-24'
          />
        </div>
        <div className='flex items-center justify-between'>
          <label
            htmlFor='Height'
            className='small'
          >
            Height
          </label>
          <Input
            ref={heightRef}
            type='number'
            id='Height'
            placeholder='Height'
            defaultValue={height}
            key={height}
            className='w-24'
          />
        </div>
        <Slider
          value={[height]}
          max={1000}
          onValueChange={(value) => setHeight(value[0])}
          step={1}
          className='w-full'
        />
      </form>

      <Panels controls={controls} />
    </main>
  )
}
