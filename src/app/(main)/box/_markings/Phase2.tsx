import useBoxControls from '../useBoxControls'

interface Props {
  controls: ReturnType<typeof useBoxControls>
}

export default function Phase2(props: Props) {
  return (
    <div className='p-8 flex items-center justify-center flex-col h-full'></div>
  )
}
