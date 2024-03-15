import useBoxControls from '../useBoxControls'

interface Props {
  controls: ReturnType<typeof useBoxControls>
}

export default function Phase2(props: Props) {
  return (
    <div className='p-8 flex items-center justify-center flex-col h-full'>
      <div
        className='border rounded-full grid place-items-center border-black'
        style={{
          width: `${props.controls.logoSize}px`,
          height: `${props.controls.logoSize}px`,
        }}
      >
        LOGO
      </div>

      <div className='large'>{props.controls.boxName}</div>
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
