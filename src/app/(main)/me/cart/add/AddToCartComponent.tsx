/* eslint-disable @next/next/no-img-element */
'use client'

import { BoxPlacement, BoxThickness } from '@/common/enums/enums.db'
import FormItem from '@/components/shared/forms/FormItem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Box, BoxMarking, ImageMarking, User } from '@prisma/client'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { placeOrder } from '../actions'
import { computePrice, pesos } from '@/lib/utils'

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
    props.user.contactNumber ?? ''
  )
  const [quantity, setquantity] = useState(1)
  const [placingOrder, setPlacingOrder] = useState(false)

  const computePercentage = (totalWith: number, percentInBase10: number) => {
    return Math.round(totalWith * (percentInBase10 / 100))
  }

  const handlePlaceOrder = async () => {
    // Validate contact number - must be exactly 11 digits
    if (!contactNumber || !/^[0-9]{11}$/.test(contactNumber)) {
      toast.error('Contact number must be exactly 11 digits', {
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
      router.push('/me/orders')
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
                  maxLength={11}
                  pattern='[0-9]{11}'
                  inputMode='numeric'
                  placeholder='09XXXXXXXXX'
                  title='Contact number must be exactly 11 digits'
                />
              </FormItem>
              <FormItem title='Quantity'>
                <Input
                  pattern='[0-9]*'
                  value={quantity.toString()}
                  onChange={(e) => setquantity(e.target.valueAsNumber)}
                  min={1}
                  type='number'
                />
              </FormItem>
            </div>
          </div>
        </div>

        <div className='mb-4'>
          Total Price:{' '}
          {pesos(
            computePrice({
              width: computePercentage(
                props.box.totalWidth,
                props.box.leftPanelSize
              ),
              length: computePercentage(
                props.box.totalWidth,
                props.box.rightPanelSize
              ),
              height: props.box.height,
              thickness: props.box.thickness === 1 ? 'single' : 'double',
            }).totalPrice * quantity
          )}
        </div>

        <div className='border-b pb-8'>
          <Button
            loading={placingOrder}
            onClick={handlePlaceOrder}
          >
            Place Order
          </Button>
        </div>
      </div>
    </div>
  )
}
