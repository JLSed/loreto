'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import { ScrollArea } from '@/components/ui/scroll-area'

import useBoxControls, { LSKeys } from './useBoxControls'
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
import { cn } from '@/lib/utils'

export default function BoxPage() {
  const controls = useBoxControls()
  const session = useSession()

  return (
    <main
      className={cn(
        'grid grid-cols-1 lg:grid-cols-[280px_1fr] min-h-screen bg-gradient-to-br from-gray-50 to-blue-50',
        {
          blur: controls.quotationOpen,
        }
      )}
    >
      <ScrollArea className='h-auto lg:h-screen border-r border-gray-200 bg-white/80 backdrop-blur-sm relative'>
        {session.data?.user && (
          <div className='p-4 grid gap-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50'>
            <Label className='text-sm font-semibold text-gray-700'>
              Box Name
            </Label>
            <Input
              ref={controls.boxNameRef}
              placeholder='Give it a name!'
              className='border-2 border-gray-200 focus:border-blue-400 transition-colors duration-200'
            />
          </div>
        )}

        <Accordion
          type='multiple'
          className='w-full'
          defaultValue={['dimensions', 'phase-1', 'phase-2']}
        >
          <AccordionItem
            value='dimensions'
            className='border-b border-gray-100'
          >
            <AccordionTrigger className='p-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200'>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                <span>
                  Dimensions{' '}
                  <code className='bg-blue-100 text-blue-700 px-1 rounded text-xs'>
                    inch
                  </code>
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className='bg-gradient-to-b from-blue-50/50 to-white'>
              <DimensionControls controls={controls} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value='phase-1'
            className='border-b border-gray-100'
          >
            <AccordionTrigger className='p-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200'>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                <span>Remarks</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className='bg-gradient-to-b from-green-50/50 to-white'>
              <MarkingsSidebar controls={controls} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className='p-4 grid gap-3 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-red-50'>
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
            <Label className='text-sm font-semibold text-gray-700'>
              Thickness
            </Label>
          </div>
          <Tabs
            value={controls.boxThickness.toString()}
            onValueChange={(v) => {
              controls.setBoxThickness(+v)
              localStorage.setItem(LSKeys.BOX_THICKNESS, v)
            }}
          >
            <TabsList className='w-full bg-white border-2 border-gray-200'>
              <TabsTrigger
                value='1'
                className='w-full data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 transition-all duration-200'
              >
                Single
              </TabsTrigger>
              <TabsTrigger
                value='2'
                className='w-full data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 transition-all duration-200'
              >
                Double
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* <div className='p-4 grid gap-2'>
          <Label>Quality</Label>
          <Tabs
            value={controls.quality}
            onValueChange={(v) => {
              controls.setQuality(v)
              localStorage.setItem(LSKeys.BOX_QUALITY, v)
            }}
          >
            <TabsList className='w-full'>
              <TabsTrigger
                value='A'
                className='w-full'
              >
                Class A
              </TabsTrigger>
              <TabsTrigger
                value='B'
                className='w-full'
              >
                Class B
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className='grid grid-cols-2 text-center'>
            <div className='text-xs'>2 sides only</div>
            <div className='text-xs'>4 sides</div>
          </div>
        </div> */}

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
