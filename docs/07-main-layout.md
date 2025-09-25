# チケット07: メインレイアウト・ナビゲーション

## 概要
アプリケーション全体のレイアウトとナビゲーション構造の実装

## 目的
- 統一されたUIの提供
- 機能間のスムーズな移動
- レスポンシブ対応

## タスク一覧

### レイアウト実装
- [ ] app/layout.tsx の実装
- [ ] Header.tsx の作成
- [ ] Navigation.tsx の作成
- [ ] Footer.tsx の作成
- [ ] Container.tsx の作成（コンテンツラッパー）

### ナビゲーション
- [ ] タブ切り替えの実装（アカウント管理/ツイート管理）
- [ ] アクティブ状態の表示
- [ ] モバイルメニューの実装

### ページ構成
- [ ] app/page.tsx（メインページ）の実装
- [ ] ErrorBoundary の設定
- [ ] Loading状態の実装

### レスポンシブ対応
- [ ] デスクトップレイアウト
- [ ] タブレットレイアウト
- [ ] モバイルレイアウト
- [ ] ブレークポイントの設定

## 受け入れ条件
- すべてのページで統一されたレイアウトが適用されること
- ナビゲーションが正しく機能すること
- レスポンシブデザインが適用されていること
- ダークモードでも適切に表示されること

## 技術詳細
```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <ThemeProvider>
          <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

// components/Navigation.tsx
export function Navigation() {
  const [activeTab, setActiveTab] = useState<'accounts' | 'tweets'>('tweets');
  
  return (
    <nav className="border-b">
      <div className="flex space-x-8">
        <button
          className={cn(
            'px-4 py-2 border-b-2 transition-colors',
            activeTab === 'accounts' 
              ? 'border-blue-500 text-blue-500' 
              : 'border-transparent'
          )}
          onClick={() => setActiveTab('accounts')}
        >
          アカウント管理
        </button>
        {/* ... */}
      </div>
    </nav>
  );
}
```

## UIデザイン
### ヘッダー
- 高さ: 64px
- 左側: アプリ名/ロゴ
- 右側: ダークモードトグル

### ナビゲーション
- タブスタイル
- アクティブタブは下線とカラー変更
- ホバー時のエフェクト

### メインエリア
- 最大幅: 1280px
- パディング: 32px（デスクトップ）、16px（モバイル）

### フッター
- 高さ: 48px
- コピーライト表示
- バージョン情報

## レスポンシブブレークポイント
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## アクセシビリティ
- キーボードナビゲーション対応
- ARIAラベルの適切な設定
- フォーカス状態の明確な表示

## 備考
- スティッキーヘッダーは実装しない（シンプルに保つ）
- アニメーションは控えめに（0.2-0.3秒）