import { useEffect, useRef, useState } from 'react'

// Local storage keys
export enum LSKeys {
  CONTAINER_WIDTH = 'container__width',
  LEFT_PANEL_SIZE = 'left__panel__size',
  RIGHT_PANEL_SIZE = 'right__panel__size',
  BOX_HEIGHT = 'box__height',
  DRAG_TRANSFORM = 'drag__transform',
  BOX_MARKINGS = 'box-markings',
  IMAGE_MARKINGS = 'image-markings',
  BOX_QUALITY = 'box-quality',
  BOX_PLACEMENT = 'box-placement',
  BOX_THICKNESS = 'box-thickness',
}

export type LocalMarking = {
  id: number
  label: string
  value: string
  transform: string
}
export type LocalImageMarking = {
  id: number
  width: number
  height: number
  imageSrc: string
  transform: string
}

export default function useBoxControls() {
  // Inches
  const DEFAULT_WIDTH = 38
  const DEFAULT_HEIGHT = 24

  const [scaleFactor, setScaleFactor] = useState(20)
  useEffect(() => {
    setScaleFactor(window.innerWidth * 0.01)
  }, [])

  // actual pixel
  const [height, setHeight] = useState(0)
  const [pixelWidth, setPixelWidth] = useState(0)
  const [pixelLength, setPixelLength] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [hideControls, setHideControls] = useState(false)
  const [boxPlacement, setBoxPlacement] = useState(1)
  const [boxThickness, setBoxThickness] = useState(1)
  const [quality, setQuality] = useState('A')

  // used to update moveable borders
  const [dimKey, setDimKey] = useState(0)

  const [containerWidth, setContainerWidth] = useState(0)

  const [dragTransform, setDragTransform] = useState<string | undefined>(
    undefined
  )

  // percentage
  const [leftPanelSize, setLeftPanelSize] = useState(40)
  const [rightPanelSize, setRightPanelSize] = useState(60)

  // controls refs
  const widthRef = useRef<HTMLInputElement>(null)
  const lengthRef = useRef<HTMLInputElement>(null)
  const heightRef = useRef<HTMLInputElement>(null)
  const boxNameRef = useRef<HTMLInputElement>(null)

  const [markings, setMarkings] = useState<LocalMarking[]>([])
  const [imageMarkings, setImageMarkings] = useState<LocalImageMarking[]>([])

  const [quotationOpen, setQuotationOpen] = useState(false)

  useEffect(() => {
    if (height !== 0) localStorage.setItem(LSKeys.BOX_HEIGHT, height.toString())
  }, [height])

  useEffect(() => {
    setPixelWidth(Math.round(containerWidth * (leftPanelSize / 100)))
    setPixelLength(Math.round(containerWidth * (rightPanelSize / 100)))
  }, [containerWidth, leftPanelSize, rightPanelSize])

  useEffect(() => {
    const l = localStorage.getItem(LSKeys.LEFT_PANEL_SIZE)
    const r = localStorage.getItem(LSKeys.RIGHT_PANEL_SIZE)

    if (l && r) {
      setLeftPanelSize(+l)
      setRightPanelSize(+r)
    }

    const h = localStorage.getItem(LSKeys.BOX_HEIGHT)
    if (h) {
      setHeight(+h)
      setDimKey(+h)
    } else {
      setHeight(DEFAULT_HEIGHT)
      setDimKey(DEFAULT_HEIGHT)
    }

    const dt = localStorage.getItem(LSKeys.DRAG_TRANSFORM)
    if (dt) {
      setDragTransform(dt)
    } else {
      setDragTransform('translate(0px, 100px)')
    }

    const containerWidth = localStorage.getItem(LSKeys.CONTAINER_WIDTH)
    if (containerWidth) {
      setContainerWidth(+containerWidth)
      setDimKey(+containerWidth)
    } else {
      setContainerWidth(DEFAULT_WIDTH)
      setDimKey(DEFAULT_WIDTH)
    }

    const markings = localStorage.getItem(LSKeys.BOX_MARKINGS)
    if (markings) {
      setMarkings(JSON.parse(markings))
    } else {
      const newMarkings = [
        {
          label: 'Serial No:',
          value: '123456',
          transform: 'translate(36px, 220px)',
          id: 1,
        },
      ]
      setMarkings(newMarkings)
      localStorage.setItem(LSKeys.BOX_MARKINGS, JSON.stringify(newMarkings))
    }

    const imageMarkings = localStorage.getItem(LSKeys.IMAGE_MARKINGS)
    if (imageMarkings) {
      setImageMarkings(JSON.parse(imageMarkings))
    } else {
      const newImageMarkings = [
        {
          id: 1,
          imageSrc: '/logo.png',
          transform: 'translate(80px, 133px)',
          width: 4,
          height: 4,
        },
      ]
      setImageMarkings(newImageMarkings)
      localStorage.setItem(
        LSKeys.IMAGE_MARKINGS,
        JSON.stringify(newImageMarkings)
      )
    }

    const quality = localStorage.getItem(LSKeys.BOX_QUALITY)
    if (quality) {
      setQuality(quality)
    } else {
      setQuality('A')
    }

    const boxPlacement = localStorage.getItem(LSKeys.BOX_PLACEMENT)
    if (boxPlacement) {
      setBoxPlacement(+boxPlacement)
    } else {
      setBoxPlacement(1)
    }

    const boxThickness = localStorage.getItem(LSKeys.BOX_THICKNESS)
    if (boxThickness) {
      setBoxThickness(+boxThickness)
    } else {
      setBoxThickness(1)
    }
  }, [])

  const addImageMarking = () => {
    const newMarkings = [
      ...imageMarkings,
      {
        id: imageMarkings.length + 1,
        imageSrc: '/logo.png',
        transform: 'translate(0px, 0px)',
        width: 4,
        height: 4,
      },
    ]
    localStorage.setItem(LSKeys.IMAGE_MARKINGS, JSON.stringify(newMarkings))
    setImageMarkings(newMarkings)
    console.log('newMarkings', newMarkings)
  }

  const addMarking = (marking: LocalMarking): boolean => {
    const newMarkings = [...markings, marking]
    localStorage.setItem(LSKeys.BOX_MARKINGS, JSON.stringify(newMarkings))
    setMarkings(newMarkings)
    return true
  }

  const updateMarkValue = (marking: LocalMarking): void => {
    const mark = markings.find((m) => m.id === marking.id)
    if (mark) {
      mark.value = marking.value
      localStorage.setItem(LSKeys.BOX_MARKINGS, JSON.stringify(markings))
      setMarkings([...markings])
    }
  }

  const updateMarkLabel = (marking: LocalMarking): void => {
    const mark = markings.find((m) => m.id === marking.id)
    if (mark) {
      mark.label = marking.label
      localStorage.setItem(LSKeys.BOX_MARKINGS, JSON.stringify(markings))
      setMarkings([...markings])
    }
  }

  const removeMarking = (marking: LocalMarking): void => {
    const newMarkings = markings.filter((m) => m.id !== marking.id)
    localStorage.setItem(LSKeys.BOX_MARKINGS, JSON.stringify(newMarkings))
    setMarkings(newMarkings)
  }

  const removeImageMarking = (marking: LocalImageMarking): void => {
    const newMarkings = imageMarkings.filter((m) => m.id !== marking.id)
    localStorage.setItem(LSKeys.IMAGE_MARKINGS, JSON.stringify(newMarkings))
    setImageMarkings(newMarkings)
  }

  const applyChanges = () => {
    const width = widthRef.current?.valueAsNumber ?? 0
    const length = lengthRef.current?.valueAsNumber ?? 0
    const height = heightRef.current?.valueAsNumber ?? 0

    const newContainerWidth = width + length
    const newLeftPanelSize = (width / newContainerWidth) * 100
    const newRightPanelSize = (length / newContainerWidth) * 100

    localStorage.setItem(LSKeys.CONTAINER_WIDTH, newContainerWidth.toString())
    localStorage.setItem(LSKeys.LEFT_PANEL_SIZE, newLeftPanelSize.toString())
    localStorage.setItem(LSKeys.RIGHT_PANEL_SIZE, newRightPanelSize.toString())

    setHeight(height)
    setContainerWidth(newContainerWidth)
    setLeftPanelSize(newLeftPanelSize)
    setRightPanelSize(newRightPanelSize)

    setDimKey(height + width + length)
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
    leftPanelSize,
    setLeftPanelSize,
    rightPanelSize,
    setRightPanelSize,
    widthRef,
    lengthRef,
    heightRef,
    applyChanges,
    markings,
    setMarkings,
    addMarking,
    updateMarkValue,
    updateMarkLabel,
    removeMarking,
    dimKey,
    setDimKey,
    dragTransform,
    setDragTransform,
    isSaving,
    setIsSaving,
    hideControls,
    setHideControls,
    boxNameRef,
    imageMarkings,
    setImageMarkings,
    boxPlacement,
    setBoxPlacement,
    boxThickness,
    setBoxThickness,
    addImageMarking,
    removeImageMarking,
    quality,
    setQuality,
    // converts inch unit to fit the screen
    SCALE_FACTOR: scaleFactor,
    //
    quotationOpen,
    setQuotationOpen,
  }
}
