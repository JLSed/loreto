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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import { DownloadIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import * as htmlToImage from 'html-to-image'
import useBoxControls, { LSKeys } from './useBoxControls'
import { signIn, useSession } from 'next-auth/react'
import { useState } from 'react'
import { toast } from 'sonner'
import { saveBoxAction } from './actions'

interface Props {
  controls: ReturnType<typeof useBoxControls>
}

export default function FloatingToolbar(props: Props) {
  const session = useSession()
  const { setTheme, resolvedTheme, theme } = useTheme()
  const [isSigninDialogOpen, setIsSigninDialogOpen] = useState(false)

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

  const saveDocument = async () => {
    if (!session.data?.user) {
      props.controls.setHideControls(true)
      setIsSigninDialogOpen(true)
      return
    }

    if (!props.controls.boxNameRef.current?.value.trim()) {
      props.controls.boxNameRef.current?.focus()
      toast('Please give your box a name.', {
        position: 'top-right',
        duration: 1200,
      })
      return
    }

    props.controls.setIsSaving(true)
    const res = await saveBoxAction({
      name: props.controls.boxNameRef.current.value,
      dragTransform: localStorage.getItem(LSKeys.DRAG_TRANSFORM)!,
      height: props.controls.height,
      totalWidth: props.controls.containerWidth,
      imageMarkings: props.controls.imageMarkings,
      leftPanelSize: props.controls.leftPanelSize,
      rightPanelSize: props.controls.rightPanelSize,
      markings: props.controls.markings,
      placement: props.controls.boxPlacement,
      thickness: props.controls.boxThickness,
    })
    if (res.status === 200) {
      toast.success('Box saved successfully!', { position: 'top-right' })
    } else {
      toast('Oops, something went wrong! Please try again.')
    }
    props.controls.setIsSaving(false)
  }

  return (
    <div className='absolute top-0 right-0 m-3 flex items-center gap-2'>
      <Button
        loading={props.controls.isSaving}
        variant='secondary'
        onClick={saveDocument}
      >
        Save
      </Button>

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

      <AlertDialog
        open={isSigninDialogOpen}
        onOpenChange={(open) => {
          props.controls.setHideControls(open)
          setIsSigninDialogOpen(open)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='pb-0'>
              Save this box for future use
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please sign in to save and access your boxes from anywhere.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='mt-2'>
            <AlertDialogAction
              onClick={() => {
                signIn('google', { callbackUrl: '/box' })
              }}
            >
              Sign in
            </AlertDialogAction>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
