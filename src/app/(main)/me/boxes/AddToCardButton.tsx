import { Button } from '@/components/ui/button'
import MaterialIcon from '@/components/ui/material-icon'
import Link from 'next/link'

export default function AddToCardButton(props: { boxId: string }) {
  return (
    <Link href={`/me/cart/add?box=${props.boxId}`}>
      <Button
        size={'icon'}
        variant={'secondary'}
      >
        <MaterialIcon name='add_shopping_cart' />
      </Button>
    </Link>
  )
}
