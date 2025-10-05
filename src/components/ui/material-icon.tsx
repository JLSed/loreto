import { cn } from '@/lib/utils'
import React from 'react'

const icons = [
  'local_shipping',
  'apartment',
  'package_2',
  'orders',
  'receipt_long',
  'other_houses',
  'person_edit',
  'manage_accounts',
  'settings',
  'dashboard',
  'power_settings_new',
  'dark_mode',
  'light_mode',
  'group',
  'more_horiz',
  'directions_car',
  'add_shopping_cart',
  'delete',
  'progress_activity',
  'help_center',
  'location_home',
  'bar_chart',
] as const

export type MaterialIconName = (typeof icons)[number]

export default function MaterialIcon(props: {
  name: MaterialIconName
  className?: string
}) {
  return (
    <span
      className={cn('material-symbols-outlined text-[20px]', props.className)}
    >
      {props.name}
    </span>
  )
}
