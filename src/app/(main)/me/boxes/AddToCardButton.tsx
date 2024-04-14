'use client'

import { Button } from '@/components/ui/button'
import MaterialIcon from '@/components/ui/material-icon'

export default function AddToCardButton() {
  return (
    <Button
      size={'icon'}
      variant={'secondary'}
      onClick={() => alert('Add to cart feature is coming soon.')}
    >
      <MaterialIcon name='add_shopping_cart' />
    </Button>
  )
}
