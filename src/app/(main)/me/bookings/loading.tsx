import React from 'react'

export default function Loading() {
  return (
    <div>
      <header className='p-4'>
        <h3>Your bookings</h3>
      </header>
      <main className='lead grid place-items-center h-[200px] bg-muted animate-pulse rounded-md'>
        Loading...
      </main>
    </div>
  )
}
