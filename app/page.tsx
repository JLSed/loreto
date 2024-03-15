'use client'

import useBoxControls from './useBoxControls'

import Panels from './Panels'
import { Separator } from '@/components/ui/separator'
import DimensionControls from './_controls/dimensions'
import Phase2Controls from './_controls/Phase2Controls'

export default function Home() {
  const controls = useBoxControls()

  return (
    <main className='grid grid-cols-[250px_1fr] pr-4 py-4'>
      <div aria-label='controls'>
        <DimensionControls controls={controls} />
        <div className='px-4'>
          <Separator />
        </div>
        <Phase2Controls controls={controls} />
      </div>

      <Panels controls={controls} />
    </main>
  )
}
