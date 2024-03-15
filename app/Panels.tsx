import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'

import useBoxControls from './useBoxControls'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import Phase2 from './_markings/Phase2'

export default function Panels(props: {
  controls: ReturnType<typeof useBoxControls>
}) {
  const {
    height,
    pixelWidth,
    pixelLength,
    widthPercentage,
    lengthPercentage,
    setLengthPercentage,
    setWidthPercentage,
    wPanelRef,
    lPanelRef,
    containerWidth,
  } = props.controls

  const [leftMostPanelSize, setLeftMostPanelSize] = useState(20)
  const [rightMostPanelSize, setRightMostPanelSize] = useState(20)

  const computeWLabelPosition = () => {
    const p = leftMostPanelSize + widthPercentage / 2
    return containerWidth * (p / 100)
  }
  const computeLLabelPosition = () => {
    const p = leftMostPanelSize + widthPercentage + lengthPercentage / 2
    return containerWidth * (p / 100)
  }

  return (
    <ResizablePanelGroup
      id={'main-container'}
      direction='horizontal'
      className='rounded-lg border py-8 relative pb-10'
      style={{
        height: `${height}px`,
      }}
    >
      <div className='absolute bottom-0 pb-4 flex w-full'>
        <div
          hidden={pixelWidth === 0}
          className='text-center small -translate-x-1/2 absolute bottom-3'
          style={{
            left: `${computeWLabelPosition()}px`,
          }}
        >
          W - {pixelWidth}
        </div>
        <div
          hidden={pixelLength === 0}
          className='text-center small -translate-x-1/2 absolute bottom-3'
          style={{
            left: `${computeLLabelPosition()}px`,
          }}
        >
          L - {pixelLength}
        </div>
      </div>

      <ResizablePanel
        defaultSize={leftMostPanelSize}
        className='relative'
        onResize={setLeftMostPanelSize}
      >
        <div className='absolute right-0 top-1/2 -translate-y-1/2 p-4 small'>
          H - {height}
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel
        ref={wPanelRef}
        className={cn('bg-yellow-900/45 relative', {
          'min-w-[25%]': pixelWidth === 0,
        })}
        defaultValue={widthPercentage}
        onResize={setWidthPercentage}
      />

      <ResizableHandle withHandle />

      <ResizablePanel
        ref={lPanelRef}
        className='bg-yellow-900/30 relative'
        defaultSize={lengthPercentage}
        onResize={setLengthPercentage}
      >
        <Phase2 controls={props.controls} />
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel
        defaultSize={rightMostPanelSize}
        onResize={setRightMostPanelSize}
        className='relative'
      >
        <div className='absolute left-0 top-1/2 -translate-y-1/2 p-4 small'>
          H - {height}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
