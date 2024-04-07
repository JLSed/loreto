import useBoxControls from '../useBoxControls'

import AddMarking from './AddMarking'

interface Props {
  controls: ReturnType<typeof useBoxControls>
}

export default function Phase1Controls(props: Props) {
  return (
    <div className='grid gap-4 px-4'>
      <AddMarking controls={props.controls} />
    </div>
  )
}
