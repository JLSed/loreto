import { DashboardOrders } from './page'
import Image from 'next/image'

interface Props {
  box: DashboardOrders[number]['box']
}

export default function BoxView({ box }: Props) {
  const scaleFactor = box.height > 300 ? 1 : 20
  const totalWidth = box.totalWidth * scaleFactor
  const height = box.height * scaleFactor
  const wpx = totalWidth * (box.leftPanelSize / 100)

  return (
    <div>
      <div
        className='relative'
        style={{
          backgroundImage: 'url(/karton.avif)',
          width: `${totalWidth}px`,
          height: `${height}px`,
        }}
      >
        {box.imageMarkings.map((m) => {
          return (
            <Image
              className='absolute grayscale'
              key={m.id}
              style={{ transform: m.transform }}
              src={m.src}
              alt={m.src}
              width={m.width * scaleFactor}
              height={m.height * scaleFactor}
            />
          )
        })}

        {box.markings.map((m) => {
          return (
            <div
              className='absolute'
              key={m.id}
              style={{
                transform: m.cssTransform,
              }}
            >
              {m.label} {m.value}
            </div>
          )
        })}

        <div
          className='h-full border-r border-amber-900'
          style={{
            width: `${wpx}px`,
          }}
        />
      </div>
    </div>
  )
}
