'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import usePhAddressQuery from '@/common/hooks/usePhAddressQuery'

export default function Test() {
  const ctrl = usePhAddressQuery()
  console.log(ctrl)

  return (
    <div>
      <h2>Select Address</h2>
      <pre>{ctrl.fullAddress}</pre>

      <Label>Region</Label>
      <Select
        disabled={ctrl.regionsQuery.isPending}
        value={ctrl.selectedRegion?.code}
        onValueChange={ctrl.setRegionByCode}
      >
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Select Region' />
        </SelectTrigger>
        <SelectContent>
          {ctrl.regions.map((r) => (
            <SelectItem
              value={r.code}
              key={r.code}
            >
              {r.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Label>City</Label>
      <Select
        disabled={ctrl.citiesQuery.isPending}
        value={ctrl.selectedCity?.code}
        onValueChange={ctrl.setCityByCode}
      >
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Select City' />
        </SelectTrigger>
        <SelectContent>
          {ctrl.cities.map((c) => (
            <SelectItem
              value={c.code}
              key={c.code}
            >
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Label>Barangay</Label>
      <Select
        disabled={ctrl.brgysQuery.isPending}
        value={ctrl.selectedBarangay?.code}
        onValueChange={ctrl.setBrgyByCode}
      >
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Select Brgy.' />
        </SelectTrigger>
        <SelectContent>
          {ctrl.barangays.map((b) => (
            <SelectItem
              value={b.code}
              key={b.code}
            >
              {b.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
