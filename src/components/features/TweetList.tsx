'use client'

import { Tweet } from '@/types'
import { TweetCard } from './TweetCard'
import { FileText, CheckCircle, Circle } from 'lucide-react'

interface TweetListProps {
  tweets: Tweet[]
  onToggleUsed: (id: string) => void
}

export function TweetList({ tweets, onToggleUsed }: TweetListProps) {
  const usedCount = tweets.filter(t => t.used).length
  const unusedCount = tweets.length - usedCount

  if (tweets.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-12 border border-gray-200 dark:border-gray-700 border-dashed">
        <div className="flex flex-col items-center justify-center">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-center">
            ツイートがまだありません。<br />
            インポートタブから追加してください。
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            全ツイート
          </p>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {tweets.length}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            未使用
          </p>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Circle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {unusedCount}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            使用済み
          </p>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {usedCount}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tweets.map((tweet) => (
          <TweetCard
            key={tweet.id}
            tweet={tweet}
            onToggleUsed={onToggleUsed}
          />
        ))}
      </div>
    </div>
  )
}