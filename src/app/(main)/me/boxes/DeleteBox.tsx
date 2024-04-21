'use client'

import { Button } from '@/components/ui/button'
import MaterialIcon from '@/components/ui/material-icon'
import { ReloadIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import { deleteBox } from './actions'
import { useRouter } from 'next/navigation'

export default function DeleteBox(props: { boxId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleClick() {
    setLoading(true)

    try {
      await deleteBox(props.boxId)
      router.refresh()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      disabled={loading}
      size={'icon'}
      variant={'secondary'}
      title='Delete this box'
      onClick={handleClick}
    >
      {loading ? (
        <ReloadIcon className='animate-spin' />
      ) : (
        <MaterialIcon name='delete' />
      )}
    </Button>
  )
}
