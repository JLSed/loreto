import { BoxOrdersStatusText } from '@/common/constants/business'

export default function BoxOrderStatusLabel(props: { status: number }) {
  return BoxOrdersStatusText[props.status]
}
