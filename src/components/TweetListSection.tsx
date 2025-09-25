'use client'

import { memo } from 'react'
import { FileText, Maximize2 } from 'lucide-react'
import { Tweet } from '@/types'

interface TweetListSectionProps {
  tweets: Tweet[]
  copiedIds: Set<string>
  pulsingId: string | null
  highContrast: boolean
  isCompactMode: boolean
  animatingTweetIds: Set<string>
  fontClasses: any
  onCompactModeToggle: () => void
  onCopyTweet: (tweet: Tweet, event?: React.MouseEvent<HTMLButtonElement>) => void
  onToggleUsed: (id: string) => void
  onDeleteTweet: (id: string) => void
  getTwitterCharCount: (text: string) => number
  children: React.ReactNode
}

export const TweetListSection = memo(function TweetListSection({
  tweets,
  isCompactMode,
  onCompactModeToggle,
  children
}: TweetListSectionProps) {
  const unusedTweets = tweets.filter(t => !t.used)

  return (
    <div>
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <h2 className="text-lg lg:text-xl font-semibold text-white flex items-center gap-2">
          <FileText className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400" />
          インポート済みツイート
        </h2>
        <div className="flex items-center gap-2">
          {/* コンパクトモード */}
          <button
            onClick={onCompactModeToggle}
            className={`p-1.5 rounded-lg transition-colors ${
              isCompactMode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
            title="コンパクトモード"
          >
            <Maximize2 className="h-4 w-4" />
          </button>

          <span className="text-xs lg:text-sm text-gray-400">
            {tweets.length}件 ({unusedTweets.length}件未使用)
          </span>
        </div>
      </div>
      {children}
    </div>
  )
})