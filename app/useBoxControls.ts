import { useEffect, useRef, useState } from 'react'

export default function useBoxControls() {
  // actual pixel
  const [height, setHeight] = useState(400)
  const [pixelWidth, setPixelWidth] = useState(0)
  const [pixelLength, setPixelLength] = useState(0)

  const [containerWidth, setContainerWidth] = useState(0)

  // percentage
  const [widthPercentage, setWidthPercentage] = useState(25)
  const [lengthPercentage, setLengthPercentage] = useState(35)

  // controls refs
  const widthRef = useRef<HTMLInputElement>(null)
  const lengthRef = useRef<HTMLInputElement>(null)
  const heightRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTimeout(() => {
      const w = document.getElementById('main-container')?.clientWidth ?? 0
      setContainerWidth(Math.round(w))
      setPixelWidth(Math.round(w * (widthPercentage / 100)))
      setPixelLength(Math.round(w * (lengthPercentage / 100)))
    }, 100)
  }, [lengthPercentage, widthPercentage])

  const applyChanges = () => {
    const width = parseInt(widthRef.current?.value || '0')
    const length = parseInt(lengthRef.current?.value || '0')
    const height = parseInt(heightRef.current?.value || '0')

    setPixelWidth(width)
    setPixelLength(length)
    setHeight(height)

    setWidthPercentage((width / containerWidth) * 100)
    setLengthPercentage((length / containerWidth) * 100)
  }

  return {
    height,
    setHeight,
    pixelWidth,
    setPixelWidth,
    pixelLength,
    setPixelLength,
    containerWidth,
    setContainerWidth,
    widthPercentage,
    setWidthPercentage,
    lengthPercentage,
    setLengthPercentage,
    widthRef,
    lengthRef,
    heightRef,
    applyChanges,
  }
}
