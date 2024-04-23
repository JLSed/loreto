/* eslint-disable @next/next/no-img-element */
'use client'

import { BoxPlacement, BoxThickness } from '@/common/enums/enums.db'
import FormItem from '@/components/shared/forms/FormItem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Box, BoxMarking, ImageMarking, User } from '@prisma/client'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { placeOrder } from '../actions'

type Props = {
  user: User
  box: Box & {
    markings: BoxMarking[]
    imageMarkings: ImageMarking[]
  }
}

export default function AddToCartComponent(props: Props) {
  const router = useRouter()

  const [contactNumber, setContactNumber] = useState(
    props.user.contactNumber ?? '+63'
  )
  const [quantity, setquantity] = useState(1)
  const [placingOrder, setPlacingOrder] = useState(false)

  const computePercentage = (totalWith: number, percentInBase10: number) => {
    return Math.round(totalWith * (percentInBase10 / 100))
  }

  const handlePlaceOrder = async () => {
    if (!contactNumber || contactNumber.length < 13) {
      toast.error('Please enter a valid contact number', {
        position: 'bottom-left',
      })
      return
    }

    setPlacingOrder(true)
    const res = await placeOrder({
      boxId: props.box.id,
      contactNumber,
      quantity,
    })
    if (res.status === 201) {
      toast.success('Order placed successfully', {
        position: 'bottom-left',
      })
      router.back()
      router.refresh()
    } else {
      toast.error(
        res.message ??
          'An error occurred while placing your order. Please try again.',
        {
          position: 'bottom-left',
        }
      )
    }
    setPlacingOrder(false)
  }

  return (
    <div className='p-4'>
      <nav className='flex items-center gap-2'>
        <Button
          size={'icon'}
          variant={'ghost'}
          onClick={() => router.back()}
        >
          <ArrowLeftIcon />
        </Button>
        <h4>Order this box</h4>
      </nav>

      <div className='mt-8'>
        <div
          aria-label='box details'
          className='my-8 grid grid-cols-2 gap-2'
        >
          <div className='grid grid-cols-[20ch_1fr] gap-2'>
            <div className='font-bold'>Box Details</div>
            <div></div>
            <div>Name:</div>
            <div>{props.box.name}</div>
            <div>Thickness:</div>
            <div>
              {props.box.thickness == BoxThickness.Single ? 'Single' : 'Double'}
            </div>
            <div>Placement:</div>
            <div>
              {props.box.placement == BoxPlacement.Inner ? 'Inner' : 'Master'}
            </div>
            <div>Quality:</div>
            <div>Class {props.box.quality}</div>
          </div>

          <div className='grid grid-cols-[20ch_1fr] gap-2'>
            <div className='font-bold'>Dimensions</div>
            <div></div>
            <div>Height:</div>
            <div>{props.box.height}</div>
            <div>Width:</div>
            <div>
              {computePercentage(props.box.totalWidth, props.box.leftPanelSize)}
            </div>
            <div>Length:</div>
            <div>
              {computePercentage(
                props.box.totalWidth,
                props.box.rightPanelSize
              )}
            </div>
          </div>

          <div className='mt-8'>
            <div className='font-bold pb-4'>Your Information</div>
            <div className='grid grid-cols-2 gap-8'>
              <FormItem title='First Name'>
                <Input
                  defaultValue={props.user.firstName}
                  readOnly
                />
              </FormItem>
              <FormItem title='Last Name'>
                <Input
                  defaultValue={props.user.lastName}
                  readOnly
                />
              </FormItem>
              <FormItem title='Email'>
                <Input
                  defaultValue={props.user.email}
                  readOnly
                />
              </FormItem>
              <FormItem title='Contact Number'>
                <Input
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                />
              </FormItem>
              <FormItem title='Quantity'>
                <Input
                  pattern='[0-9]*'
                  value={quantity}
                  onChange={(e) => setquantity(e.target.valueAsNumber)}
                  min={1}
                  type='number'
                />
              </FormItem>
            </div>
          </div>
        </div>

        <div className='border-b pb-8'>
          <Button
            loading={placingOrder}
            onClick={handlePlaceOrder}
          >
            Place Order
          </Button>
        </div>

        <div className='my-4 font-bold'>Preview</div>

        <div
          aria-label='box'
          style={{
            backgroundImage: 'url("/karton.avif")',
            width: props.box.totalWidth + 'px',
            height: props.box.height + 'px',
            display: 'grid',
            gridTemplateColumns: `${props.box.leftPanelSize}% 1fr ${props.box.rightPanelSize}%`,
          }}
          className='relative'
        >
          <div className='border-r'></div>
          <div></div>
          {props.box.markings.map((m, i) => {
            return (
              <div
                key={i}
                className='p-2 inline-block absolute text-black'
                style={{
                  transform: m.cssTransform.trim(),
                }}
              >
                {m.label} {m.value}
              </div>
            )
          })}

          {props.box.imageMarkings.map((m, i) => {
            return (
              <div
                key={i}
                className='cursor-move inline-block absolute z-10 text-black'
                style={{
                  transform: m.transform,
                  width: `${m.width}px`,
                  height: `${m.height}px`,
                }}
              >
                <img
                  className='grayscale'
                  src={m.src}
                  alt=''
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
