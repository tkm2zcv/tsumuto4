'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Account, Tweet } from '@/types'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Plus, Settings, Copy, Check, Trash2, X, FileText, Menu, ChevronDown, Upload, Type, Contrast, Minus, Maximize2, PanelLeftClose, PanelLeft, Sliders, Zap, Users, Download, FileJson, History, Edit2, Star, GripVertical, Save, RefreshCw, Keyboard } from 'lucide-react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { Tooltip } from '@/components/Tooltip'
import { ConfirmToast } from '@/components/ConfirmToast'
import { SkeletonLoader } from '@/components/SkeletonLoader'
import { PWAInstaller } from '@/components/PWAInstaller'
import { UISettings } from '@/components/UISettings'
import { normalizeHashtagCharacters } from '@/utils/textNormalization'

// 仮想スクロールコンポーネントを動的インポート
const VirtualTweetList = dynamic(
  () => import('@/components/VirtualTweetList').then(mod => mod.VirtualTweetList),
  { 
    ssr: false,
    loading: () => <SkeletonLoader count={5} />
  }
)

export default function Home() {
  const [accounts, setAccounts] = useLocalStorage<Account[]>('accounts', [])
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [mounted, setMounted] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showImportSection, setShowImportSection] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [pulsingId, setPulsingId] = useState<string | null>(null)
  const [toastTimeout, setToastTimeout] = useState<NodeJS.Timeout | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [deletedAccounts, setDeletedAccounts] = useState<Account[]>([])
  const [showDeletedAccounts, setShowDeletedAccounts] = useState(false)
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium')
  const [highContrast, setHighContrast] = useState<boolean>(false)
  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false)
  const [isNewImport, setIsNewImport] = useState(false)
  const [animatingTweetIds, setAnimatingTweetIds] = useState<Set<string>>(new Set())
  const [scrollToIndex, setScrollToIndex] = useState<number | undefined>(undefined)
  const [isCompactMode, setIsCompactMode] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; type: 'tweet' | 'account' } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [draggedAccount, setDraggedAccount] = useState<Account | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null)
  const [editingAccountData, setEditingAccountData] = useState({ name: '', dmLink: '' })
  const [accountValidationErrors, setAccountValidationErrors] = useState<{ name?: string; dmLink?: string }>({})
  const [showUISettings, setShowUISettings] = useState(false)
  const [cardSize, setCardSize] = useLocalStorage<'small' | 'medium' | 'large'>('cardSize', 'medium')
  const [animationSpeed, setAnimationSpeed] = useLocalStorage<'slow' | 'normal' | 'fast' | 'none'>('animationSpeed', 'normal')
  const [colorTheme, setColorTheme] = useLocalStorage<'default' | 'blue' | 'purple' | 'orange'>('colorTheme', 'default')

  useEffect(() => {
    setMounted(true)
    // クライアント側でのみローカルストレージから設定を読み込む
    const savedFontSize = localStorage.getItem('fontSize')
    const savedHighContrast = localStorage.getItem('highContrast')
    
    if (savedFontSize) {
      try {
        const parsed = JSON.parse(savedFontSize) as 'small' | 'medium' | 'large'
        setFontSize(parsed)
      } catch (e) {
        // エラーは無視
      }
    }
    
    if (savedHighContrast) {
      try {
        const parsed = JSON.parse(savedHighContrast) as boolean
        setHighContrast(parsed)
      } catch (e) {
        // エラーは無視
      }
    }
  }, [])
  
  const [importText, setImportText] = useState('')
  const [selectedAccountId, setSelectedAccountId] = useState<string>('')

  // アカウント選択時に最終使用日時を更新
  const handleAccountSelect = (accountId: string) => {
    setSelectedAccountId(accountId)
    if (accountId) {
      setAccounts(accounts.map(acc => 
        acc.id === accountId 
          ? { ...acc, lastUsed: new Date() }
          : acc
      ))
    }
  }
  const [showAccountManager, setShowAccountManager] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', dmLink: '' })
  const [editFormData, setEditFormData] = useState({ name: '', dmLink: '' })
  const [copiedIds, setCopiedIds] = useState<Set<string>>(new Set())

  const handleImport = () => {
    if (!selectedAccountId || !importText.trim()) return

    const account = accounts.find(a => a.id === selectedAccountId)
    if (!account) return

    // Split by === dividers
    const sections = importText.split(/={3,}/)
    
    const tweetTexts = sections.map(section => {
      // Skip empty sections
      if (!section.trim()) return null
      
      // Remove tweet number headers but keep the content structure
      let cleaned = section
        .replace(/【ツイート案\s*\d+】/g, '')
        .replace(/^\n+/, '') // Remove leading newlines only
        .replace(/\n+$/, '') // Remove trailing newlines only
        .trim()
      
      return cleaned
    }).filter(text => text && text.length > 0)

    const newTweets = tweetTexts.map((content, index) => {
      let processedContent = content
      
      // Replace "DMリンク" placeholder with actual account DM link
      if (processedContent) {
        processedContent = processedContent.replace(/DMリンク/g, account.dmLink)
      }
      
      // Also replace any existing x.com/messages links
      if (processedContent) {
        const dmLinkRegex = /https:\/\/x\.com\/messages\/[^\s]+/g
        if (dmLinkRegex.test(processedContent)) {
          processedContent = processedContent.replace(dmLinkRegex, account.dmLink)
        }
      }

      processedContent = normalizeHashtagCharacters(processedContent || '')

      return {
        id: `tweet-${Date.now()}-${index}`,
        content: (processedContent || '').trim(),
        originalContent: content || '',
        dmLink: account.dmLink,
        hashTags: extractHashtags(processedContent || ''),
        accountId: selectedAccountId,
        used: false,
        createdAt: new Date()
      }
    })

    // アニメーション用のIDをセット
    const newTweetIds = new Set(newTweets.map(t => t.id))
    setAnimatingTweetIds(newTweetIds)
    setIsNewImport(true)
    
    setTweets([...tweets, ...newTweets])
    setImportText('')
    
    // モバイルの場合、インポート後にメニューを閉じる
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setShowImportSection(false)
      setShowMobileMenu(false)
    }
    
    // 成功通知を表示
    showToastNotification(`${newTweets.length}件のツイートをインポートしました`)
    
    // アニメーション後にフラグをリセット
    setTimeout(() => {
      setIsNewImport(false)
      setAnimatingTweetIds(new Set())
    }, newTweets.length * 100 + 1000) // 各カード100msの遅延 + 1秒の余裕
  }

  const extractHashtags = (text: string): string[] => {
    const hashtagRegex = /#[^\s#]+/g
    return text.match(hashtagRegex) || []
  }

  const getTwitterCharCount = (text: string): number => {
    // Replace URLs with 23 character placeholder for Twitter counting
    const urlRegex = /https?:\/\/[^\s]+/g
    let modifiedText = text.replace(urlRegex, 'x'.repeat(23))
    
    // Count characters (Twitter counts by Unicode code points, not JS string length)
    // This handles emoji and other multi-byte characters correctly
    return Array.from(modifiedText).length
  }

  const showToastNotification = (message: string, isError: boolean = false) => {
    // 既存のタイムアウトをクリア
    if (toastTimeout) {
      clearTimeout(toastTimeout)
    }
    
    // トーストを表示
    setToastMessage(message)
    setToastType(isError ? 'error' : 'success')
    setShowToast(true)
    
    // 新しいタイムアウトを設定
    const timeout = setTimeout(() => {
      setShowToast(false)
    }, 3000)
    
    setToastTimeout(timeout)
  }

  const handleFileUpload = async (file: File) => {
    if (!selectedAccountId) {
      showToastNotification('アカウントを選択してください', true)
      return
    }

    try {
      const text = await file.text()
      setImportText(text)
      showToastNotification('ファイルを読み込みました')
    } catch (error) {
      showToastNotification('ファイルの読み込みに失敗しました', true)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // ドラッグ領域から完全に離れた場合のみ
    if (e.currentTarget === e.target) {
      setIsDragging(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const textFile = files.find(file => file.type === 'text/plain' || file.name.endsWith('.txt'))
    
    if (textFile) {
      await handleFileUpload(textFile)
    } else {
      showToastNotification('テキストファイル(.txt)をドロップしてください', true)
    }
  }

  const handleAddAccount = () => {
    if (formData.name && formData.dmLink) {
      const maxOrder = Math.max(...accounts.map(a => a.order || 0), 0)
      const newAccount: Account = {
        ...formData,
        id: `acc-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        order: maxOrder + 1,
        isFavorite: false
      }
      setAccounts([...accounts, newAccount])
      setFormData({ name: '', dmLink: '' })
      setIsAdding(false)
    }
  }

  // お気に入りの切り替え
  const toggleFavorite = (id: string) => {
    setAccounts(accounts.map(acc => 
      acc.id === id ? { ...acc, isFavorite: !acc.isFavorite } : acc
    ))
    showToastNotification('お気に入りを更新しました')
  }

  // アカウントのドラッグ開始
  const handleAccountDragStart = (e: React.DragEvent, account: Account) => {
    setDraggedAccount(account)
    e.dataTransfer.effectAllowed = 'move'
  }

  // アカウントのドラッグオーバー
  const handleAccountDragOver = (e: React.DragEvent, accountId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverId(accountId)
  }

  // アカウントのドロップ
  const handleAccountDrop = (e: React.DragEvent, targetAccount: Account) => {
    e.preventDefault()
    if (!draggedAccount || draggedAccount.id === targetAccount.id) return

    const reorderedAccounts = [...accounts]
    const draggedIndex = reorderedAccounts.findIndex(a => a.id === draggedAccount.id)
    const targetIndex = reorderedAccounts.findIndex(a => a.id === targetAccount.id)

    // 順序を入れ替え
    reorderedAccounts.splice(draggedIndex, 1)
    reorderedAccounts.splice(targetIndex, 0, draggedAccount)

    // order値を更新
    const updatedAccounts = reorderedAccounts.map((acc, index) => ({
      ...acc,
      order: index
    }))

    setAccounts(updatedAccounts)
    setDraggedAccount(null)
    setDragOverId(null)
  }

  // インライン編集の開始
  const startInlineEdit = (account: Account) => {
    setEditingAccountId(account.id)
    setEditingAccountData({ name: account.name, dmLink: account.dmLink })
    setAccountValidationErrors({})
  }

  // インライン編集の保存
  const saveInlineEdit = () => {
    const errors: { name?: string; dmLink?: string } = {}
    
    // バリデーション
    if (!editingAccountData.name || editingAccountData.name.length < 2) {
      errors.name = '名前は2文字以上入力してください'
    }
    if (!editingAccountData.dmLink || !editingAccountData.dmLink.startsWith('http')) {
      errors.dmLink = '有効なURLを入力してください'
    }

    if (Object.keys(errors).length > 0) {
      setAccountValidationErrors(errors)
      return
    }

    setAccounts(accounts.map(acc => 
      acc.id === editingAccountId 
        ? { ...acc, ...editingAccountData, updatedAt: new Date() }
        : acc
    ))
    setEditingAccountId(null)
    showToastNotification('アカウントを更新しました')
  }

  // キーボードショートカットの処理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K: キーボードショートカット一覧表示
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setShowKeyboardShortcuts(!showKeyboardShortcuts)
      }
      // Ctrl/Cmd + N: 新規アカウント追加
      if ((e.ctrlKey || e.metaKey) && e.key === 'n' && showAccountManager) {
        e.preventDefault()
        setIsAdding(true)
      }
      // Escape: モーダルを閉じる
      if (e.key === 'Escape') {
        if (editingAccountId) {
          setEditingAccountId(null)
        } else if (showKeyboardShortcuts) {
          setShowKeyboardShortcuts(false)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showAccountManager, editingAccountId, showKeyboardShortcuts])

  const handleEditAccount = (id: string) => {
    setAccounts(accounts.map(acc => 
      acc.id === id ? { ...acc, ...editFormData, updatedAt: new Date() } : acc
    ))
    setEditingId(null)
  }

  const handleDeleteAccount = (id: string) => {
    setDeleteConfirm({ id, type: 'account' })
  }

  const confirmDeleteAccount = (id: string) => {
    const accountToDelete = accounts.find(acc => acc.id === id)
    if (accountToDelete) {
      // 削除済みリストに追加（最大10件保持）
      setDeletedAccounts(prev => [accountToDelete, ...prev].slice(0, 10))
      setAccounts(accounts.filter(acc => acc.id !== id))
      setTweets(tweets.filter(tweet => tweet.accountId !== id))
      showToastNotification('アカウントを削除しました（復元可能）')
    }
  }

  // 削除済みアカウントを復元
  const restoreAccount = (account: Account) => {
    setAccounts(prev => [...prev, account])
    setDeletedAccounts(prev => prev.filter(acc => acc.id !== account.id))
    showToastNotification(`${account.name} を復元しました`)
  }

  // すべての削除済みアカウントをクリア
  const clearDeletedAccounts = () => {
    setDeletedAccounts([])
    showToastNotification('削除済みアカウントをクリアしました')
  }

  // 自動バックアップ

  const handleCopyTweet = useCallback(async (tweet: Tweet, event?: React.MouseEvent<HTMLButtonElement>) => {
    let updatedTweets: Tweet[] = []
    
    try {
      await navigator.clipboard.writeText(tweet.content)
      setCopiedIds(prev => new Set([...prev, tweet.id]))
      // コピーと同時に使用済みにする
      updatedTweets = tweets.map(t => 
        t.id === tweet.id ? { ...t, used: true } : t
      )
      setTweets(updatedTweets)
      
      // リップルエフェクトを作成
      if (event && event.currentTarget) {
        const button = event.currentTarget as HTMLButtonElement
        const ripple = document.createElement('span')
        ripple.classList.add('ripple')
        button.appendChild(ripple)
        
        setTimeout(() => {
          if (ripple.parentNode) {
            ripple.remove()
          }
        }, 600)
      }
      
      // パルスアニメーションを開始
      setPulsingId(tweet.id)
      setTimeout(() => setPulsingId(null), 600)
      // コピー成功通知
      showToastNotification('コピーしました')
      
      // 1個分下にスクロール
      setTimeout(() => {
        // 現在のスクロール位置から少し下にスクロール（ツイートカード1個分）
        const scrollAmount = 350 // ツイートカード1個分の高さ + 余白
        
        // 仮想スクロール使用時（100件以上）
        if (updatedTweets.length > 100) {
          // 仮想スクロールの場合は現在の表示インデックスを1つ進める
          const currentIndex = updatedTweets.findIndex(t => t.id === tweet.id)
          if (currentIndex < updatedTweets.length - 1) {
            setScrollToIndex(currentIndex + 1)
            setTimeout(() => setScrollToIndex(undefined), 500)
          }
        } else {
          // スクロール可能な要素を取得（overflow-y-autoのクラスを持つ要素）
          const scrollableElement = document.querySelector('.flex-1.bg-\\[\\#0f1419\\].overflow-y-auto') as HTMLElement
          
          if (scrollableElement) {
            scrollableElement.scrollBy({
              top: scrollAmount,
              behavior: 'smooth'
            })
          } else {
            window.scrollBy({
              top: scrollAmount,
              behavior: 'smooth'
            })
          }
        }
      }, 300) // 少し遅延を入れて自然な動きに
    } catch (error) {
      console.error('コピーエラー:', error)
      showToastNotification('コピーに失敗しました', true)
      return
    }
  }, [tweets])

  const handleToggleUsed = useCallback((id: string) => {
    setTweets(tweets.map(tweet => 
      tweet.id === id ? { ...tweet, used: !tweet.used } : tweet
    ))
  }, [tweets])

  const handleDeleteTweet = useCallback((id: string) => {
    setDeleteConfirm({ id, type: 'tweet' })
  }, [])

  const confirmDeleteTweet = useCallback((id: string) => {
    setTweets(tweets.filter(tweet => tweet.id !== id))
    showToastNotification('ツイートを削除しました')
  }, [tweets])

  const handleClearAll = () => {
    setTweets([])
    setImportText('')
    setCopiedIds(new Set())
  }


  const startEdit = (account: Account) => {
    setEditingId(account.id)
    setEditFormData({ name: account.name, dmLink: account.dmLink })
  }

  const unusedTweets = useMemo(() => tweets.filter(t => !t.used), [tweets])
  const usedTweets = useMemo(() => tweets.filter(t => t.used), [tweets])

  // アカウントを並び替え（お気に入り優先、order順）
  const sortedAccounts = useMemo(() => {
    return [...accounts].sort((a, b) => {
      // お気に入りを優先
      if (a.isFavorite && !b.isFavorite) return -1
      if (!a.isFavorite && b.isFavorite) return 1
      // order値で並び替え
      return (a.order || 0) - (b.order || 0)
    })
  }, [accounts])

  // フォントサイズクラスの設定
  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          heading: 'text-lg lg:text-xl',
          label: 'text-xs',
          body: 'text-xs lg:text-sm',
          tweet: 'text-xs lg:text-sm'
        }
      case 'large':
        return {
          heading: 'text-2xl lg:text-3xl',
          label: 'text-base',
          body: 'text-base lg:text-lg',
          tweet: 'text-base lg:text-lg'
        }
      default:
        return {
          heading: 'text-xl lg:text-2xl',
          label: 'text-sm',
          body: 'text-sm lg:text-base',
          tweet: 'text-sm lg:text-base'
        }
    }
  }

  const fontClasses = getFontSizeClasses()

  // カードサイズクラスの設定
  const getCardSizeClasses = () => {
    switch (cardSize) {
      case 'small':
        return isCompactMode ? 'p-2' : 'p-3 lg:p-4'
      case 'large':
        return isCompactMode ? 'p-4' : 'p-6 lg:p-8'
      default:
        return isCompactMode ? 'p-3' : 'p-4 lg:p-6'
    }
  }

  // アニメーション速度の設定
  const getAnimationDuration = () => {
    switch (animationSpeed) {
      case 'none':
        return '0ms'
      case 'slow':
        return '500ms'
      case 'fast':
        return '150ms'
      default:
        return '300ms'
    }
  }

  // カラーテーマクラスの設定
  const getColorClasses = () => {
    switch (colorTheme) {
      case 'blue':
        return {
          primary: 'bg-blue-600 hover:bg-blue-700',
          success: 'bg-blue-500',
          border: 'border-blue-500/50',
          borderLight: 'border-blue-500/30',
          text: 'text-blue-400',
          glow: 'blue-glow',
          gradient: 'from-blue-500 to-blue-400'
        }
      case 'purple':
        return {
          primary: 'bg-purple-600 hover:bg-purple-700',
          success: 'bg-purple-500',
          border: 'border-purple-500/50',
          borderLight: 'border-purple-500/30',
          text: 'text-purple-400',
          glow: 'purple-glow',
          gradient: 'from-purple-500 to-purple-400'
        }
      case 'orange':
        return {
          primary: 'bg-orange-600 hover:bg-orange-700',
          success: 'bg-orange-500',
          border: 'border-orange-500/50',
          borderLight: 'border-orange-500/30',
          text: 'text-orange-400',
          glow: 'orange-glow',
          gradient: 'from-orange-500 to-orange-400'
        }
      default:
        return {
          primary: 'bg-green-600 hover:bg-green-700',
          success: 'bg-green-500',
          border: 'border-green-500/50',
          borderLight: 'border-green-500/30',
          text: 'text-green-400',
          glow: 'copied-glow',
          gradient: 'from-green-500 to-green-400'
        }
    }
  }

  const colorClasses = getColorClasses()
  const cardSizeClass = getCardSizeClasses()
  const animationDuration = getAnimationDuration()

  // フォントサイズ変更時にローカルストレージに保存
  const handleSetFontSize = (size: 'small' | 'medium' | 'large') => {
    setFontSize(size)
    if (typeof window !== 'undefined') {
      localStorage.setItem('fontSize', JSON.stringify(size))
    }
  }

  // ハイコントラスト変更時にローカルストレージに保存
  const handleSetHighContrast = (value: boolean) => {
    setHighContrast(value)
    if (typeof window !== 'undefined') {
      localStorage.setItem('highContrast', JSON.stringify(value))
    }
  }

  // デスクトップ用サイドバー
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex-[1.618] min-h-0 overflow-y-auto space-y-4 lg:space-y-6 pr-2">
        {/* Import Settings */}
        <div>
          <h2 className="text-base lg:text-lg font-semibold text-white mb-3 lg:mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 lg:h-5 lg:w-5 text-yellow-500" />
            インポート設定
          </h2>

          {/* Account Selection */}
          <div className="mb-3 lg:mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-300 text-xs lg:text-sm">アカウント</label>
              <button
                onClick={() => setShowAccountManager(!showAccountManager)}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                {showAccountManager ? '閉じる' : '管理'}
              </button>
            </div>
            <div className="relative">
              <select
                value={selectedAccountId}
                onChange={(e) => handleAccountSelect(e.target.value)}
                className="w-full appearance-none px-2 py-1.5 lg:px-3 lg:py-2 pr-8 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm lg:text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">アカウントを選択...</option>
                {sortedAccounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.isFavorite ? '⭐ ' : ''}{account.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Tweet Import Textarea with Drag & Drop */}
          <div>
            <label className="text-gray-300 text-xs lg:text-sm mb-2 block">ツイート文章</label>
            <div 
              className={`relative transition-all duration-200 ${isDragging ? 'scale-[1.02]' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="ツイート文章を貼り付け...

===================
【ツイート案 1067】
===================
💥ツイート内容...
DMリンク
===================

「DMリンク」は自動置換されます"
                className={`w-full h-64 lg:h-80 xl:h-96 px-3 py-2 lg:px-4 lg:py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none text-xs lg:text-sm font-mono transition-all duration-200 ${
                  isDragging ? 'border-blue-500 bg-gray-800/50' : 'border-gray-700'
                }`}
              />
              {isDragging && (
                <div className="absolute inset-0 bg-blue-500/10 rounded-lg flex items-center justify-center pointer-events-none">
                  <div className="bg-gray-900/90 px-4 py-3 rounded-lg flex items-center gap-2">
                    <Upload className="h-5 w-5 text-blue-400" />
                    <span className="text-white font-medium">テキストファイルをドロップ</span>
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              テキストファイル(.txt)をドラッグ&ドロップでも読み込めます
            </p>
        </div>
      </div>

      {/* Account Manager (Collapsible) */}
      {showAccountManager && (
          <div className="bg-gray-800/50 rounded-lg p-4 lg:p-5 space-y-3 lg:space-y-4 transition-all duration-200 relative">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm lg:text-base font-semibold text-gray-200 flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-400" />
                アカウント管理
                <span className="text-xs font-normal text-gray-400">({accounts.length}/20)</span>
              </h3>
              <div className="flex items-center gap-2">
                {deletedAccounts.length > 0 && (
                  <button
                    onClick={() => setShowDeletedAccounts(!showDeletedAccounts)}
                    className="p-1 lg:p-1.5 rounded bg-orange-600 hover:bg-orange-700 text-white relative"
                    title="削除済みアカウント"
                  >
                    <History className="h-3 w-3 lg:h-3.5 lg:w-3.5" />
                    {deletedAccounts.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {deletedAccounts.length}
                      </span>
                    )}
                  </button>
                )}
                {accounts.length > 0 && (
                  <>
                    <button
                      onClick={() => {
                        // accounts_2025-08-22.jsonと同じ形式にする
                        const exportData = accounts.map(acc => ({
                          name: acc.name,
                          dmLink: acc.dmLink,
                          id: acc.id,
                          createdAt: acc.createdAt instanceof Date ? acc.createdAt.toISOString() : acc.createdAt,
                          updatedAt: acc.updatedAt instanceof Date ? acc.updatedAt.toISOString() : acc.updatedAt
                        }))

                        const jsonData = JSON.stringify(exportData, null, 2)
                        const blob = new Blob([jsonData], { type: 'application/json' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `accounts_${new Date().toISOString().split('T')[0]}.json`
                        a.click()
                        URL.revokeObjectURL(url)
                        showToastNotification('アカウント情報をエクスポートしました')
                      }}
                      className={`p-1 lg:p-1.5 rounded ${colorClasses.primary} text-white`}
                      title="JSONエクスポート"
                    >
                      <Download className="h-3 w-3 lg:h-3.5 lg:w-3.5" />
                    </button>
                  </>
                )}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="application/json,.json"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      
                      try {
                        const text = await file.text()
                        let importedData: any

                        try {
                          importedData = JSON.parse(text)
                        } catch (parseError) {
                          throw new Error('JSONの解析に失敗しました。ファイル形式を確認してください。')
                        }

                        // 配列でない場合は配列に変換
                        const importedAccounts = Array.isArray(importedData) ? importedData : [importedData]

                        // シンプルなバリデーションと変換
                        const validAccounts: Account[] = []

                        for (const acc of importedAccounts) {
                          // 最低限の必須フィールドチェック
                          if (acc && acc.name && acc.dmLink) {
                            validAccounts.push({
                              id: acc.id || `acc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                              name: String(acc.name),
                              dmLink: String(acc.dmLink),
                              createdAt: acc.createdAt ? new Date(acc.createdAt) : new Date(),
                              updatedAt: acc.updatedAt ? new Date(acc.updatedAt) : new Date(),
                              isFavorite: Boolean(acc.isFavorite),
                              order: Number(acc.order) || 0,
                              lastUsed: acc.lastUsed ? new Date(acc.lastUsed) : undefined
                            })
                          }
                        }

                        if (validAccounts.length === 0) {
                          throw new Error('有効なアカウント情報が見つかりません。name と dmLink フィールドが必要です。')
                        }

                        // 既存のアカウントを全て置き換え（インポートで上書き）
                        setAccounts(validAccounts.slice(0, 20)) // 最大20件

                        showToastNotification(`${Math.min(validAccounts.length, 20)}件のアカウントをインポートしました`)
                      } catch (error) {
                        showToastNotification(
                          error instanceof Error ? error.message : 'インポートに失敗しました',
                          true
                        )
                      }
                      
                      // ファイル選択をリセット
                      e.target.value = ''
                    }}
                  />
                  <div className={`p-1 lg:p-1.5 rounded ${colorClasses.primary} text-white cursor-pointer`}>
                    <FileJson className="h-3 w-3 lg:h-3.5 lg:w-3.5" />
                  </div>
                </label>
                {!isAdding && accounts.length < 20 && (
                  <button
                    onClick={() => setIsAdding(true)}
                    className={`p-1 lg:p-1.5 rounded ${colorClasses.primary} text-white`}
                  >
                    <Plus className="h-3 w-3 lg:h-3.5 lg:w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {isAdding && (
              <div className="space-y-2 p-2 lg:p-3 bg-gray-900/50 rounded">
                <input
                  type="text"
                  placeholder="アカウント名"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-2 py-1 lg:py-1.5 bg-gray-800 border border-gray-700 rounded text-white text-xs lg:text-sm placeholder-gray-500"
                />
                <input
                  type="text"
                  placeholder="DMリンク"
                  value={formData.dmLink}
                  onChange={(e) => setFormData({ ...formData, dmLink: e.target.value })}
                  className="w-full px-2 py-1 lg:py-1.5 bg-gray-800 border border-gray-700 rounded text-white text-xs lg:text-sm placeholder-gray-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddAccount}
                    className={`flex-1 py-1 lg:py-1.5 ${colorClasses.primary} text-white rounded text-xs`}
                  >
                    追加
                  </button>
                  <button
                    onClick={() => setIsAdding(false)}
                    className="flex-1 py-1 lg:py-1.5 border border-gray-600 hover:bg-gray-800 text-gray-300 rounded text-xs"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            )}


            <div className="space-y-1.5 max-h-52 overflow-y-auto relative custom-scrollbar">
              {accounts.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-xs">
                  アカウントが登録されていません
                  <br />
                  「+」ボタンで追加してください
                </div>
              )}
              {sortedAccounts.map(account => (
                <div
                  key={account.id}
                  draggable={editingAccountId !== account.id}
                  onDragStart={(e) => handleAccountDragStart(e, account)}
                  onDragOver={(e) => handleAccountDragOver(e, account.id)}
                  onDragEnd={() => setDragOverId(null)}
                  onDrop={(e) => handleAccountDrop(e, account)}
                  className={`p-2 lg:p-3 bg-gray-900/50 rounded-lg text-xs lg:text-sm flex items-center gap-2 group transition-all hover:bg-gray-800/50 ${
                    dragOverId === account.id ? 'ring-2 ring-blue-500' : ''
                  } ${account.isFavorite ? 'border-l-4 border-yellow-500' : ''}`}
                >
                  <div className="cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="h-3 w-3 text-gray-500" />
                  </div>
                  
                  {editingAccountId === account.id ? (
                    <div className="flex-1 space-y-1">
                      <div>
                        <input
                          type="text"
                          value={editingAccountData.name}
                          onChange={(e) => setEditingAccountData({ ...editingAccountData, name: e.target.value })}
                          className={`w-full px-1 py-0.5 bg-gray-800 border rounded text-white text-xs ${
                            accountValidationErrors.name ? 'border-red-500' : 'border-gray-700'
                          }`}
                          placeholder="アカウント名"
                          autoFocus
                        />
                        {accountValidationErrors.name && (
                          <p className="text-red-400 text-xs mt-0.5">{accountValidationErrors.name}</p>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          value={editingAccountData.dmLink}
                          onChange={(e) => setEditingAccountData({ ...editingAccountData, dmLink: e.target.value })}
                          className={`w-full px-1 py-0.5 bg-gray-800 border rounded text-white text-xs ${
                            accountValidationErrors.dmLink ? 'border-red-500' : 'border-gray-700'
                          }`}
                          placeholder="DMリンク"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveInlineEdit()
                            if (e.key === 'Escape') setEditingAccountId(null)
                          }}
                        />
                        {accountValidationErrors.dmLink && (
                          <p className="text-red-400 text-xs mt-0.5">{accountValidationErrors.dmLink}</p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={saveInlineEdit}
                          className={`p-0.5 lg:p-1 rounded ${colorClasses.text} hover:bg-gray-800`}
                          title="保存 (Enter)"
                        >
                          <Save className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => setEditingAccountId(null)}
                          className="p-0.5 lg:p-1 rounded text-gray-400 hover:bg-gray-800"
                          title="キャンセル (Escape)"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 min-w-0" onDoubleClick={() => startInlineEdit(account)}>
                        <div className="flex items-center gap-1">
                          <p className="text-white font-medium text-xs">{account.name}</p>
                          {account.lastUsed && (
                            <span className="text-gray-600 text-xs">
                              ({new Date(account.lastUsed).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })})
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 truncate text-xs">{account.dmLink}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleFavorite(account.id)}
                          className={`p-0.5 lg:p-1 rounded transition-colors ${
                            account.isFavorite ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                          }`}
                          title={account.isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
                        >
                          <Star className="h-3 w-3" fill={account.isFavorite ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          onClick={() => startInlineEdit(account)}
                          className="p-0.5 lg:p-1 rounded text-gray-400 hover:text-white opacity-0 group-hover:opacity-100"
                          title="編集 (ダブルクリック)"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteAccount(account.id)}
                          className="p-0.5 lg:p-1 rounded text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100"
                          title="削除"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Deleted Accounts */}
      {showDeletedAccounts && deletedAccounts.length > 0 && (
          <div className="bg-gray-800/50 rounded-lg p-3 lg:p-4 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs lg:text-sm font-medium text-gray-300 flex items-center gap-2">
                <History className="h-4 w-4 text-orange-400" />
                削除済みアカウント
              </h3>
              <button
                onClick={clearDeletedAccounts}
                className="text-xs text-red-400 hover:text-red-300"
              >
                すべてクリア
              </button>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {deletedAccounts.map(account => (
                <div
                  key={account.id}
                  className="p-1.5 lg:p-2 bg-gray-900/50 rounded text-xs flex items-center justify-between group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-400 font-medium text-xs">{account.name}</p>
                    <p className="text-gray-600 truncate text-xs">{account.dmLink}</p>
                  </div>
                  <button
                    onClick={() => restoreAccount(account)}
                    className={`p-0.5 lg:p-1 rounded ${colorClasses.text} hover:opacity-80`}
                    title="復元"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gray-800/50 rounded-lg p-2 lg:p-3 text-center">
          <p className="text-lg lg:text-2xl font-bold text-white">{accounts.length}</p>
          <p className="text-xs text-gray-400">アカウント</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-2 lg:p-3 text-center">
          <p className={`text-lg lg:text-2xl font-bold ${colorClasses.text}`}>{unusedTweets.length}</p>
          <p className="text-xs text-gray-400">未使用</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-2 lg:p-3 text-center">
          <p className="text-lg lg:text-2xl font-bold text-gray-500">{usedTweets.length}</p>
          <p className="text-xs text-gray-400">使用済み</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 mt-4 lg:mt-6">
        <button
          onClick={handleImport}
          disabled={!selectedAccountId || !importText.trim()}
          className="w-full py-2 lg:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-medium text-sm lg:text-base transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Zap className="h-4 w-4 lg:h-5 lg:w-5" />
          ツイートをインポート
        </button>
        
        {tweets.length > 0 && (
          <button
            onClick={handleClearAll}
            className="w-full py-1.5 lg:py-2 border border-gray-700 hover:bg-gray-800 text-gray-400 rounded-lg text-xs lg:text-sm transition-all"
          >
            すべてクリア
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div className={`flex flex-col lg:flex-row h-screen relative ${
      highContrast
        ? 'bg-black text-white'
        : 'bg-[#0f1419] text-gray-100'
    }`}>
      {/* PWA Installer */}
      <PWAInstaller />

      {/* UI Settings Modal */}
      {showUISettings && (
        <UISettings
          onClose={() => setShowUISettings(false)}
          cardSize={cardSize}
          onCardSizeChange={setCardSize}
          animationSpeed={animationSpeed}
          onAnimationSpeedChange={setAnimationSpeed}
          colorTheme={colorTheme}
          onColorThemeChange={setColorTheme}
        />
      )}

      {/* Toast Notification */}
      <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
      }`}>
        <div className={`text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
          toastType === 'error' ? 'bg-red-600' : colorClasses.success
        }`}>
          {toastType === 'error' ? (
            <X className="h-5 w-5" />
          ) : (
            <Check className="h-5 w-5" />
          )}
          <span className="font-medium">{toastMessage}</span>
        </div>
      </div>


      {/* Keyboard Shortcuts Modal */}
      {showKeyboardShortcuts && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setShowKeyboardShortcuts(false)}>
          <div 
            className={`max-w-md w-full mx-4 rounded-lg shadow-xl p-6 ${
              highContrast ? 'bg-white text-black' : 'bg-gray-900 text-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Keyboard className="h-5 w-5" />
                キーボードショートカット
              </h3>
              <button
                onClick={() => setShowKeyboardShortcuts(false)}
                className="p-1 rounded hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <span className="text-sm">ショートカット一覧</span>
                <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">Ctrl/Cmd + K</kbd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <span className="text-sm">新規アカウント追加</span>
                <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">Ctrl/Cmd + N</kbd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <span className="text-sm">インライン編集を保存</span>
                <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">Enter</kbd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <span className="text-sm">キャンセル・閉じる</span>
                <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">Escape</kbd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <span className="text-sm">アカウント編集</span>
                <span className="text-sm text-gray-500">ダブルクリック</span>
              </div>
            </div>

            <button
              onClick={() => setShowKeyboardShortcuts(false)}
              className={`w-full mt-4 py-2 rounded-lg font-medium ${
                highContrast 
                  ? 'bg-black text-white hover:bg-gray-800' 
                  : 'bg-gray-800 hover:bg-gray-700 text-white'
              }`}
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* Accessibility Menu */}
      {showAccessibilityMenu && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setShowAccessibilityMenu(false)}>
          <div 
            className={`absolute top-16 right-4 w-80 rounded-lg shadow-xl p-4 ${
              highContrast ? 'bg-white text-black' : 'bg-gray-900 text-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              アクセシビリティ設定
            </h3>
            
            {/* Font Size Adjustment */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">フォントサイズ</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSetFontSize('small')}
                  className={`p-2 rounded-lg flex-1 flex items-center justify-center gap-1 ${
                    fontSize === 'small' 
                      ? highContrast ? 'bg-black text-white' : `${colorClasses.primary} text-white`
                      : highContrast ? 'bg-gray-200 text-black' : 'bg-gray-800 text-gray-300'
                  }`}
                  aria-label="小さいフォント"
                >
                  <Type className="h-3 w-3" />
                  <span className="text-xs">小</span>
                </button>
                <button
                  onClick={() => handleSetFontSize('medium')}
                  className={`p-2 rounded-lg flex-1 flex items-center justify-center gap-1 ${
                    fontSize === 'medium' 
                      ? highContrast ? 'bg-black text-white' : `${colorClasses.primary} text-white`
                      : highContrast ? 'bg-gray-200 text-black' : 'bg-gray-800 text-gray-300'
                  }`}
                  aria-label="標準フォント"
                >
                  <Type className="h-4 w-4" />
                  <span className="text-sm">中</span>
                </button>
                <button
                  onClick={() => handleSetFontSize('large')}
                  className={`p-2 rounded-lg flex-1 flex items-center justify-center gap-1 ${
                    fontSize === 'large' 
                      ? highContrast ? 'bg-black text-white' : `${colorClasses.primary} text-white`
                      : highContrast ? 'bg-gray-200 text-black' : 'bg-gray-800 text-gray-300'
                  }`}
                  aria-label="大きいフォント"
                >
                  <Type className="h-5 w-5" />
                  <span className="text-base">大</span>
                </button>
              </div>
            </div>

            {/* High Contrast Mode */}
            <div className="mb-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Contrast className="h-4 w-4" />
                  ハイコントラストモード
                </span>
                <button
                  onClick={() => handleSetHighContrast(!highContrast)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    highContrast ? colorClasses.primary.split(' ')[0] : 'bg-gray-600'
                  }`}
                  role="switch"
                  aria-checked={highContrast}
                  aria-label="ハイコントラストモード切り替え"
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    highContrast ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </label>
            </div>

            <button
              onClick={() => setShowAccessibilityMenu(false)}
              className={`w-full py-2 rounded-lg font-medium ${
                highContrast 
                  ? 'bg-black text-white hover:bg-gray-800' 
                  : 'bg-gray-800 hover:bg-gray-700 text-white'
              }`}
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* Mobile Header */}
      <div className={`lg:hidden border-b p-4 ${
        highContrast ? 'bg-black border-white' : 'bg-gray-900 border-gray-800'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="ツムート"
              width={32}
              height={32}
              className="rounded-lg"
              loading="lazy"
            />
            <h1 className={`font-bold ${fontClasses.heading}`}>ツムート</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAccessibilityMenu(!showAccessibilityMenu)}
              className={`p-2 rounded-lg ${
                highContrast ? 'bg-white text-black' : 'bg-gray-800 text-white'
              }`}
              aria-label="アクセシビリティ設定"
            >
              <Settings className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className={`p-2 rounded-lg ${
                highContrast ? 'bg-white text-black' : 'bg-gray-800 text-white'
              }`}
              aria-label="メニューを開く"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowMobileMenu(false)}>
          <div 
            className="absolute top-0 left-0 w-80 h-full bg-gray-900 border-r border-gray-800 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Image
                    src="/logo.svg"
                    alt="ツムート"
                    width={32}
                    height={32}
                    className="rounded-lg"
                    loading="lazy"
                  />
                  <h1 className="text-lg font-bold text-white">ツムート</h1>
                </div>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 rounded-lg hover:bg-gray-800 text-gray-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-gray-400 text-xs mb-4">ツムツム代行ツイートを効率的に管理</p>
              <SidebarContent />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar - Golden Ratio 30% */}
      <div className={`hidden lg:flex ${isSidebarCollapsed ? 'w-16' : 'w-[30%] max-w-[500px] min-w-[380px]'} border-r ${isSidebarCollapsed ? 'p-4' : 'p-6 xl:p-8'} flex-col h-full overflow-y-auto transition-all duration-300 ${
        highContrast ? 'bg-black border-white' : 'bg-gray-900 border-gray-800'
      }`}>
        {/* Collapse Button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className={`absolute top-4 ${isSidebarCollapsed ? 'left-1/2 -translate-x-1/2' : 'right-4'} p-2 rounded-lg ${
            highContrast ? 'bg-white text-black' : 'bg-gray-800 text-white hover:bg-gray-700'
          } transition-all z-10`}
          title={isSidebarCollapsed ? 'サイドバーを開く' : 'サイドバーを閉じる'}
        >
          {isSidebarCollapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </button>
        
        {isSidebarCollapsed ? (
          /* Collapsed Sidebar */
          <div className="flex flex-col items-center gap-4 mt-16">
            <button
              onClick={() => {
                setIsSidebarCollapsed(false)
                setShowImportSection(!showImportSection)
              }}
              className={`p-3 rounded-lg ${colorClasses.primary} text-white`}
              title="インポート設定"
            >
              <Upload className="h-5 w-5" />
            </button>
            <button
              onClick={() => {
                setIsSidebarCollapsed(false)
                setShowAccountManager(!showAccountManager)
              }}
              className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white"
              title="アカウント管理"
            >
              <Users className="h-5 w-5" />
            </button>
            <button
              onClick={() => {
                setShowAccessibilityMenu(!showAccessibilityMenu)
              }}
              className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white"
              title="設定"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        ) : (
          /* Expanded Sidebar */
          <>
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Image
                    src="/logo.svg"
                    alt="ツムート"
                    width={40}
                    height={40}
                    className="rounded-lg"
                    priority
                  />
                  <div>
                    <h1 className={`font-bold ${fontClasses.heading}`}>ツムート</h1>
                  </div>
                </div>
                <button
                  onClick={() => setShowAccessibilityMenu(!showAccessibilityMenu)}
                  className={`p-2 rounded-lg ${
                    highContrast ? 'bg-white text-black' : 'bg-gray-800 text-white'
                  }`}
                  aria-label="アクセシビリティ設定"
                >
                  <Settings className="h-5 w-5" />
                </button>
              </div>
              <p className={`${highContrast ? 'text-gray-300' : 'text-gray-400'} ${fontClasses.body}`}>
                ツムツム代行ツイートを効率的に管理
              </p>
            </div>
            <SidebarContent />
          </>
        )}
      </div>

      {/* Main Area - Golden Ratio 70% */}
      <div className="flex-1 lg:w-[70%] bg-[#0f1419] overflow-y-auto relative">
        {/* Fixed Progress Bar */}
        {tweets.length > 0 && (
          <div className="sticky top-0 left-0 right-0 z-30 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
            <div className="max-w-4xl mx-auto px-4 py-2">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>進捗状況</span>
                <span>{usedTweets.length}/{tweets.length} 使用済み ({Math.round((usedTweets.length / tweets.length) * 100)}%)</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${colorClasses.gradient} transition-all duration-300`}
                  style={{ width: `${(usedTweets.length / tweets.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto p-4 lg:p-8">
        {tweets.length === 0 ? (
          /* Empty State */
          <div className="flex items-center justify-center min-h-[400px] lg:min-h-[600px]">
            <div className="text-center">
              <div className="text-6xl mb-4 text-gray-700">
                <Zap className="h-16 w-16 lg:h-24 lg:w-24 mx-auto text-gray-700" />
              </div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-500 mb-2">
                ツイートがありません
              </h2>
              <p className="text-sm lg:text-base text-gray-600">
                <span className="lg:hidden">メニューから設定を選択して<br />ツイートをインポートしてください</span>
                <span className="hidden lg:inline">左のフォームから設定を選択して<br />ツイートをインポートしてください</span>
              </p>
            </div>
          </div>
        ) : (
          /* Tweet List */
          <div>
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <h2 className="text-lg lg:text-xl font-semibold text-white flex items-center gap-2">
                <FileText className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400" />
                インポート済みツイート
              </h2>
              <div className="flex items-center gap-2">
                {/* UI設定 */}
                <button
                  onClick={() => setShowUISettings(true)}
                  className="p-1.5 rounded-lg transition-colors bg-gray-800 text-gray-400 hover:text-white"
                  title="UI設定"
                >
                  <Sliders className="h-4 w-4" />
                </button>

                {/* コンパクトモード */}
                <button
                  onClick={() => setIsCompactMode(!isCompactMode)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isCompactMode
                      ? `${colorClasses.primary} text-white`
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

            {/* 100件以上の場合は仮想スクロール、それ以下は通常表示 */}
            {tweets.length > 100 ? (
              <div className="h-[calc(100vh-200px)]">
                <VirtualTweetList
                  tweets={tweets}
                  copiedIds={copiedIds}
                  pulsingId={pulsingId}
                  highContrast={highContrast}
                  fontClasses={fontClasses}
                  animatingTweetIds={animatingTweetIds}
                  onCopyTweet={handleCopyTweet}
                  onToggleUsed={handleToggleUsed}
                  onDeleteTweet={handleDeleteTweet}
                  getTwitterCharCount={getTwitterCharCount}
                  scrollToIndex={scrollToIndex}
                />
              </div>
            ) : (
              <div className="space-y-3 lg:space-y-4">
                {tweets.map((tweet, index) => {
                  const isAnimating = animatingTweetIds.has(tweet.id)
                  const animationDelay = isAnimating ? index * 100 : 0
                  
                  return (
                  <div
                    key={tweet.id}
                    id={`tweet-${tweet.id}`}
                    className={`relative rounded-xl ${cardSizeClass} border tweet-card-3d enhanced-shadow ${
                      isAnimating ? 'tweet-card-cascade' : ''
                    } ${
                      copiedIds.has(tweet.id) ? colorClasses.glow : ''
                    } ${
                      highContrast
                        ? copiedIds.has(tweet.id)
                          ? `bg-gray-900 ${colorClasses.border}`
                          : 'bg-gray-900 border-white hover:border-gray-300'
                        : copiedIds.has(tweet.id)
                          ? `bg-gray-900/50 ${colorClasses.borderLight}`
                          : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
                    } ${tweet.used ? 'opacity-60' : ''}`}
                    role="article"
                    aria-label={`ツイート: ${tweet.content.substring(0, 50)}...`}
                    style={{
                      ...(isAnimating ? { animationDelay: `${animationDelay}ms` } : {}),
                      transitionDuration: `${animationDuration}ms`
                    }}
                  >
                    {/* シマーエフェクト（新規インポート時） */}
                    {isAnimating && (
                      <div className="absolute inset-0 shimmer-effect rounded-xl pointer-events-none" />
                    )}
                    <div className="flex items-start justify-between mb-3 relative">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tweet.used}
                          onChange={() => handleToggleUsed(tweet.id)}
                          className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                        <span className={`text-xs lg:text-sm font-medium ${
                          tweet.used
                            ? 'text-gray-500'
                            : colorClasses.text
                        }`}>
                          {tweet.used ? '使用済み' : '未使用'}
                        </span>
                      </label>
                      <div className="flex items-center gap-1 lg:gap-2">
                        <Tooltip content="コピー" position="top">
                          <button
                            onClick={(e) => handleCopyTweet(tweet, e)}
                            className={`p-1.5 lg:p-2 rounded-lg hover:bg-gray-800 group relative overflow-hidden ${
                              pulsingId === tweet.id ? 'pulse-animation' : ''
                            }`}
                            style={{ transitionDuration: `${animationDuration}ms` }}
                          >
                            {copiedIds.has(tweet.id) ? (
                              <Check className={`h-4 w-4 ${colorClasses.text}`} />
                            ) : (
                              <Copy className="h-4 w-4 text-gray-500 group-hover:text-gray-300" />
                            )}
                          </button>
                        </Tooltip>
                        <Tooltip content="削除" position="top">
                          <button
                            onClick={() => handleDeleteTweet(tweet.id)}
                            className="p-1.5 lg:p-2 rounded-lg hover:bg-gray-800 group"
                            style={{ transitionDuration: `${animationDuration}ms` }}
                          >
                            <Trash2 className="h-4 w-4 text-gray-500 group-hover:text-red-400" />
                          </button>
                        </Tooltip>
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
                  )
                })}
              </div>
            )}
          </div>
        )}
        </div>
      </div>
      
      {/* Floating Action Button */}
      {tweets.length > 0 && (
        <button
          onClick={() => {
            const element = document.querySelector('.flex-1.bg-\\[\\#0f1419\\].overflow-y-auto') as HTMLElement
            if (element) {
              element.scrollTo({ top: 0, behavior: 'smooth' })
            }
          }}
          className="fixed bottom-6 right-6 p-3 bg-gray-800/90 backdrop-blur-sm border border-gray-700 hover:bg-gray-700 hover:border-gray-600 text-gray-400 hover:text-white rounded-full shadow-2xl shadow-black/50 z-40 transition-all duration-200 hover:scale-105 group"
          aria-label="トップへスクロール"
        >
          <ChevronDown className="h-5 w-5 rotate-180 transition-transform group-hover:-translate-y-0.5" />
        </button>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmToast
        message={
          deleteConfirm?.type === 'tweet'
            ? 'このツイートを削除しますか？'
            : 'このアカウントと関連するツイートを削除しますか？'
        }
        onConfirm={() => {
          if (deleteConfirm) {
            if (deleteConfirm.type === 'tweet') {
              confirmDeleteTweet(deleteConfirm.id)
            } else {
              confirmDeleteAccount(deleteConfirm.id)
            }
          }
        }}
        onCancel={() => setDeleteConfirm(null)}
        isVisible={deleteConfirm !== null}
      />
    </div>
  )
}
