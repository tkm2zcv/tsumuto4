'use client'

import { useState } from 'react'
import { Tweet } from '@/types'
import { Copy, Check, Hash, Link } from 'lucide-react'

interface TweetCardProps {
  tweet: Tweet
  onToggleUsed: (id: string) => void
}

export function TweetCard({ tweet, onToggleUsed }: TweetCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(tweet.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const charCount = tweet.content.length

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl p-5 border transition-all ${
        tweet.used
          ? 'border-gray-200 dark:border-gray-700 opacity-60'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={tweet.used}
            onChange={() => onToggleUsed(tweet.id)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {tweet.used ? '使用済み' : '未使用'}
          </span>
        </label>
        <button
          onClick={handleCopy}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            copied
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 inline mr-1" />
              コピー済み
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 inline mr-1" />
              コピー
            </>
          )}
        </button>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words max-h-[200px] overflow-y-auto">
          {tweet.content}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            {tweet.dmLink && (
              <div className="flex items-center gap-1">
                <Link className="h-3 w-3" />
                <span>DMリンク有</span>
              </div>
            )}
            {tweet.hashTags.length > 0 && (
              <div className="flex items-center gap-1">
                <Hash className="h-3 w-3" />
                <span>{tweet.hashTags.length}</span>
              </div>
            )}
          </div>
          <span className={`text-xs ${
            charCount > 280 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
          }`}>
            {charCount}文字
          </span>
        </div>
      </div>
    </div>
  )
}