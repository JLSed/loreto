'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

interface Service {
  title: string
  href: string
  graphic: string
  description: string
}

const services: Service[] = [
  {
    title: 'Apartments for Rent',
    href: '/apartments',
    graphic: 'https://www.svgrepo.com/show/475076/house.svg',
    description:
      'We have a variety of apartments available for rent, catering to needs and budgets.',
  },
  {
    title: 'Custom Box Packaging',
    href: '/box',
    graphic: 'https://www.svgrepo.com/show/268236/packaging-cardboard.svg',
    description:
      'We offer custom box packaging solutions to meet your specific requirements.',
  },
  {
    title: 'Vehicle Rentals',
    href: '/vehicles',
    graphic:
      'https://www.svgrepo.com/show/389573/vehicle-truck-farm-transportation.svg',
    description:
      'We provide a range of vehicles for rent, including trucks, vans, and more.',
  },
]

export default function ServicesCarousel() {
  return (
    <section className='space-y-8 mt-16'>
      <h2 className='text-center'>Our Services</h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
        {services.map((s) => (
          <div
            className='rounded-2xl flex flex-col gap-6 items-center text-center p-8 shadow-xl border'
            key={s.title}
          >
            <Image
              alt=''
              src={s.graphic}
              width={100}
              height={100}
              className='mx-auto'
            />
            <h3>{s.title}</h3>
            <p className='text-sm text-muted-foreground'>{s.description}</p>
            <Link href={s.href}>
              <Button>See Details</Button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
