import { ReactNode } from "react";

export default function StatusWithDot(props: { color?: string; label: ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <div className="rounded-full w-2 h-2" style={{ backgroundColor: props.color ?? 'grey' }} />
      {props.label}
    </div>
  )
}
