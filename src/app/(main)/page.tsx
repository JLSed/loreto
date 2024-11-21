import LoretoTradingH1, {
  LoretoTradingAbout,
  LoretoTradingImage,
} from './animation-components'
import Navbar from './Navbar'

export default function Home() {
  return (
    <div>
      <Navbar />

      <main className='max-w-5xl m-auto p-3 mt-4'>
        <div className='grid grid-cols-2'>
          <div className='mt-16'>
            <LoretoTradingH1 />
            <LoretoTradingAbout />
          </div>
          <div className='mt-8'>
            <LoretoTradingImage />
          </div>
        </div>
      </main>
    </div>
  )
}
