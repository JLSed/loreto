import React from 'react'

export default function PageUnderConstruction(props: { pageName?: string }) {
  return (
    <div className='text-center py-8'>
      <h3>Coming Soon</h3>
      <p className='text-muted-foreground'>
        {props.pageName ?? 'This page is'} under construction
      </p>
    </div>
  )
}
