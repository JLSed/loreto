import { DashboardOrders } from './page'
import Image from 'next/image'

interface Props {
  box: DashboardOrders[number]['box']
}

// Helper function to extract translate values from CSS transform string
function parseTransform(transform: string): { x: number; y: number } {
  const match = transform.match(/translate\((-?[\d.]+)px,\s*(-?[\d.]+)px\)/)
  if (match) {
    return { x: parseFloat(match[1]), y: parseFloat(match[2]) }
  }
  return { x: 0, y: 0 }
}

// Helper function to scale transform from original scale factor to new scale factor
function scaleTransform(
  transform: string,
  originalScaleFactor: number,
  newScaleFactor: number
): string {
  const { x, y } = parseTransform(transform)
  const scaledX = (x / originalScaleFactor) * newScaleFactor
  const scaledY = (y / originalScaleFactor) * newScaleFactor
  return `translate(${scaledX}px, ${scaledY}px)`
}

export default function BoxView({ box }: Props) {
  // Use the stored scaleFactor from the box, fallback to default
  const originalScaleFactor = box.scaleFactor || 19.2
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
          const scaledTransform = scaleTransform(
            m.transform,
            originalScaleFactor,
            scaleFactor
          )
          return (
            <Image
              className='absolute grayscale'
              key={m.id}
              style={{ transform: scaledTransform }}
              src={m.src}
              alt={m.src}
              width={m.width * scaleFactor}
              height={m.height * scaleFactor}
            />
          )
        })}

        {box.markings.map((m) => {
          const scaledTransform = scaleTransform(
            m.cssTransform,
            originalScaleFactor,
            scaleFactor
          )
          return (
            <div
              className='absolute'
              key={m.id}
              style={{
                transform: scaledTransform,
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
