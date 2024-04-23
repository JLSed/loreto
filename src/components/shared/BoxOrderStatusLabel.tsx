import { BoxOrdersStatusText } from '@/common/constants/business'

export default function BoxOrderStatusLabel(props: { status: number }) {
  const status = BoxOrdersStatusText[props.status]
  return <div>{status}</div>
}
