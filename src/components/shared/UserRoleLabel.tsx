import { UserRole } from '@/common/enums/enums.db'
import { Badge } from '../ui/badge'

export default function UserRoleLabel(props: { role: UserRole }) {
  switch (props.role) {
    case UserRole.Customer:
      return <Badge variant={'outline'}>Customer</Badge>
    case UserRole.Staff:
      return <Badge variant={'secondary'}>Staff</Badge>
    case UserRole.Admin:
      return <Badge>Admin</Badge>
    default:
      return null
  }
}
