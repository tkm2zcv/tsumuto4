import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/hooks/useTheme'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ツムート - ツムツム代行ツイート管理',
  description: 'ツムツム代行サービスのツイート文章を効率的に管理するWebアプリケーション',
  manifest: '/manifest.json',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0f1419',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}