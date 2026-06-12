import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { ThemeProvider } from '@/components/shared/ThemeProvider'
import { Toaster } from '@/components/ui/sonner'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/common/configs/auth'
import ClientSessionProvider from './SessionProvider'
import ReactQueryProvider from './ReactQueryProvider'
import { NavbarProvider } from './navbar-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Loreto Trading',
  description: '2D packaging design solution',
  icons: ['/logo.png'],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)

  return (
    <html
      lang='en'
      suppressHydrationWarning
    >
      <head>
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,200,0,0'
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <ClientSessionProvider session={session}>
              <NavbarProvider>{children}</NavbarProvider>
            </ClientSessionProvider>
          </ReactQueryProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
