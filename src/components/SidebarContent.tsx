'use client'

import React from 'react'
import { Zap, Users, ChevronDown, Upload, FileText, Plus, Download, FileJson, History, CloudDownload, Edit2, X, Star, GripVertical, Save, RefreshCw } from 'lucide-react'
import { Account } from '@/types'

interface SidebarContentProps {
  selectedAccountId: string
  importText: string
  setImportText: (text: string) => void
  showAccountManager: boolean
  setShowAccountManager: (show: boolean) => void
  accounts: Account[]
  sortedAccounts: Account[]
  handleAccountSelect: (id: string) => void
  isDragging: boolean
  handleDragOver: (e: React.DragEvent) => void
  handleDragLeave: (e: React.DragEvent) => void
  handleDrop: (e: React.DragEvent) => void
  isAdding: boolean
  setIsAdding: (adding: boolean) => void
  formData: { name: string; dmLink: string }
  setFormData: (data: { name: string; dmLink: string }) => void
  handleAddAccount: () => void
  handleImport: () => void
  colorClasses: any
  showDeletedAccounts: boolean
  setShowDeletedAccounts: (show: boolean) => void
  deletedAccounts: Account[]
  clearDeletedAccounts: () => void
  restoreAccount: (account: Account) => void
  unusedTweets: any[]
  usedTweets: any[]
  editingAccountId: string | null
  setEditingAccountId: (id: string | null) => void
  editingAccountData: { name: string; dmLink: string; isFavorite: boolean }
  setEditingAccountData: (data: { name: string; dmLink: string; isFavorite: boolean }) => void
  accountValidationErrors: { name?: string; dmLink?: string }
  saveInlineEdit: () => void
  cancelInlineEdit: () => void
  toggleAccountFavorite: (account: Account, e: React.MouseEvent) => void
  handleAccountEdit: (account: Account) => void
  handleAccountDelete: (account: Account) => void
  handleAccountDragStart: (e: React.DragEvent, account: Account) => void
  handleAccountDragOver: (e: React.DragEvent, accountId: string) => void
  handleAccountDrop: (e: React.DragEvent, targetAccount: Account) => void
  dragOverId: string | null
  setDragOverId: (id: string | null) => void
  manualBackup: () => void
  showToastNotification: (message: string, isError?: boolean) => void
}

export const SidebarContent: React.FC<SidebarContentProps> = ({
  selectedAccountId,
  importText,
  setImportText,
  showAccountManager,
  setShowAccountManager,
  accounts,
  sortedAccounts,
  handleAccountSelect,
  isDragging,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  isAdding,
  setIsAdding,
  formData,
  setFormData,
  handleAddAccount,
  handleImport,
  colorClasses,
  showDeletedAccounts,
  setShowDeletedAccounts,
  deletedAccounts,
  clearDeletedAccounts,
  restoreAccount,
  unusedTweets,
  usedTweets,
  editingAccountId,
  setEditingAccountId,
  editingAccountData,
  setEditingAccountData,
  accountValidationErrors,
  saveInlineEdit,
  cancelInlineEdit,
  toggleAccountFavorite,
  handleAccountEdit,
  handleAccountDelete,
  handleAccountDragStart,
  handleAccountDragOver,
  handleAccountDrop,
  dragOverId,
  setDragOverId,
  manualBackup,
  showToastNotification
}) => {
  return (
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
                <button
                  onClick={manualBackup}
                  className="p-1 lg:p-1.5 rounded bg-purple-600 hover:bg-purple-700 text-white"
                  title="バックアップ作成"
                >
                  <CloudDownload className="h-3 w-3 lg:h-3.5 lg:w-3.5" />
                </button>
                {accounts.length > 0 && (
                  <>
                    <button
                      onClick={() => {
                        const jsonData = JSON.stringify(accounts, null, 2)
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
                        const importedAccounts = JSON.parse(text)

                        // バリデーション
                        if (!Array.isArray(importedAccounts)) {
                          throw new Error('無効なJSONフォーマットです')
                        }

                        showToastNotification('アカウントをインポートしました')
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

            <div className="space-y-1 max-h-32 overflow-y-auto relative">
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
                  className={`p-1.5 lg:p-2 bg-gray-900/50 rounded text-xs flex items-center gap-2 group transition-all ${
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
                        />
                        {accountValidationErrors.dmLink && (
                          <p className="text-red-400 text-xs mt-0.5">{accountValidationErrors.dmLink}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={saveInlineEdit}
                          className={`p-0.5 lg:p-1 rounded ${colorClasses.text} hover:bg-gray-800`}
                          title="保存 (Enter)"
                        >
                          <Save className="h-3 w-3" />
                        </button>
                        <button
                          onClick={cancelInlineEdit}
                          className="p-0.5 lg:p-1 rounded text-gray-400 hover:bg-gray-800"
                          title="キャンセル (Esc)"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={(e) => toggleAccountFavorite(account, e)}
                        className={`p-1 rounded ${
                          account.isFavorite ? 'text-yellow-500' : 'text-gray-600 hover:text-yellow-500'
                        }`}
                        title={account.isFavorite ? 'お気に入り解除' : 'お気に入り登録'}
                      >
                        <Star className="h-3 w-3" fill={account.isFavorite ? 'currentColor' : 'none'} />
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-300 font-medium text-xs truncate">{account.name}</p>
                        <p className="text-gray-600 truncate text-xs">{account.dmLink}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleAccountEdit(account)}
                          className="p-0.5 lg:p-1 rounded text-gray-400 hover:text-blue-400 hover:bg-gray-800"
                          title="編集"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleAccountDelete(account)}
                          className="p-0.5 lg:p-1 rounded text-gray-400 hover:text-red-400 hover:bg-gray-800"
                          title="削除"
                        >
                          <X className="h-3 w-3" />
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
        {unusedTweets.length > 0 && unusedTweets.length < 10 && (
          <button
            onClick={() => setImportText('')}
            className="w-full py-1.5 lg:py-2 border border-gray-700 hover:bg-gray-800 text-gray-400 rounded-lg text-xs lg:text-sm transition-all"
          >
            すべてクリア
          </button>
        )}
      </div>
    </div>
  )
}