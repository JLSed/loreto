import { useEffect, useRef, useState } from 'react'
import { ImperativePanelHandle } from 'react-resizable-panels'

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

  // panel refs
  const wPanelRef = useRef<ImperativePanelHandle>(null)
  const lPanelRef = useRef<ImperativePanelHandle>(null)

  // Phase II controls
  const [logoSize, setLogoSize] = useState(100)
  const [boxName, setBoxName] = useState("Lola's Chizcakes")
  const [codeNumber, setCodeNumber] = useState('')
  const [ctnNumber, setCtnNumber] = useState('')
  const [ctnBase, setCtnBase] = useState(200)

  useEffect(() => {
    const w = document.getElementById('main-container')?.clientWidth ?? 0
    setContainerWidth(Math.round(w))
    setPixelWidth(Math.round(w * (widthPercentage / 100)))
    setPixelLength(Math.round(w * (lengthPercentage / 100)))
  }, [lengthPercentage, widthPercentage])

  const applyChanges = () => {
    const width = widthRef.current?.valueAsNumber ?? 0
    const length = lengthRef.current?.valueAsNumber ?? 0
    const height = heightRef.current?.valueAsNumber ?? 0

    setHeight(height)

    const wPercent = (width / containerWidth) * 100
    const lPercent = (length / containerWidth) * 100

    wPanelRef.current?.resize(wPercent)
    lPanelRef.current?.resize(lPercent)
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
    wPanelRef,
    lPanelRef,
    logoSize,
    setLogoSize,
    boxName,
    setBoxName,
    codeNumber,
    setCodeNumber,
    ctnNumber,
    setCtnNumber,
    ctnBase,
    setCtnBase,
  }
}
