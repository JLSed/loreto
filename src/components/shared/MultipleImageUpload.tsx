/* eslint-disable @next/next/no-img-element */
import { cn } from '@/lib/utils'
import { useRef, useState } from 'react'
import { Button } from '../ui/button'
import { TrashIcon, UploadIcon } from '@radix-ui/react-icons'

interface Props {
  initialImageSources?: string[]
  inputName: string
  hidden?: boolean
  disabled?: boolean
  hideReset?: boolean
  onImagesChange?: (images: string[]) => void
}

export default function MultipleImageUpload(props: Props) {
  const [images, setImages] = useState(props.initialImageSources ?? [])
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className='relative overflow-hidden rounded-lg bg-white dark:bg-neutral-950 border'>
      <input
        disabled={props.disabled}
        hidden
        ref={fileInputRef}
        type='file'
        name={props.inputName}
        id={props.inputName}
        accept='image/*'
        multiple={true}
        onChange={(e) => {
          const files = e.target.files
          if (!files) return

          const urls = Array.from(files).map((file) =>
            URL.createObjectURL(file)
          )
          const newImages = [...images, ...urls]
          setImages(newImages)
          props.onImagesChange?.(newImages)
        }}
      />

      {images.length ? (
        <div className='p-5 space-y-2'>
          {images.map((image, index) => {
            return (
              <div
                key={index}
                className='flex items-center justify-between rounded-md border p-3'
              >
                <img
                  alt=''
                  src={image}
                  className='h-[4rem] rounded'
                />
                <Button
                  size={'icon'}
                  type='button'
                  variant={'ghost'}
                  disabled={props.disabled}
                  onClick={() => {
                    const filteredImages = images.filter((_, i) => i !== index)
                    setImages(filteredImages)
                    props.onImagesChange?.(filteredImages)
                  }}
                >
                  <TrashIcon className='w-4 h-4' />
                </Button>
              </div>
            )
          })}
        </div>
      ) : (
        <div className='bg-neutral-100 dark:bg-neutral-950 w-full aspect-video grid place-items-center small'>
          No images selected
        </div>
      )}

      <div
        aria-label='overlay'
        className={cn('p-5', { hidden: props.hidden })}
      >
        <div className='flex items-center gap-2'>
          <Button
            size={'sm'}
            type='button'
            variant={'outline'}
            className='w-full'
            disabled={props.disabled}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon className='mr-2' />
            Upload
          </Button>
          {!props.hideReset && (
            <Button
              size={'sm'}
              type='button'
              variant={'ghost'}
              className='w-full'
              disabled={props.disabled}
              onClick={() => setImages(props.initialImageSources ?? [])}
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
