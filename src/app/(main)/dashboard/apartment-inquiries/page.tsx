import InquiryTable from './InquiryTable'
import { getInquiries } from './inquiry-actions'

export type Inquiry = Awaited<ReturnType<typeof getInquiries>>[number]

export default async function Page() {
  const inquiries = await getInquiries()

  return (
    <div>
      <header className='p-4 border-b flex items-center justify-between'>
        <h2>Apartment Inquiries</h2>
      </header>

      <main className='p-4'>
        <InquiryTable inquiries={inquiries} />
      </main>
    </div>
  )
}
