'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Tweet } from '@/types'
import { Copy, Check, Trash2 } from 'lucide-react'

interface VirtualTweetListProps {
  tweets: Tweet[]
  copiedIds: Set<string>
  pulsingId: string | null
  highContrast: boolean
  fontClasses: {
    heading: string
    label: string
    body: string
    tweet: string
  }
  animatingTweetIds?: Set<string>
  onCopyTweet: (tweet: Tweet, event?: React.MouseEvent<HTMLButtonElement>) => void
  onToggleUsed: (id: string) => void
  onDeleteTweet: (id: string) => void
  getTwitterCharCount: (text: string) => number
  scrollToIndex?: number
}

export function VirtualTweetList({
  tweets,
  copiedIds,
  pulsingId,
  highContrast,
  fontClasses,
  animatingTweetIds = new Set(),
  onCopyTweet,
  onToggleUsed,
  onDeleteTweet,
  getTwitterCharCount,
  scrollToIndex
}: VirtualTweetListProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  // 仮想スクロールの設定
  const virtualizer = useVirtualizer({
    count: tweets.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200, // 各ツイートカードの推定高さ
    overscan: 5, // 表示領域外に事前レンダリングする項目数
  })

  // scrollToIndexが指定されたらスクロール
  useEffect(() => {
    if (scrollToIndex !== undefined && scrollToIndex >= 0 && scrollToIndex < tweets.length) {
      virtualizer.scrollToIndex(scrollToIndex, {
        align: 'center',
        behavior: 'smooth'
      })
    }
  }, [scrollToIndex, virtualizer, tweets.length])

  const items = virtualizer.getVirtualItems()

  return (
    <div
      ref={parentRef}
      className="h-full overflow-auto"
      style={{ contain: 'strict' }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {items.map((virtualItem) => {
          const tweet = tweets[virtualItem.index]
          
          return (
            <div
              key={virtualItem.key}
              id={`tweet-${tweet.id}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <div className="pb-3 lg:pb-4">
                <div
                  className={`rounded-xl p-4 lg:p-6 border transition-all duration-300 tweet-card-3d enhanced-shadow ${
                    copiedIds.has(tweet.id) ? 'copied-glow' : ''
                  } ${
                    highContrast
                      ? copiedIds.has(tweet.id)
                        ? 'bg-gray-900 border-green-400'
                        : 'bg-gray-900 border-white hover:border-gray-300'
                      : copiedIds.has(tweet.id)
                        ? 'bg-gray-900/50 border-green-500/50'
                        : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
                  } ${tweet.used ? 'opacity-60' : ''}`}
                  role="article"
                  aria-label={`ツイート: ${tweet.content.substring(0, 50)}...`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tweet.used}
                        onChange={() => onToggleUsed(tweet.id)}
                        className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                      <span className={`text-xs lg:text-sm font-medium ${
                        tweet.used 
                          ? 'text-gray-500' 
                          : 'text-green-400'
                      }`}>
                        {tweet.used ? '使用済み' : '未使用'}
                      </span>
                    </label>
                    <div className="flex items-center gap-1 lg:gap-2">
                      <button
                        onClick={(e) => onCopyTweet(tweet, e)}
                        className={`p-1.5 lg:p-2 rounded-lg hover:bg-gray-800 transition-colors group relative overflow-hidden ${
                          pulsingId === tweet.id ? 'pulse-animation' : ''
                        }`}
                      >
                        {copiedIds.has(tweet.id) ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-500 group-hover:text-gray-300" />
                        )}
                      </button>
                      <button
                        onClick={() => onDeleteTweet(tweet.id)}
                        className="p-1.5 lg:p-2 rounded-lg hover:bg-gray-800 transition-colors group"
                      >
                        <Trash2 className="h-4 w-4 text-gray-500 group-hover:text-red-400" />
                      </button>
                    </div>
                  </div>
                  
                  <div className={`${highContrast ? 'text-white' : 'text-gray-300'} whitespace-pre-wrap break-words leading-relaxed ${fontClasses.tweet}`}>
                    {tweet.content}
                  </div>
                  
                  <div className="mt-3 lg:mt-4 flex items-center justify-between pt-2 lg:pt-3 border-t border-gray-800">
                    <span className="text-xs text-gray-500">
                      {new Date(tweet.createdAt).toLocaleDateString('ja-JP')} {new Date(tweet.createdAt).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className={`text-xs font-medium ${
                      getTwitterCharCount(tweet.content) > 280 
                        ? 'text-red-400' 
                        : 'text-gray-500'
                    }`}>
                      {getTwitterCharCount(tweet.content)} / 280
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}