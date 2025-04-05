import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { ThemeProvider } from '@/components/shared/ThemeProvider'
import { Toaster } from '@/components/ui/sonner'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/common/configs/auth'
import ClientSessionProvider from './SessionProvider'
import ReactQueryProvider from './ReactQueryProvider'

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
      <body className={inter.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <ClientSessionProvider session={session}>
              {children}
            </ClientSessionProvider>
          </ReactQueryProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
