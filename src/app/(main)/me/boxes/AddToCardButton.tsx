import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AddToCardButton(props: { boxId: string }) {
  return (
    <Link href={`/me/cart/add?box=${props.boxId}`}>
      <Button variant={'secondary'}>Order Now</Button>
    </Link>
  )
}
