import React from 'react'
import StatusWithDot from './StatusWithDot'

type Props = {
  availabilityStatus: number
}

export default function ApartmentStatusLabel(props: Props) {
  switch (props.availabilityStatus) {
    case 0:
      return (
        <StatusWithDot
          label='Available'
          color='green'
        />
      )
    case 1:
      return (
        <StatusWithDot
          label='Hide'
          color='orange'
        />
      )
    default:
      return <StatusWithDot label='Unknown' />
  }
}
