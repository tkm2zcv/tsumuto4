'use client'

import { useState } from 'react'
import { Account } from '@/types'
import { Plus, Edit2, Trash2, Check, X, Link, Users } from 'lucide-react'

interface AccountManagerProps {
  accounts: Account[]
  onAdd: (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => void
  onEdit: (id: string, account: Partial<Account>) => void
  onDelete: (id: string) => void
}

export function AccountManager({ accounts, onAdd, onEdit, onDelete }: AccountManagerProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', dmLink: '' })
  const [editFormData, setEditFormData] = useState({ name: '', dmLink: '' })

  const handleAdd = () => {
    if (formData.name && formData.dmLink) {
      onAdd(formData)
      setFormData({ name: '', dmLink: '' })
      setIsAdding(false)
    }
  }

  const handleEdit = (id: string) => {
    onEdit(id, editFormData)
    setEditingId(null)
  }

  const startEdit = (account: Account) => {
    setEditingId(account.id)
    setEditFormData({ name: account.name, dmLink: account.dmLink })
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">アカウント管理</h2>
          <p className="text-gray-600 dark:text-gray-400">登録アカウント: {accounts.length}件</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            アカウント追加
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">新規アカウント追加</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">アカウント名</label>
              <input
                type="text"
                placeholder="例: メインアカウント"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">DMリンク</label>
              <input
                type="text"
                placeholder="https://x.com/messages/compose?recipient_id=..."
                value={formData.dmLink}
                onChange={(e) => setFormData({ ...formData, dmLink: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                追加
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <div
            key={account.id}
            className={`bg-white dark:bg-gray-800 rounded-xl p-5 border transition-all ${
              editingId === account.id
                ? 'border-blue-500 ring-2 ring-blue-500/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            {editingId === account.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                />
                <input
                  type="text"
                  value={editFormData.dmLink}
                  onChange={(e) => setEditFormData({ ...editFormData, dmLink: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(account.id)}
                    className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {account.name}
                  </h3>
                </div>
                <div className="flex items-start gap-2 mb-4">
                  <Link className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 break-all line-clamp-2">
                    {account.dmLink}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(account)}
                    className="flex-1 py-2 px-3 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    編集
                  </button>
                  <button
                    onClick={() => onDelete(account.id)}
                    className="flex-1 py-2 px-3 border border-gray-200 dark:border-gray-600 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    削除
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}