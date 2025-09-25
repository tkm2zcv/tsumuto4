'use client'

import { useState } from 'react'
import { Account, Tweet } from '@/types'
import { Upload, AlertCircle, CheckCircle, FileText } from 'lucide-react'

interface TweetImporterProps {
  accounts: Account[]
  onImport: (tweets: Tweet[], accountId: string) => void
}

export function TweetImporter({ accounts, onImport }: TweetImporterProps) {
  const [selectedAccountId, setSelectedAccountId] = useState<string>('')
  const [importText, setImportText] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleImport = () => {
    if (!selectedAccountId || !importText.trim()) return

    setIsImporting(true)
    setImportStatus('idle')

    setTimeout(() => {
      const tweets = parseTweets(importText, selectedAccountId)
      onImport(tweets, selectedAccountId)
      setImportText('')
      setImportStatus('success')
      setIsImporting(false)
      setTimeout(() => setImportStatus('idle'), 3000)
    }, 500)
  }

  const parseTweets = (text: string, accountId: string): Tweet[] => {
    const account = accounts.find(a => a.id === accountId)
    if (!account) return []

    const tweetTexts = text.includes('---') 
      ? text.split('---').map(t => t.trim()).filter(Boolean)
      : text.split(/\n\n+/).map(t => t.trim()).filter(Boolean)

    return tweetTexts.map((content, index) => {
      let processedContent = content
      
      const dmLinkRegex = /https:\/\/x\.com\/messages\/[^\s]+/g
      if (dmLinkRegex.test(content)) {
        processedContent = content.replace(dmLinkRegex, account.dmLink)
      }

      if (!processedContent.includes('ツムツム代行')) {
        processedContent = processedContent + '\n\nツムツム代行'
      }

      return {
        id: `tweet-${Date.now()}-${index}`,
        content: processedContent,
        originalContent: content,
        dmLink: account.dmLink,
        hashTags: extractHashtags(processedContent),
        accountId: accountId,
        used: false,
        createdAt: new Date()
      }
    })
  }

  const extractHashtags = (text: string): string[] => {
    const hashtagRegex = /#[^\s#]+/g
    return text.match(hashtagRegex) || []
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">ツイートインポート</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Geminiで生成したツイートを貼り付けて、DMリンクを自動置換します
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            インポート設定
          </h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
              アカウント選択
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {accounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => setSelectedAccountId(account.id)}
                  className={`p-3 rounded-lg border transition-colors text-left ${
                    selectedAccountId === account.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <p className="font-medium text-sm">{account.name}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
              ツイート文章を貼り付け
            </label>
            <textarea
              placeholder="ツイート文章をここに貼り付けてください。

「---」または空行で区切られたツイートを認識します。"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="w-full min-h-[300px] px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {importStatus === 'success' && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">インポート完了</span>
                </div>
              )}
              {importStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">エラーが発生しました</span>
                </div>
              )}
            </div>
            <button
              onClick={handleImport}
              disabled={!selectedAccountId || !importText.trim() || isImporting}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isImporting ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  インポート
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}