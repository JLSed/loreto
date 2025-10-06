'use client'
import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MeterSection } from './MeterSection'
import { pesos } from '@/lib/utils'
import { toast } from 'sonner'
import { createUtilityTransaction } from '../tenants-action'

export default function RentDueDatesTable({
  monthlyPayment,
  tenantId,
}: {
  monthlyPayment: number
  tenantId: number
}) {
  const [meralcoDate, setMeralcoDate] = useState<Date | undefined>(undefined)
  const [meralcoPrev, setMeralcoPrev] = useState<number | undefined>(undefined)
  const [meralcoCurr, setMeralcoCurr] = useState<number | undefined>(undefined)
  const meralcoTotal =
    meralcoPrev !== undefined && meralcoCurr !== undefined
      ? meralcoCurr - meralcoPrev
      : ''

  const [mayniladDate, setMayniladDate] = useState<Date | undefined>(undefined)
  const [mayniladPrev, setMayniladPrev] = useState<number | undefined>(
    undefined
  )
  const [mayniladCurr, setMayniladCurr] = useState<number | undefined>(
    undefined
  )
  const mayniladTotal =
    mayniladPrev !== undefined && mayniladCurr !== undefined
      ? mayniladCurr - mayniladPrev
      : ''

  // Fixed values
  const meralcoMultiplier = 23
  const mayniladMutiplier = 80

  const meralcoAmount = useMemo(() => {
    if (typeof meralcoTotal === 'number')
      return +(meralcoTotal * meralcoMultiplier).toFixed(2)
    return ''
  }, [meralcoTotal, meralcoMultiplier])

  const mayniladAmount = useMemo(() => {
    if (typeof mayniladTotal === 'number')
      return +(mayniladTotal * mayniladMutiplier).toFixed(2)
    return ''
  }, [mayniladTotal, mayniladMutiplier])

  const totalAmount = useMemo(() => {
    return (
      +(monthlyPayment || 0) +
      (typeof meralcoAmount === 'number' ? meralcoAmount : 0) +
      (typeof mayniladAmount === 'number' ? mayniladAmount : 0)
    )
  }, [monthlyPayment, meralcoAmount, mayniladAmount])

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (totalAmount > 0) {
        const res = await createUtilityTransaction({
          fromTenantId: tenantId,
          modeOfPayment: 1,
          type: 1, // full payment
          itemType: 3, // apartment/utilities
          amount: totalAmount,
        })

        if (res.status !== 201) {
          throw new Error('Failed to create transaction')
        }
      }

      toast.success('Transaction created successfully')

      // Reset form
      setMeralcoDate(undefined)
      setMeralcoPrev(undefined)
      setMeralcoCurr(undefined)
      setMayniladDate(undefined)
      setMayniladPrev(undefined)
      setMayniladCurr(undefined)
    } catch (error) {
      console.error(error)
      toast.error('Failed to create transaction')
    }
  }

  return (
    <Card className='p-6'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-lg font-semibold'>Rent and Utilities</h3>
      </div>
      <form
        onSubmit={handleSubmit}
        className='flex'
      >
        <div className='px-4'>
          <MeterSection
            label='Meralco'
            date={meralcoDate}
            setDate={setMeralcoDate}
            prev={meralcoPrev}
            setPrev={setMeralcoPrev}
            curr={meralcoCurr}
            setCurr={setMeralcoCurr}
            total={(meralcoTotal as number) || 0}
            fixed={meralcoMultiplier}
            amountToPay={meralcoAmount}
          />

          <MeterSection
            label='Maynilad'
            date={mayniladDate}
            setDate={setMayniladDate}
            prev={mayniladPrev}
            setPrev={setMayniladPrev}
            curr={mayniladCurr}
            setCurr={setMayniladCurr}
            total={(mayniladTotal as number) || 0}
            fixed={mayniladMutiplier}
            amountToPay={mayniladAmount}
          />
        </div>
        <div className='border-l flex flex-col gap-2'>
          <div className='border-b pb-4 px-4'>
            <span className='font-medium'>Rent Fee: </span>
            <span>{pesos(monthlyPayment)}</span>
          </div>
          <div className='px-4'>
            <span className='font-medium'>Meralco: </span>
            <span>{pesos(meralcoAmount as number)}</span>
          </div>
          <div className='mb-6 px-4'>
            <span className='font-medium'>Maynilad: </span>
            <span>{pesos(mayniladAmount as number)}</span>
          </div>
          <div className='mb-6 px-4'>
            <span className='font-medium'>Total Payment: </span>
            <span>{pesos(totalAmount as number)}</span>
          </div>
          <div className='flex justify-end px-4'>
            <Button type='submit'>Submit Transaction</Button>
          </div>
        </div>
      </form>
    </Card>
  )
}
