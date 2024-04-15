import Navbar from './Navbar'

export default function Home() {
  return (
    <div>
      <Navbar />

      <main className='max-w-5xl m-auto p-3 mt-4'>
        <div>
          <h1>Loreto Trading</h1>
          <p className='text-muted-foreground mt-3'>
            We are a company that specializes in providing packaging solutions.
            Our unique feature allows for the resizing of boxes and the addition
            of layout markings. With our services, you can customize boxes to
            perfectly fit your specific size requirements, complete with
            accurate markings for easy assembly and organization.
          </p>
        </div>
      </main>
    </div>
  )
}
