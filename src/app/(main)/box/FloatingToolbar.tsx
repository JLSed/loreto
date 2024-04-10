'use client'

import { useTheme } from 'next-themes'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { DownloadIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import * as htmlToImage from 'html-to-image'
import useBoxControls from './useBoxControls'

interface Props {
  controls: ReturnType<typeof useBoxControls>
}

export default function FloatingToolbar(props: Props) {
  const { setTheme, resolvedTheme, theme } = useTheme()

  const downloadAsImage = () => {
    const node = document
      .getElementById('main-container')
      ?.getElementsByTagName('div')[0]
    if (!node) return

    props.controls.setIsSaving(true)
    htmlToImage
      .toPng(node, { quality: 1, skipAutoScale: true })
      .then(function (dataUrl) {
        var link = document.createElement('a')
        link.download = 'loreto-box' + new Date().toISOString() + '.png'
        link.href = dataUrl
        link.click()
        props.controls.setIsSaving(false)
      })
      .catch(function (error) {
        console.error(error)
        alert('Oops, something went wrong! Please try again.')
        props.controls.setIsSaving(false)
      })
  }

  return (
    <div className='absolute top-0 right-0 m-3 flex items-center gap-2'>
      <Button
        onClick={downloadAsImage}
        variant='secondary'
        size={'icon'}
      >
        <DownloadIcon />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='secondary'
            size={'icon'}
          >
            {resolvedTheme === 'dark' ? <MoonIcon /> : <SunIcon />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='mx-4 backdrop-blur'>
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={theme === 'light'}
            onCheckedChange={(checked) => checked && setTheme('light')}
          >
            Light
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={theme === 'dark'}
            onCheckedChange={(checked) => checked && setTheme('dark')}
          >
            Dark
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={theme === 'system'}
            onCheckedChange={(checked) => checked && setTheme('system')}
          >
            System
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
