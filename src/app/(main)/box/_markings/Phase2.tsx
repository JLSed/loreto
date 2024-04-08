import BoxMarking from '@/components/moveable/BoxMarking'
import { useRef, useMemo } from 'react'
import useBoxControls, { LocalMarking } from '../useBoxControls'

interface Props {
  controls: ReturnType<typeof useBoxControls>
}

export default function Phase2(props: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  const markings = useMemo(
    () => props.controls.markings.filter((m) => m.phase === 2),
    [props.controls.markings]
  )

  const renderMarkings = (m: LocalMarking) => {
    return (
      <BoxMarking
        key={m.id}
        parentWidth={props.controls.widthPercentage}
        containerRef={containerRef}
        controls={props.controls}
        marking={m}
      />
    )
  }

  return (
    <div
      className='h-full flex-col'
      ref={containerRef}
    >
      {markings.map(renderMarkings)}
    </div>
  )
}
