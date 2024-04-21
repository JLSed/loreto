import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { ReloadIcon } from '@radix-ui/react-icons'
import { deleteVehicle } from './actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function DeleteVehicle(props: { id: string }) {
  const [deleting, setDeleting] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const confirmDelete = async () => {
    setDeleting(true)

    try {
      await deleteVehicle(props.id)
      router.refresh()
      setOpen(false)
    } catch (error) {
      console.warn('Error deleting vehicle', error)
      toast.error('Error deleting vehicle')
    } finally {
      setDeleting(false)
      setOpen(false)
    }
  }

  return (
    <AlertDialog
      open={open || deleting}
      onOpenChange={setOpen}
    >
      <AlertDialogTrigger asChild>
        <Button
          variant={'ghost'}
          className='text-red-500 w-full justify-start'
        >
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            vehicle and all of its data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={deleting}
            onClick={confirmDelete}
          >
            {deleting && <ReloadIcon className='animate-spin mr-2' />} Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
