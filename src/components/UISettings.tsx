'use client'

import { Palette, Sliders, Gauge, X, Maximize2 } from 'lucide-react'

interface UISettingsProps {
  onClose: () => void
  cardSize: 'small' | 'medium' | 'large'
  onCardSizeChange: (size: 'small' | 'medium' | 'large') => void
  animationSpeed: 'slow' | 'normal' | 'fast' | 'none'
  onAnimationSpeedChange: (speed: 'slow' | 'normal' | 'fast' | 'none') => void
  colorTheme: 'default' | 'blue' | 'purple' | 'orange'
  onColorThemeChange: (theme: 'default' | 'blue' | 'purple' | 'orange') => void
}

export function UISettings({
  onClose,
  cardSize,
  onCardSizeChange,
  animationSpeed,
  onAnimationSpeedChange,
  colorTheme,
  onColorThemeChange
}: UISettingsProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={onClose}>
      <div
        className="max-w-md w-full mx-4 rounded-lg shadow-xl p-6 bg-gray-900 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Sliders className="h-5 w-5" />
            UI設定
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* カードサイズ */}
          <div>
            <label className="block text-sm font-medium mb-3 flex items-center gap-2">
              <Maximize2 className="h-4 w-4" />
              カードサイズ
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => onCardSizeChange('small')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm transition-colors ${
                  cardSize === 'small'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                小
              </button>
              <button
                onClick={() => onCardSizeChange('medium')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm transition-colors ${
                  cardSize === 'medium'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                中
              </button>
              <button
                onClick={() => onCardSizeChange('large')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm transition-colors ${
                  cardSize === 'large'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                大
              </button>
            </div>
          </div>

          {/* アニメーション速度 */}
          <div>
            <label className="block text-sm font-medium mb-3 flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              アニメーション速度
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onAnimationSpeedChange('none')}
                className={`py-2 px-3 rounded-lg text-sm transition-colors ${
                  animationSpeed === 'none'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                なし
              </button>
              <button
                onClick={() => onAnimationSpeedChange('slow')}
                className={`py-2 px-3 rounded-lg text-sm transition-colors ${
                  animationSpeed === 'slow'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                ゆっくり
              </button>
              <button
                onClick={() => onAnimationSpeedChange('normal')}
                className={`py-2 px-3 rounded-lg text-sm transition-colors ${
                  animationSpeed === 'normal'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                通常
              </button>
              <button
                onClick={() => onAnimationSpeedChange('fast')}
                className={`py-2 px-3 rounded-lg text-sm transition-colors ${
                  animationSpeed === 'fast'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                速い
              </button>
            </div>
          </div>

          {/* カラーテーマ */}
          <div>
            <label className="block text-sm font-medium mb-3 flex items-center gap-2">
              <Palette className="h-4 w-4" />
              アクセントカラー
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onColorThemeChange('default')}
                className={`py-2 px-3 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                  colorTheme === 'default'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                緑（デフォルト）
              </button>
              <button
                onClick={() => onColorThemeChange('blue')}
                className={`py-2 px-3 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                  colorTheme === 'blue'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
                青
              </button>
              <button
                onClick={() => onColorThemeChange('purple')}
                className={`py-2 px-3 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                  colorTheme === 'purple'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="w-4 h-4 bg-purple-500 rounded-full"></span>
                紫
              </button>
              <button
                onClick={() => onColorThemeChange('orange')}
                className={`py-2 px-3 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                  colorTheme === 'orange'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="w-4 h-4 bg-orange-500 rounded-full"></span>
                オレンジ
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-2 rounded-lg font-medium bg-gray-800 hover:bg-gray-700 text-white"
        >
          閉じる
        </button>
      </div>
    </div>
  )
}