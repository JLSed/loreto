import useBoxControls from '../useBoxControls'

interface Props {
  controls: ReturnType<typeof useBoxControls>
}

export default function Phase1(props: Props) {
  return (
    <div className='flex items-center justify-center h-full flex-col'>
      <div className='flex items-center gap-2'>
        <div>PO # :</div>
        <div className='text-3xl'>
          {props.controls.poNumber === '' ? '_____' : props.controls.poNumber}
        </div>
      </div>
      <div>
        <div className='gap-1 grid grid-cols-[5rem_1fr]'>
          <div>CODE #</div>
          <div>: {props.controls.codeNumber}</div>
        </div>
        <div className='gap-1 grid grid-cols-[5rem_1fr]'>
          <div>ITEM #</div>
          <div>: {props.controls.itemNumber}</div>
        </div>
        <div className='gap-1 grid grid-cols-[5rem_1fr]'>
          <div>QTY</div>
          <div>
            : {props.controls.quantity}{' '}
            {props.controls.quantity > 1 ? 'PCS.' : 'PC.'}
          </div>
        </div>
        <div className='gap-1 grid grid-cols-[5rem_1fr]'>
          <div>DESC</div>
          <div>: {props.controls.description}</div>
        </div>
        <div className='gap-1 grid grid-cols-[5rem_1fr]'>
          <div>WEIGHT</div>
          <div>: {props.controls.weight}</div>
        </div>
        <div className='gap-1 grid grid-cols-[5rem_1fr]'>
          <div>MEAS</div>
          <div>: {props.controls.meas}</div>
        </div>
      </div>
    </div>
  )
}
