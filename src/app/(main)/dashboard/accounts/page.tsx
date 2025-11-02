import { getAccountsForDashboard } from './accounts-actions'
import { accountsColumns } from './accounts-column'
import { AccountsDataTable } from './accounts-table'

export default async function Page(props: {
  searchParams: {
    page: number
    perPage: number
  }
}) {
  const accounts = await getAccountsForDashboard({
    page: props.searchParams.page ?? 1,
    perPage: props.searchParams.perPage ?? 10,
  })

  return (
    <div className='container mx-auto p-4 sm:p-6 lg:p-8 space-y-6'>
      <header>
        <h2 className='text-xl sm:text-2xl font-bold'>Manage Accounts</h2>
        <p className='text-sm text-muted-foreground mt-1'>
          View and manage user accounts and roles
        </p>
      </header>
      <div className='overflow-hidden'>
        <AccountsDataTable
          columns={accountsColumns}
          data={accounts}
        />
      </div>
    </div>
  )
}
