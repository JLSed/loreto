import React from 'react'
import { getApartmentById } from '../actions'
import { notFound } from 'next/navigation'
import ApartmentDetail from './ApartmentDetail'

interface Props {
  params: {
    id: string
  }
}

export default async function Page(props: Props) {
  const data = await getApartmentById(props.params.id)
  if (!data) {
    notFound()
  }

  return (
    <ApartmentDetail
      data={data}
      id={data.id}
    />
  )
}
