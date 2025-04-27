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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'
import { updateOrderStatus } from './actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { PencilIcon } from 'lucide-react'
import BoxView from './BoxView'

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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant={'secondary'}
                      size={'sm'}
                    >
                      Preview Box
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='sm:max-w-max'>
                    <DialogHeader>
                      <DialogTitle>Box Details</DialogTitle>
                      <DialogDescription>
                        This preview is just the length and width of the box.
                      </DialogDescription>
                      <BoxView box={row.original.box} />
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
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
