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
      className='rounded-lg border py-8'
      style={{
        height: `${height}px`,
      }}
    >
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
      >
        <div className='absolute bottom-0 left-1/2 -translate-x-1/2 p-4 small'>
          W - {pixelWidth}
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel
        ref={lPanelRef}
        className='bg-yellow-900/30 relative'
        defaultSize={lengthPercentage}
        onResize={setLengthPercentage}
      >
        <div className='absolute bottom-0 left-1/2 -translate-x-1/2 p-4 small'>
          L - {pixelLength}
        </div>
      </ResizablePanel>

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
