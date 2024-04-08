import { Button } from '@/components/ui/button'
import useBoxControls from '../useBoxControls'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { PlusIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Props {
  controls: ReturnType<typeof useBoxControls>
}

export default function AddMarking(props: Props) {
  const [label, setLabel] = useState('')
  const [value, setValue] = useState('')
  const [phase, setPhase] = useState(1)
  const [open, setOpen] = useState(false)

  const addMarking = () => {
    if (label.trim() === '') return alert('Please enter a label')

    const added = props.controls.addMarking({
      label,
      value,
      phase,
      transform: 'translate(0, 0)',
      id: props.controls.markings.length + 1,
    })
    if (added) setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => setOpen(o)}
    >
      <DialogTrigger asChild>
        <Button
          className='mt-2'
          variant='secondary'
          size={'sm'}
        >
          <PlusIcon className='w-4 h-4 mr-1' />
          New Marking
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>New Marking</DialogTitle>
          <DialogDescription>Add a new marking to the box.</DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label
              htmlFor='label'
              className='text-right'
            >
              Label
            </Label>
            <Input
              id='label'
              className='col-span-3'
              placeholder='Enter the label name'
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label
              htmlFor='value'
              className='text-right'
            >
              Initial Value
            </Label>
            <Input
              id='value'
              className='col-span-3'
              placeholder='Enter the initial value'
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label
              htmlFor='phase'
              className='text-right'
            >
              Phase
            </Label>
            <Tabs
              defaultValue={'1'}
              id='edit__marking__phase'
              className='col-span-3'
            >
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='1'>Phase 1</TabsTrigger>
                <TabsTrigger value='2'>Phase 2</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={addMarking}
            type='submit'
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
