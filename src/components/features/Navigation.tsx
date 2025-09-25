'use client'

import { Home, Users, FileText } from 'lucide-react'

type Tab = 'home' | 'accounts' | 'tweets'

interface NavigationProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'home' as Tab, label: 'ホーム', icon: Home },
    { id: 'accounts' as Tab, label: 'アカウント', icon: Users },
    { id: 'tweets' as Tab, label: 'ツイート', icon: FileText },
  ]

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-10">
      <div className="container mx-auto px-6">
        <div className="flex gap-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  py-4 px-1 border-b-2 transition-colors flex items-center gap-2
                  ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                      : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}