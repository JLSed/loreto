import { useEffect, useRef, useState } from 'react'
import { ImperativePanelHandle } from 'react-resizable-panels'

export type LocalMarking = {
  label: string
  value: string
  phase: number
  transform: string
}

export default function useBoxControls() {
  // actual pixel
  const [height, setHeight] = useState(600)
  const [pixelWidth, setPixelWidth] = useState(0)
  const [pixelLength, setPixelLength] = useState(0)

  const [containerWidth, setContainerWidth] = useState(0)

  // percentage
  const [widthPercentage, setWidthPercentage] = useState(35)
  const [lengthPercentage, setLengthPercentage] = useState(45)

  // controls refs
  const widthRef = useRef<HTMLInputElement>(null)
  const lengthRef = useRef<HTMLInputElement>(null)
  const heightRef = useRef<HTMLInputElement>(null)

  // panel refs
  const wPanelRef = useRef<ImperativePanelHandle>(null)
  const lPanelRef = useRef<ImperativePanelHandle>(null)

  // markgins
  const [markings, setMarkings] = useState<LocalMarking[]>([])

  useEffect(() => {
    const markings = localStorage.getItem('box-markings')
    if (markings) {
      setMarkings(JSON.parse(markings))
      return
    }
    const newMarkings = [
      {
        label: 'Serial No:',
        value: '123456',
        phase: 1,
        transform: 'translate(0, 0)',
      },
    ]
    setMarkings(newMarkings)
    localStorage.setItem('box-markings', JSON.stringify(newMarkings))
  }, [])

  useEffect(() => {
    const w = document.getElementById('main-container')?.clientWidth ?? 0
    setContainerWidth(Math.round(w))
    setPixelWidth(Math.round(w * (widthPercentage / 100)))
    setPixelLength(Math.round(w * (lengthPercentage / 100)))
  }, [lengthPercentage, widthPercentage])

  const addMarking = (marking: LocalMarking): boolean => {
    const labelExistInPhase = markings.some(
      (m) => m.label === marking.label && m.phase === marking.phase
    )

    if (labelExistInPhase) {
      alert(`${marking.label} is already added in phase ${marking.phase}.`)
      return false
    }
    const newMarkings = [...markings, marking]
    localStorage.setItem('box-markings', JSON.stringify(newMarkings))
    setMarkings(newMarkings)
    return true
  }

  const updateMarkValue = (marking: LocalMarking): void => {
    const mark = markings.find((m) => m.label === marking.label)
    if (mark) {
      mark.value = marking.value
      localStorage.setItem('box-markings', JSON.stringify(markings))
      setMarkings([...markings])
    }
  }

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
    markings,
    setMarkings,
    addMarking,
    updateMarkValue,
  }
}
