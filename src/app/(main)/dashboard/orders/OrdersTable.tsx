'use client'

import { DataTable } from '@/components/shared/DataTable'
import { DashboardOrders } from './page'
import { Badge } from '@/components/ui/badge'
import BoxOrderStatusLabel from '@/components/shared/BoxOrderStatusLabel'
import { BoxOrderStatus } from '@/common/enums/enums.db'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'
import { updateOrderStatus, createBoxOrderTransaction } from './actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { PencilIcon } from 'lucide-react'
import Link from 'next/link'
import { computePrice, pesos } from '@/lib/utils'

type Props = {
  orders: DashboardOrders
}

export default function OrdersTable(props: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [orderToUpdate, setOrderToUpdate] = useState<
    DashboardOrders[number] | undefined
  >()
  const [newStatus, setNewStatus] = useState<number | undefined>()

  const handleSaveStatus = async (order?: DashboardOrders[number]) => {
    if (!order || !newStatus) return
    setLoading(true)
    const res = await updateOrderStatus(order.id, order.status, newStatus)
    if (res.status === 200) {
      // If status is being set to Completed, create a Transaction
      if (newStatus === BoxOrderStatus.OrderCompleted) {
        // Compute total price
        const box = order.box
        const width = Math.round(box.totalWidth * (box.leftPanelSize / 100))
        const length = Math.round(box.totalWidth * (box.rightPanelSize / 100))
        const computation = computePrice({
          height: box.height,
          width,
          length,
          thickness: box.thickness === 1 ? 'single' : 'double',
        })
        const totalPrice = computation.totalPrice * order.quantity

        await createBoxOrderTransaction({
          totalPrice,
          userId: order.userId,
          // add other fields if needed
        })
      }
      setOrderToUpdate(undefined)
      setNewStatus(undefined)
      router.refresh()
      toast.success('Status updated successfully')
    } else {
      toast.error(res.message ?? 'Failed to update status')
    }
    setLoading(false)
  }

  return (
    <>
      <DataTable
        data={props.orders}
        columns={[
          {
            id: 'box',
            cell: ({ row }) => {
              const b = row.original.box
              const width = Math.round(b.totalWidth * (b.leftPanelSize / 100))
              const length = Math.round(b.totalWidth * (b.rightPanelSize / 100))

              return (
                <div className='flex flex-col items-start gap-2'>
                  <div className='font-bold capitalize flex items-center gap-2'>
                    {b.name}
                    <Badge variant={'outline'}>
                      {b.thickness === 1 ? 'Single' : 'Double'}
                    </Badge>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Badge
                      className='flex gap-2'
                      variant={'secondary'}
                    >
                      <span>H: {b.height}</span>
                      <span>x</span>
                      <span>W: {width}</span>
                      <span>x</span>
                      <span>L: {length}</span>
                    </Badge>
                    <Badge variant={'outline'}>
                      {pesos(
                        computePrice({
                          width: width,
                          length: length,
                          height: b.height,
                          thickness: b.thickness === 1 ? 'single' : 'double',
                        }).totalPrice
                      )}
                    </Badge>
                  </div>
                </div>
              )
            },
            header: 'Box',
          },
          {
            id: 'customer',
            header: 'Customer',
            cell: ({ row }) => {
              const c = row.original.user
              return (
                <div className='capitalize'>
                  <div>{c.username}</div>
                  <div>{c.contactNumber}</div>
                </div>
              )
            },
          },
          {
            accessorKey: 'quantity',
            header: 'Quantity',
          },
          {
            id: 'total price',
            header: 'Total Price',
            cell: ({ row }) => {
              const box = row.original.box
              const width = Math.round(
                box.totalWidth * (box.leftPanelSize / 100)
              )
              const length = Math.round(
                box.totalWidth * (box.rightPanelSize / 100)
              )
              const computation = computePrice({
                height: box.height,
                width,
                length,
                thickness: box.thickness === 1 ? 'single' : 'double',
              })
              return pesos(computation.totalPrice * row.original.quantity)
            },
          },
          {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
              const s = row.original.status
              return (
                <Badge
                  className='cursor-pointer'
                  onClick={() => setOrderToUpdate(row.original)}
                >
                  <PencilIcon className='w-3 h-3 mr-1' />
                  <BoxOrderStatusLabel status={s} />
                </Badge>
              )
            },
          },
          {
            id: 'update',
            header: 'Update',
            cell: ({ row }) => {
              const s = row.original.status
              switch (s) {
                case BoxOrderStatus.Placed:
                  return `Placed on ${format(
                    row.original.placedAt!,
                    'MMM dd yyyy'
                  )}`
                case BoxOrderStatus.OrderReceived:
                  return `Received on ${format(
                    row.original.receivedAt!,
                    'MMM dd yyyy'
                  )}`
                default:
                  break
              }
            },
          },
          {
            id: 'action',
            cell: ({ row }) => {
              return (
                <Link
                  passHref
                  href={`/box/preview?box=${row.original.boxId}`}
                  target='_blank'
                >
                  <Button
                    variant={'outline'}
                    size={'sm'}
                  >
                    Preview Box
                  </Button>
                </Link>
              )
            },
          },
        ]}
      />

      <Dialog
        open={!!orderToUpdate || loading}
        onOpenChange={(o) => {
          if (!o) {
            setOrderToUpdate(undefined)
            setNewStatus(undefined)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>

          <div className='flex items-center justify-between gap-4'>
            <Select
              defaultValue={orderToUpdate?.status.toString()}
              onValueChange={(v) => setNewStatus(+v)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={BoxOrderStatus.Placed.toString()}>
                  Placed
                </SelectItem>
                <SelectItem value={BoxOrderStatus.OrderReceived.toString()}>
                  Order Received
                </SelectItem>
                <SelectItem
                  value={BoxOrderStatus.PaymentInfoConfirmed.toString()}
                >
                  Payment Information Confirmed
                </SelectItem>
                <SelectItem value={BoxOrderStatus.ProcessingOrder.toString()}>
                  Processing
                </SelectItem>
                <SelectItem value={BoxOrderStatus.OutForDelivery.toString()}>
                  Out for Delivery
                </SelectItem>
                <SelectItem value={BoxOrderStatus.OrderCompleted.toString()}>
                  Completed
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              loading={loading}
              disabled={!newStatus || orderToUpdate?.status === newStatus}
              onClick={() => handleSaveStatus(orderToUpdate)}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
