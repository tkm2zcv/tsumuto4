'use client'

import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)
  const [showIOSPrompt, setShowIOSPrompt] = useState(false)

  useEffect(() => {
    // Service Workerの登録（本番のみ）。開発時は既存SWを解除してキャッシュ起因の不整合を防ぐ。
    if ('serviceWorker' in navigator) {
      if (process.env.NODE_ENV === 'production') {
        const onLoad = () => {
          navigator.serviceWorker.register('/sw.js').then(
            (registration) => {
              console.log('SW registered: ', registration)
            },
            (err) => {
              console.log('SW registration failed: ', err)
            }
          )
        }
        window.addEventListener('load', onLoad)
        return () => window.removeEventListener('load', onLoad)
      } else {
        // 開発時はSWを無効化（既に登録されていれば解除）
        navigator.serviceWorker.getRegistrations?.().then((regs) => {
          regs.forEach((r) => r.unregister())
        }).catch(() => {})
      }
    }

    // インストールプロンプトの処理
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallButton(true)
    }

    // iOS判定とプロンプト表示
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches

    if (isIOS && !isInStandaloneMode) {
      // iOSで未インストールの場合
      const hasShownIOSPrompt = localStorage.getItem('iosPromptShown')
      if (!hasShownIOSPrompt) {
        setShowIOSPrompt(true)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('PWA installed')
    }

    setDeferredPrompt(null)
    setShowInstallButton(false)
  }

  const handleIOSClose = () => {
    localStorage.setItem('iosPromptShown', 'true')
    setShowIOSPrompt(false)
  }

  return (
    <>
      {/* Android/デスクトップ用インストールボタン */}
      {showInstallButton && (
        <button
          onClick={handleInstallClick}
          className="fixed bottom-4 left-4 z-50 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-pulse"
          aria-label="アプリをインストール"
        >
          <Download className="h-5 w-5" />
          <span className="text-sm font-medium">アプリをインストール</span>
        </button>
      )}

      {/* iOS用インストール案内 */}
      {showIOSPrompt && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white p-4 border-t border-gray-700">
          <button
            onClick={handleIOSClose}
            className="absolute top-2 right-2 p-1"
            aria-label="閉じる"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="text-sm">
            <p className="font-bold mb-2">📱 ホーム画面に追加</p>
            <p className="text-gray-300">
              1. Safari下部の共有ボタン <span className="text-blue-400">⬆</span> をタップ<br />
              2. 「ホーム画面に追加」を選択<br />
              3. 「追加」をタップ
            </p>
          </div>
        </div>
      )}
    </>
  )
}
