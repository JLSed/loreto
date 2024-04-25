import { Button } from '@/components/ui/button'
import CustomerBoxes from './CustomerBoxes'
import { getCustomerBoxes } from './actions'
import Link from 'next/link'

export type TCustomerBoxes = Awaited<ReturnType<typeof getCustomerBoxes>>

interface Props {
  searchParams: {
    boxId?: string
  }
}

export default async function Page(props: Props) {
  const boxes = await getCustomerBoxes(props.searchParams.boxId)

  if (boxes.length === 0) {
    return (
      <div>
        <header className='p-4 space-y-4'>
          <h3>No boxes yet.</h3>
          <Link
            href='/box'
            className='inline-block'
          >
            <Button>Create now!</Button>
          </Link>
        </header>
      </div>
    )
  }

  return (
    <div>
      <header className='p-4 pb-0 flex items-center justify-between'>
        <h3>Boxes</h3>
        <Link
          href='/box'
          className='inline-block'
        >
          <Button variant={'secondary'}>Create another</Button>
        </Link>
      </header>
      <CustomerBoxes boxes={boxes} />
    </div>
  )
}
