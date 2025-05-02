/* eslint-disable @next/next/no-img-element */
import { BoxPlacement, BoxThickness } from '@/common/enums/enums.db'
import { TCustomerBoxes } from './page'
import AddToCardButton from './AddToCardButton'
import DeleteBox from './DeleteBox'
import { Render2DBox } from '../../box/BoxQuotation'
import { computePrice, pesos } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CustomerBoxes(props: { boxes: TCustomerBoxes }) {
  return (
    <main className='px-4'>
      {props.boxes.map((b) => {
        const pixelWidth = +(b.totalWidth * (b.leftPanelSize / 100)).toFixed(2)
        const pixelLength = +(b.totalWidth * (b.rightPanelSize / 100)).toFixed(
          2
        )
        const computation = computePrice({
          height: b.height,
          length: pixelLength,
          width: pixelWidth,
          thickness: b.thickness === 1 ? 'single' : 'double',
        })

        return (
          <div
            key={b.id}
            className='p-6 border rounded-xl my-8 overflow-x-scroll relative'
          >
            <div className='flex items-center justify-between'>
              <div className='font-bold mb-2 capitalize'>{b.name}</div>
              <div className='flex gap-2'>
                <Link
                  passHref
                  href={`/box/preview?box=${b.id}`}
                >
                  <Button>See Preview</Button>
                </Link>
                <AddToCardButton boxId={b.id} />
                <DeleteBox boxId={b.id} />
              </div>
            </div>

            <div className='flex divide-x mb-4'>
              <div className='grid gap-2 grid-cols-[10ch_1fr] mb-4 pr-4 place-content-start'>
                <div>Width:</div>
                <div>
                  {Math.round(b.totalWidth * (b.leftPanelSize / 100))}
                  <code>in</code>
                </div>

                <div>Length:</div>
                <div>
                  {Math.round(b.totalWidth * (b.rightPanelSize / 100))}
                  <code>in</code>
                </div>

                <div>Height:</div>
                <div>
                  {b.height}
                  <code>in</code>
                </div>

                <div>Total Area:</div>
                <div>
                  {computation.totalArea}
                  <code>
                    <sup>2</sup>in
                  </code>
                </div>

                <div>Total Price:</div>
                <div>{pesos(computation.totalPrice)}</div>
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

                <div>Quality:</div>
                <div>Class {b.quality}</div>
              </div>
            </div>

            <Render2DBox
              width={pixelWidth}
              length={pixelLength}
              height={b.height}
              thickness={b.thickness}
              scaleFactor={8}
            />
          </div>
        )
      })}
    </main>
  )
}
