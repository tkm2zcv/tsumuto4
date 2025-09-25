'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          エラーが発生しました
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          申し訳ございません。何か問題が発生しました。
        </p>
        <button
          onClick={reset}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          もう一度試す
        </button>
      </div>
    </div>
  )
}