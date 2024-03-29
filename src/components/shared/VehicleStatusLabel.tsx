import { VehicleStatus } from '@/common/enums/enums.db'
import React from 'react'
import StatusWithDot from './StatusWithDot'
import { VehicleStatusLabel } from '@/common/constants/business'
import { VehicleStatusColor } from '@/common/constants/status-colors'

export default function VehicleStatusLabelComponent(props: {
  status: VehicleStatus
}) {
  return (
    <StatusWithDot
      label={VehicleStatusLabel[props.status]}
      color={VehicleStatusColor[props.status]}
    />
  )
}
