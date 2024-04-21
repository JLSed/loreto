/* eslint-disable @next/next/no-img-element */
import { BoxPlacement, BoxThickness } from '@/common/enums/enums.db'
import { TCustomerBoxes } from './page'
import AddToCardButton from './AddToCardButton'
import DeleteBox from './DeleteBox'

export default function CustomerBoxes(props: { boxes: TCustomerBoxes }) {
  return (
    <main className='px-4'>
      {props.boxes.map((b) => {
        return (
          <div
            key={b.id}
            className='p-6 border rounded-xl my-8 overflow-x-scroll relative'
          >
            <div className='flex items-center justify-between'>
              <div className='font-bold mb-2 capitalize'>{b.name}</div>
              <div className='flex gap-2'>
                <AddToCardButton boxId={b.id} />
                <DeleteBox boxId={b.id} />
              </div>
            </div>

            <div className='flex divide-x'>
              <div className='grid gap-2 grid-cols-[10ch_1fr] mb-4 pr-4 place-content-start'>
                <div>Width:</div>
                <div>{Math.round(b.totalWidth * (b.leftPanelSize / 100))}</div>

                <div>Length:</div>
                <div>{Math.round(b.totalWidth * (b.rightPanelSize / 100))}</div>

                <div>Height:</div>
                <div>{b.height}</div>
              </div>

              <div className='grid gap-2 grid-cols-[10ch_1fr] mb-4 px-4 place-content-start'>
                <div>Thickness:</div>
                <div>
                  {b.thickness === BoxThickness.Single ? 'Single' : 'Double'}
                </div>

                <div>Placement:</div>
                <div>
                  {b.placement === BoxPlacement.Master ? 'Master' : 'Inner'}
                </div>
              </div>
            </div>

            <div
              style={{
                width: b.totalWidth + 'px',
                height: b.height + 'px',
                display: 'grid',
                gridTemplateColumns: `${b.leftPanelSize}% ${b.rightPanelSize}%`,
                backgroundImage: "url('/karton.avif')",
              }}
            >
              <div className='border-r'></div>
              <div></div>

              {b.markings.map((m, i) => {
                return (
                  <div
                    key={i}
                    className='p-2 inline-block absolute text-black'
                    style={{
                      transform: m.cssTransform.trim(),
                    }}
                  >
                    {m.label} {m.value}
                  </div>
                )
              })}

              {b.imageMarkings.map((m, i) => {
                return (
                  <div
                    key={i}
                    className='cursor-move inline-block absolute z-10 text-black'
                    style={{
                      transform: m.transform,
                      width: `${m.width}px`,
                      height: `${m.height}px`,
                    }}
                  >
                    <img
                      className='grayscale'
                      src={m.src}
                      alt=''
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </main>
  )
}
