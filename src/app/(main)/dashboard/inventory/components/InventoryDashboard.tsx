'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Weight, Hash, Boxes } from 'lucide-react'

interface DashboardData {
  typeName: string
  totalQuantity: number
  totalWeight: number
  entries: number
}

interface InventoryDashboardProps {
  data: DashboardData[]
}

export function InventoryDashboard({ data }: InventoryDashboardProps) {
  const totalQuantity = data.reduce((sum, item) => sum + item.totalQuantity, 0)
  const totalWeight = data.reduce((sum, item) => sum + item.totalWeight, 0)
  const totalEntries = data.reduce((sum, item) => sum + item.entries, 0)
  const totalTypes = data.length

  const stats = [
    {
      title: 'Total Boxes',
      value: totalQuantity.toLocaleString(),
      icon: Boxes,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Weight',
      value: `${totalWeight.toLocaleString()} lbs`,
      icon: Weight,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Inventory Entries',
      value: totalEntries.toLocaleString(),
      icon: Hash,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Box Types',
      value: totalTypes.toLocaleString(),
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ]

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
            <div className={`p-2 rounded-md ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stat.value}</div>
          </CardContent>
        </Card>
      ))}

      {/* Box Type Breakdown */}
      {data.length > 0 && (
        <Card className='md:col-span-2 lg:col-span-4'>
          <CardHeader>
            <CardTitle className='text-lg'>Inventory by Box Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {data.map((item) => (
                <div
                  key={item.typeName}
                  className='flex items-center justify-between p-4 rounded-lg bg-gray-50'
                >
                  <div>
                    <p className='font-medium'>{item.typeName}</p>
                    <p className='text-sm text-gray-500'>
                      {item.entries} entries
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='font-semibold'>{item.totalQuantity}</p>
                    <p className='text-sm text-gray-500'>
                      {item.totalWeight} lbs
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
