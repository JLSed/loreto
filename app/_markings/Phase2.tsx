import Image from 'next/image'
import useBoxControls from '../useBoxControls'

interface Props {
  controls: ReturnType<typeof useBoxControls>
}

export default function Phase2(props: Props) {
  return (
    <div className='p-8 flex items-center justify-center flex-col h-full'>
      <Image
        alt=''
        src={'/cheesecakes.png'}
        width={props.controls.logoSize}
        height={props.controls.logoSize}
        priority
        className='w-auto h-auto'
      />

      <div className='large mt-2'>{props.controls.boxName}</div>
      <div>
        CODE #:{' '}
        {props.controls.codeNumber === '' ? (
          '_____'
        ) : (
          <span className='underline'>{props.controls.codeNumber}</span>
        )}
      </div>
      <div>
        CTN #:{' '}
        {props.controls.ctnNumber === '' ? (
          '_____'
        ) : (
          <span className='underline'>{props.controls.ctnNumber}</span>
        )}{' '}
        of {props.controls.ctnBase}
      </div>
      <div className='uppercase'>made in philippines</div>
    </div>
  )
}
