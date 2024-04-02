'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { User } from '@prisma/client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserRole } from '@/common/enums/enums.db'
import UserRoleLabel from '@/components/shared/UserRoleLabel'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { updateRole } from './actions'
import { useRouter } from 'next/navigation'

export default function UpdateUserRole(props: { user: User }) {
  const [role, setRole] = useState(props.user.role)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function save() {
    try {
      setLoading(true)
      const res = await updateRole(props.user.id, role)
      if (res.status === 200) {
        toast.success('User role updated successfully')
        router.back()
        router.refresh()
        return
      }
      toast.error('Failed to update user role')
    } catch (error) {
      toast.error('Failed to update user role')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <header className='p-4'>
        <h3>Edit User Role</h3>
      </header>

      <main className='max-w-xl m-auto'>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>
              You are about to edit the role of this user
            </CardTitle>
            <CardDescription>
              {
                "Be careful with this action as it can affect the user's access to the system."
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <Avatar className='scale-75'>
                  <AvatarImage
                    src={props.user.photoUrl ?? ''}
                    alt=''
                  />
                  <AvatarFallback>{props.user.firstName[0]}</AvatarFallback>
                </Avatar>
                <div className='ml-2'>
                  <div className='large'>{props.user.username}</div>
                  <p className='text-muted-foreground'>{props.user.email}</p>
                </div>
              </div>

              <div>
                <Select
                  disabled={loading}
                  defaultValue={props.user.role.toString()}
                  onValueChange={(v) => {
                    setRole(+v as UserRole)
                  }}
                >
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='Role' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.Customer.toString()}>
                      <UserRoleLabel role={UserRole.Customer} />
                    </SelectItem>
                    <SelectItem value={UserRole.Staff.toString()}>
                      <UserRoleLabel role={UserRole.Staff} />
                    </SelectItem>
                    <SelectItem value={UserRole.Admin.toString()}>
                      <UserRoleLabel role={UserRole.Admin} />
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='mt-8 flex justify-end'>
              <Button
                onClick={save}
                loading={loading}
                disabled={loading || role === props.user.role}
              >
                Confirm
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
