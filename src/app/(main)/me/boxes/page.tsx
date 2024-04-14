import { Button } from '@/components/ui/button'
import CustomerBoxes from './CustomerBoxes'
import { getCustomerBoxes } from './actions'
import Link from 'next/link'

export type TCustomerBoxes = Awaited<ReturnType<typeof getCustomerBoxes>>

export default async function Page() {
  const boxes = await getCustomerBoxes()

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
      <header className='p-4 pb-0'>
        <h3>Boxes</h3>
      </header>
      <CustomerBoxes boxes={boxes} />
    </div>
  )
}
