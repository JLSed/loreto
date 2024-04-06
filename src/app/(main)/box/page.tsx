'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import { ScrollArea } from '@/components/ui/scroll-area'

import useBoxControls from './useBoxControls'
import DimensionControls from './_controls/dimensions'
import Phase1Controls from './_controls/Phase1Controls'
import Phase2Controls from './_controls/Phase2Controls'
import Panels from './Panels'

export default function Home() {
  const controls = useBoxControls()

  return (
    <main className='grid grid-cols-[250px_1fr]'>
      <ScrollArea className='h-screen border-r'>
        <Accordion
          type='multiple'
          className='w-full'
          defaultValue={['dimensions', 'phase-1', 'phase-2']}
        >
          <AccordionItem value='dimensions'>
            <AccordionTrigger className='p-4 small text-muted-foreground'>
              Dimensions
            </AccordionTrigger>
            <AccordionContent>
              <DimensionControls controls={controls} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='phase-1'>
            <AccordionTrigger className='p-4 small text-muted-foreground'>
              Phase 1 Markings
            </AccordionTrigger>
            <AccordionContent>
              <Phase1Controls controls={controls} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='phase-2'>
            <AccordionTrigger className='p-4 small text-muted-foreground'>
              Phase 2 Markings
            </AccordionTrigger>
            <AccordionContent>
              <Phase2Controls controls={controls} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>

      <Panels controls={controls} />
    </main>
  )
}
