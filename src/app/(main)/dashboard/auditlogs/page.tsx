import { prisma } from '@/common/configs/prisma'
import { AuditAction, AuditAffectedTable } from '@/common/enums/enums.db'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRightIcon } from '@radix-ui/react-icons'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default async function Page(props: {
  searchParams: {
    page?: string
    per_page?: string
  }
}) {
  const logs = await prisma.auditLog.findMany({
    // take: parseInt(props.searchParams.per_page ?? '10'),
    // skip: props.searchParams.page
    //   ? (parseInt(props.searchParams.page) - 1) *
    //     parseInt(props.searchParams.per_page ?? '10')
    //   : 0,
    include: {
      actor: {
        select: {
          username: true,
          photoUrl: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <header className='p-4'>
        <h2>Audit Logs</h2>
      </header>

      <main className='p-4 grid gap-4'>
        {logs.length === 0 && (
          <div className='lead'>No more items in this page</div>
        )}

        {logs.map((log) => {
          const action =
            log.action === AuditAction.Creation ? 'created' : 'modified'

          return (
            <Card key={log.id}>
              <CardHeader className='p-2'>
                <CardTitle className='text-base flex items-center gap-3'>
                  <Avatar className='scale-50'>
                    <AvatarImage
                      src={log.actor.photoUrl ?? ''}
                      alt=''
                    />
                    <AvatarFallback>{log.actor.username[0]}</AvatarFallback>
                  </Avatar>
                  <span className='text-muted-foreground'>
                    {log.actor.username}
                  </span>
                  <span>{action}</span>
                  <span className='text-muted-foreground'>
                    {AuditAffectedTable[log.affectedTable]}
                  </span>
                  <span className='small text-muted-foreground'>
                    {log.affectedRowId}
                  </span>
                </CardTitle>
              </CardHeader>
              {log.action === AuditAction.Modification && log.columnName && (
                <CardContent className='flex items-center gap-3 p-2'>
                  <Badge>{log.columnName}</Badge>
                  <Badge variant={'secondary'}>{log.from}</Badge>
                  <ArrowRightIcon />
                  <Badge variant={'secondary'}>{log.to}</Badge>
                </CardContent>
              )}
            </Card>
          )
        })}
      </main>
    </div>
  )
}
