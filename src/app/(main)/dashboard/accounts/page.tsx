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
    <div>
      <header className='p-4'>
        <h2>Accounts</h2>
      </header>
      <AccountsDataTable
        columns={accountsColumns}
        data={accounts}
      />
    </div>
  )
}
