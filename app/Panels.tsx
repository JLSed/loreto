import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'

import useBoxControls from './useBoxControls'
import { cn } from '@/lib/utils'

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
  } = props.controls

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
          className='ml-auto text-center small'
          style={{ width: `${widthPercentage < 5 ? 10 : widthPercentage}%` }}
        >
          W - {pixelWidth}
        </div>
        <div
          className='mr-auto text-center small'
          style={{ width: `${lengthPercentage < 5 ? 10 : lengthPercentage}%` }}
        >
          L - {pixelLength}
        </div>
      </div>

      <ResizablePanel
        defaultSize={20}
        className='relative'
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
      />

      <ResizableHandle withHandle />

      <ResizablePanel
        defaultSize={20}
        className='relative'
      >
        <div className='absolute left-0 top-1/2 -translate-y-1/2 p-4 small'>
          H - {height}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
