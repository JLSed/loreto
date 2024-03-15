interface Props {
  size: number
}

export default function Phase2(props: Props) {
  return (
    <div className='p-8 grid place-items-center h-full'>
      <div
        className='border rounded-full grid place-items-center border-black'
        style={{
          width: `${props.size}px`,
          height: `${props.size}px`,
        }}
      >
        LOGO
      </div>
    </div>
  )
}
