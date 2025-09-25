'use client'

import { AlertTriangle } from 'lucide-react'

interface ConfirmToastProps {
  message: string
  onConfirm: () => void
  onCancel: () => void
  isVisible: boolean
}

export function ConfirmToast({ message, onConfirm, onCancel, isVisible }: ConfirmToastProps) {
  if (!isVisible) return null

  return (
    <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
    }`}>
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl p-4 flex items-start gap-3 min-w-[320px] max-w-md">
        <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-white text-sm mb-3">{message}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onConfirm()
                onCancel()
              }}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md transition-colors"
            >
              削除する
            </button>
            <button
              onClick={onCancel}
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-md transition-colors"
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}