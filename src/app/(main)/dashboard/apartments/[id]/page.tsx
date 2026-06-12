import React from 'react'
import { getApartmentById } from '../actions'
import { notFound } from 'next/navigation'
import ApartmentDetail from './ApartmentDetail'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function Page(props: Props) {
  const params = await props.params
  const data = await getApartmentById(params.id)
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
