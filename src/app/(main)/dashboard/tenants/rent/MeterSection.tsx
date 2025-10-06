'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DatePicker } from '@/components/shared/DatePicker'
import { pesos } from '@/lib/utils'

interface MeterSectionProps {
  label: string
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  prev: number | undefined
  setPrev: (val: number | undefined) => void
  curr: number | undefined
  setCurr: (val: number | undefined) => void
  total: number
  fixed: number
  amountToPay: number | string
}

export function MeterSection({
  label,
  date,
  setDate,
  prev,
  setPrev,
  curr,
  setCurr,
  total,
  fixed,
  amountToPay,
}: MeterSectionProps) {
  return (
    <div>
      <div className='mb-2'>
        <h4>{label}</h4>
      </div>
      <div className='grid grid-cols-[1fr,auto,1fr,auto,1fr,auto,1fr] gap-4 mb-2'>
        <div>
          <Label>Previous Meter</Label>
          <div className='flex flex-col gap-1'>
            <Input
              type='number'
              value={prev ?? ''}
              onChange={(e) =>
                setPrev(e.target.value ? +e.target.value : undefined)
              }
              required
            />
            <DatePicker
              defaultDate={date}
              onSelect={setDate}
            />
          </div>
        </div>
        <div className='self-center'>-</div>
        <div>
          <Label>Current Meter</Label>
          <div className='flex flex-col gap-1'>
            <Input
              type='number'
              value={curr ?? ''}
              onChange={(e) =>
                setCurr(e.target.value ? +e.target.value : undefined)
              }
              required
            />
            <DatePicker
              defaultDate={date}
              onSelect={setDate}
            />
          </div>
        </div>
        <div className='self-center'>=</div>

        <div>
          <Label>Total</Label>
          <Input
            value={total.toFixed(2)}
            readOnly
          />
        </div>
        <div className='self-center'>*</div>

        <div>
          <Label>Multiplier</Label>
          <Input
            value={fixed}
            readOnly
          />
        </div>
      </div>
    </div>
  )
}
