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
import MarkingsSidebar from './_controls/MarkingsSidebar'
import Panels from './Panels'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { signIn, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import FloatingToolbar from './FloatingToolbar'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'

export default function BoxPage() {
  const controls = useBoxControls()
  const session = useSession()

  return (
    <main className='grid grid-cols-[250px_1fr] relative'>
      <ScrollArea className='h-screen border-r relative'>
        {session.data?.user && (
          <div className='p-4 grid gap-2 border-b'>
            <Label>Box Name</Label>
            <Input
              ref={controls.boxNameRef}
              placeholder='Give it a name!'
            />
          </div>
        )}

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
              Markings
            </AccordionTrigger>
            <AccordionContent>
              <MarkingsSidebar controls={controls} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className='p-4 grid gap-2 border-b'>
          <Label>Thickness</Label>
          <Tabs
            defaultValue={controls.boxThickness.toString()}
            onValueChange={(v) => controls.setBoxThickness(+v)}
          >
            <TabsList className='w-full'>
              <TabsTrigger
                value='1'
                className='w-full'
              >
                Single
              </TabsTrigger>
              <TabsTrigger
                value='2'
                className='w-full'
              >
                Double
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className='p-4 grid gap-2'>
          <Label>Placement</Label>
          <Tabs
            defaultValue={controls.boxPlacement.toString()}
            onValueChange={(v) => controls.setBoxPlacement(+v)}
          >
            <TabsList className='w-full'>
              <TabsTrigger
                value='1'
                className='w-full'
              >
                Master
              </TabsTrigger>
              <TabsTrigger
                value='2'
                className='w-full'
              >
                Inner
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {!session.data?.user && (
          <div className='p-4 bg-inherit'>
            <Button
              onClick={() => [
                signIn('google', {
                  callbackUrl: '/box',
                  redirect: true,
                }),
              ]}
              className='w-full'
              variant={'secondary'}
            >
              Sign in
            </Button>
          </div>
        )}

        {session.data?.user && (
          <div className='flex justify-between items-center p-4 pr-3 py-2 bg-inherit border-t'>
            <div className='capitalize small'> {session.data.user.name} </div>
            <Avatar className='scale-75'>
              <AvatarImage
                src={session.data.user.image}
                alt={session.data.user.name}
              />
              <AvatarFallback className='capitalize'>
                {session.data.user.name[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </ScrollArea>

      <Panels controls={controls} />

      <FloatingToolbar controls={controls} />
    </main>
  )
}
