'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Slider } from '@/components/ui/slider'
import { useEffect, useState } from 'react'

export default function Home() {
  // actual pixel
  const [height, setHeight] = useState(400)
  const [pixelWidth, setPixelWidth] = useState(0)
  const [pixelLength, setPixelLength] = useState(0)

  const [containerWidth, setContainerWidth] = useState(0)

  // percentage
  const [widthPercentage, setWidthPercentage] = useState(25)
  const [lengthPercentage, setLengthPercentage] = useState(35)

  useEffect(() => {
    const w = document.getElementById('main-container')?.clientWidth || 0
    setContainerWidth(w)
    setPixelWidth(Math.round((w * widthPercentage) / 100))
    setPixelLength(Math.round((w * lengthPercentage) / 100))
  }, [lengthPercentage, widthPercentage])

  return (
    <main className='grid grid-cols-[250px_1fr] pr-4 py-4'>
      <div className='flex flex-col p-4 pt-0 gap-4'>
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
            id='Width'
            type='number'
            placeholder='Width'
            defaultValue={pixelWidth}
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
            id='Length'
            type='number'
            placeholder='Length'
            defaultValue={pixelLength}
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
            type='number'
            placeholder='Height'
            key={height}
            defaultValue={height}
            className='w-24'
            onChange={(e) => {
              let value = +e.currentTarget.value
              if (value < 100 || value > 1000) return
              setHeight(value)
            }}
          />
        </div>
        <Slider
          value={[height]}
          max={1000}
          onValueChange={(value) => setHeight(value[0])}
          step={1}
          className='w-full'
        />
      </div>

      <ResizablePanelGroup
        id={'main-container'}
        direction='horizontal'
        className='rounded-lg border py-8'
        style={{
          height: `${height}px`,
        }}
      >
        <ResizablePanel defaultSize={20} />

        <ResizableHandle withHandle />

        <ResizablePanel
          className='bg-yellow-900/45 relative'
          defaultValue={widthPercentage}
          onResize={setWidthPercentage}
        >
          <div className='absolute bottom-0 left-1/2 -translate-x-1/2 p-4 flex items-center gap-2'>
            W - {pixelWidth}
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel
          className='bg-yellow-900/30 relative'
          defaultSize={lengthPercentage}
          onResize={setLengthPercentage}
        >
          <div className='absolute bottom-0 left-1/2 -translate-x-1/2 p-4 flex items-center gap-2'>
            L - {pixelLength}
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel
          defaultSize={20}
          className='relative'
        >
          <div className='absolute left-0 top-1/2 -translate-y-1/2 p-4'>
            H: {height}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  )
}
