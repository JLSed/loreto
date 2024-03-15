import React from 'react'
import useBoxControls from '../useBoxControls'

interface Props {
  controls: ReturnType<typeof useBoxControls>
}

export default function Phase1Controls(props: Props) {
  return <div className='grid gap-4 px-4'>Phase1Controls</div>
}
