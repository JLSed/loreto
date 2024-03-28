/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from 'react'
import { Button } from '../ui/button'
import { UploadIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'

export default function ImageUpload(props: {
  initialImageSrc?: string
  onImageChange: (params: { imageSrc?: string; file?: File }) => void
  inputName: string
  hidden?: boolean
  disabled?: boolean
}) {
  const [imageSrc, setImageSrc] = useState(props.initialImageSrc)
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className='relative overflow-hidden rounded-lg bg-white border'>
      <input
        disabled={props.disabled}
        hidden
        ref={fileInputRef}
        type='file'
        name={props.inputName}
        id={props.inputName}
        accept='image/*'
        multiple={false}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
              const imageSrc = e.target?.result as string
              props.onImageChange({ file, imageSrc })
              setImageSrc(imageSrc)
            }
            reader.readAsDataURL(file)
          }
        }}
      />

      {imageSrc ? (
        <img
          src={props.hidden ? props.initialImageSrc : imageSrc}
          alt='Upload Image'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
      ) : (
        <div className='bg-neutral-200 w-full aspect-video grid place-items-center small'>
          Image Preview
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
            disabled={props.disabled}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon className='mr-2' />
            Upload
          </Button>
          <Button
            size={'sm'}
            type='button'
            variant={'ghost'}
            disabled={props.initialImageSrc === imageSrc || props.disabled}
            onClick={() => setImageSrc(props.initialImageSrc)}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}
