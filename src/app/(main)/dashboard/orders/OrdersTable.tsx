'use client'

import { DataTable } from '@/components/shared/DataTable'
import { DashboardOrders } from './page'
import { Badge } from '@/components/ui/badge'
import BoxOrderStatusLabel from '@/components/shared/BoxOrderStatusLabel'
import { BoxOrderStatus } from '@/common/enums/enums.db'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  Dialog,
  DialogContent,
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

type Props = {
  orders: DashboardOrders
}

export default function OrdersTable(props: Props) {
  const [loading, setLoading] = useState(false)
  const [orderToUpdate, setOrderToUpdate] = useState<
    DashboardOrders[number] | undefined
  >()
  const [newStatus, setNewStatus] = useState<number | undefined>()

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
                  <div className='font-bold capitalize'>{b.name}</div>
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
              return <div className='capitalize'>{c.username}</div>
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
                default:
                  break
              }
            },
          },
          {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
              return (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size={'icon'}
                      variant={'ghost'}
                    >
                      <DotsHorizontalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                  </DropdownMenuContent>
                </DropdownMenu>
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
              disabled={!newStatus || orderToUpdate?.status === newStatus}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
