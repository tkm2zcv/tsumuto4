# ツムツム代行ツイート生成管理システム - 要件定義書

## 1. システム概要

### 1.1 目的
ツムツム代行サービス事業者が、複数のTwitterアカウント（約20個）で使用するツイート文章を効率的に管理・配信するためのWebアプリケーション

### 1.2 解決する課題
- 複数アカウントでの文章重複によるスパム判定リスク
- アカウントごとの異なるDMリンクの手動置換作業
- ツイート使用状況の管理困難
- 各アカウント向けの文章準備の非効率性

## 2. 機能要件

### 2.1 アカウント管理機能
- **登録情報**: アカウントID + 固有のDMリンク
- **操作**: 追加・編集・削除
- **保存先**: ブラウザのローカルストレージ
- **想定数**: 約20アカウント

### 2.2 ツイートインポート機能
- Geminiチャット等で事前生成したツイートの一括取り込み
- **DMリンクの自動置換**: 元のDMリンクのみを選択アカウントのリンクに置換
- フォーマット自動認識（「---」区切り、空行区切り対応）
- 「ツムツム代行」タグの自動補完
- **重複チェック**: インポート時に既存ツイートとの重複を検出し警告表示

### 2.3 ツイート管理機能
- 個別コピーボタン（ワンクリックでクリップボードへ）
- コピー済みチェックボックス（視覚的な使用管理）
- カード形式の見やすい表示

### 2.4 ダークモード機能
- 手動切り替えによるダーク/ライトモード選択
- 設定はローカルストレージに保存

## 3. データ管理仕様

### 3.1 データ保持
- **セッション限定**: ブラウザを閉じた時点で以下のデータをリセット
  - インポートしたツイート
  - コピー済み状態
- **永続保存**: ローカルストレージで保持
  - アカウント情報（ID + DMリンク）
  - ダークモード設定

### 3.2 ツイートフォーマット
```
[絵文字][キャッチコピー1行目]

[2-3行の訴求内容]

[行動喚起]↓
[DMリンク]

ツムツム代行 [その他のハッシュタグ2-4個]
```

## 4. 運用要件

### 4.1 利用規模
- アカウント数: 約20個
- 1日あたりの投稿数: 各アカウント約30ツイート
- 総ツイート数: 1日約600ツイート

### 4.2 利用フロー
1. **事前準備**（週1-2回）
   - Geminiチャット等で500-1000個のツイートを生成
   - 生成結果をテキストファイルやメモに保存

2. **日次運用**（毎日複数回）
   - Webアプリにアクセス
   - 投稿するアカウントを選択
   - 準備済みツイートをテキストエリアに貼り付け
   - 「インポート」ボタンでDMリンクが自動置換
   - 各ツイートを個別にコピーして投稿
   - 使用済みをチェックボックスで管理

## 5. 技術仕様

### 5.1 技術スタック
- **フレームワーク**: Next.js 14+ (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **状態管理**: React Hooks (useState, useEffect)
- **データ永続化**: LocalStorage API / SessionStorage API
- **デプロイ**: Vercel推奨

### 5.2 ディレクトリ構造
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── AccountManager.tsx
│   ├── TweetImporter.tsx
│   ├── TweetCard.tsx
│   └── Navigation.tsx
├── hooks/
│   ├── useLocalStorage.ts
│   ├── useSessionStorage.ts
│   └── useClipboard.ts
├── types/
│   └── index.ts
└── utils/
    ├── tweetParser.ts
    ├── duplicateChecker.ts
    └── storage.ts
```

## 6. 非機能要件

### 6.1 パフォーマンス
- クライアントサイド処理による高速動作
- 外部API不要（Gemini API等は使用しない）

### 6.2 ユーザビリティ
- レスポンシブデザイン（モバイル対応）
- ワンクリックコピー機能
- 視覚的な使用状況管理

### 6.3 セキュリティ
- データはブラウザローカルに保存（サーバー送信なし）
- DMリンクの安全な管理

## 7. 制約事項

### 7.1 機能制約
- 複数端末でのデータ共有は非対応
- 検索・フィルタ機能は実装しない
- 一括コピー機能は実装しない

### 7.2 データ制約
- ツイート・使用状況はセッション限定保存
- アカウント情報のみ永続保存

## 8. 将来の拡張可能性

以下の機能は初期バージョンには含まないが、将来的な実装を検討：
- テンプレート保存機能
- 使用履歴の長期保存
- CSV形式でのエクスポート/インポート
- PWA化によるオフライン完全対応

## 9. 成功指標

- DMリンク置換作業の完全自動化
- ツイート管理時間の50%以上削減
- 誤ったDMリンク使用の完全防止
- スパム判定リスクの最小化

## 10. 開発フェーズ

### Phase 1（MVP）
1. アカウント管理機能
2. ツイートインポート機能（DMリンク置換含む）
3. 基本的なツイート表示・コピー機能
4. 重複チェック機能
5. ダークモード対応

### Phase 2（将来実装）
- 上記「将来の拡張可能性」に記載の機能

## 11. Next.js開発ベストプラクティス

### 11.1 プロジェクト構成
```
src/
├── app/                      # App Router
│   ├── layout.tsx           # ルートレイアウト
│   ├── page.tsx            # ホームページ
│   ├── globals.css         # グローバルスタイル
│   └── api/                # APIルート（必要に応じて）
├── components/
│   ├── ui/                 # 汎用UIコンポーネント
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   └── features/          # 機能別コンポーネント
│       ├── AccountManager.tsx
│       ├── TweetImporter.tsx
│       └── TweetCard.tsx
├── hooks/                  # カスタムフック
├── lib/                    # ユーティリティ関数
├── types/                  # TypeScript型定義
└── constants/             # 定数定義
```

### 11.2 コンポーネント設計

#### Server Components vs Client Components
```typescript
// Server Component（デフォルト）
// app/page.tsx
export default function HomePage() {
  return <MainLayout />;
}

// Client Component（明示的に指定）
// components/features/TweetImporter.tsx
'use client';
import { useState } from 'react';

export function TweetImporter() {
  const [tweets, setTweets] = useState([]);
  // インタラクティブな処理
}
```

#### コンポーネントの責務分離
```typescript
// 表示専用コンポーネント
export function TweetDisplay({ tweet }: { tweet: Tweet }) {
  return <div>{tweet.content}</div>;
}

// ロジック含むコンポーネント
export function TweetManager() {
  const { tweets, addTweet, removeTweet } = useTweets();
  return <TweetList tweets={tweets} onRemove={removeTweet} />;
}
```

### 11.3 状態管理

#### ローカル状態
```typescript
// コンポーネント内で完結する状態
const [isOpen, setIsOpen] = useState(false);
```

#### グローバル状態（Context API）
```typescript
// contexts/ThemeContext.tsx
'use client';
const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### 11.4 パフォーマンス最適化

#### メモ化
```typescript
// useMemo: 計算結果のメモ化
const filteredTweets = useMemo(
  () => tweets.filter(t => !t.used),
  [tweets]
);

// useCallback: 関数のメモ化
const handleCopy = useCallback((text: string) => {
  navigator.clipboard.writeText(text);
}, []);

// React.memo: コンポーネントのメモ化
export const TweetCard = memo(({ tweet }: Props) => {
  return <div>{tweet.content}</div>;
});
```

#### 動的インポート
```typescript
// 重いコンポーネントの遅延読み込み
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false  // クライアントサイドのみ
});
```

### 11.5 TypeScript活用

#### 厳格な型定義
```typescript
// types/index.ts
export interface Tweet {
  id: string;
  content: string;
  dmLink: string | null;
  used: boolean;
  createdAt: Date;
}

export interface Account {
  id: string;
  name: string;
  dmLink: string;
}

// Utility Types活用
export type TweetWithoutId = Omit<Tweet, 'id'>;
export type PartialTweet = Partial<Tweet>;
```

#### 型安全なフック
```typescript
// hooks/useLocalStorage.ts
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // 実装
}
```

### 11.6 エラーハンドリング

#### Error Boundary
```typescript
// app/error.tsx
'use client';
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>エラーが発生しました</h2>
      <button onClick={() => reset()}>再試行</button>
    </div>
  );
}
```

#### Loading States
```typescript
// app/loading.tsx
export default function Loading() {
  return <div>読み込み中...</div>;
}
```

### 11.7 スタイリング（Tailwind CSS）

#### コンポーネント固有のスタイル
```typescript
// Tailwind classesの組み合わせ
import { cn } from '@/lib/utils';

export function Button({ className, variant, ...props }) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-md font-medium transition-colors',
        {
          'bg-blue-500 text-white hover:bg-blue-600': variant === 'primary',
          'bg-gray-200 text-gray-800 hover:bg-gray-300': variant === 'secondary',
        },
        className
      )}
      {...props}
    />
  );
}
```

### 11.8 データフェッチング

#### クライアントサイド
```typescript
// hooks/useTweets.ts
export function useTweets() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTweets = useCallback(async () => {
    setLoading(true);
    try {
      // データ取得処理
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { tweets, loading, error, fetchTweets };
}
```

### 11.9 ベストプラクティスまとめ

1. **'use client'は必要最小限に**: Server Componentsをデフォルトとし、インタラクティブな部分のみClient Componentに
2. **コンポーネントは小さく保つ**: 単一責任の原則に従う
3. **カスタムフックで再利用**: ロジックをフックに切り出す
4. **型安全性を重視**: anyを避け、明確な型定義を行う
5. **メモ化は適切に**: パフォーマンス問題が実際にある場合のみ使用
6. **エラー処理を忘れない**: Error BoundaryとtryーcatchでUXを向上
7. **アクセシビリティ**: ARIA属性、キーボードナビゲーション対応
8. **セマンティックHTML**: 適切なHTMLタグを使用

### 11.10 コード規約

#### 命名規則
- コンポーネント: PascalCase（`TweetCard`）
- フック: camelCaseでuseプレフィックス（`useTweets`）
- ユーティリティ関数: camelCase（`parseTweet`）
- 定数: UPPER_SNAKE_CASE（`MAX_TWEET_LENGTH`）
- 型/インターフェース: PascalCase（`Tweet`, `AccountProps`）

#### ファイル構成
- 1ファイル1コンポーネント/機能
- indexファイルは再エクスポートのみ
- 関連するテストは同階層に配置

## 12. チケット管理ルール

### 12.1 チケットファイル構成
- 場所: `/docs` ディレクトリ配下
- 命名規則: `[連番]-[機能名].md` （例: `01-initial-setup.md`）
- フォーマット: Markdown形式

### 12.2 タスク進捗管理
各チケットファイル内のタスクは以下の形式で管理：
- `- [ ]` : 未完了タスク
- `- [x]` : 完了タスク

### 12.3 チケット一覧
1. **01-initial-setup.md** - 初期プロジェクトセットアップ
2. **02-account-management.md** - アカウント管理機能
3. **03-tweet-import.md** - ツイートインポート機能
4. **04-tweet-management.md** - ツイート管理・表示機能
5. **05-dark-mode.md** - ダークモード実装
6. **06-duplicate-check.md** - 重複チェック機能
7. **07-main-layout.md** - メインレイアウト・ナビゲーション
8. **08-testing-deployment.md** - テスト・デプロイ

### 12.4 作業フロー
1. チケットを選択して作業開始
2. タスクを完了したら `- [ ]` を `- [x]` に変更
3. すべてのタスクが完了したらチケットをクローズ
4. 必要に応じて新しいチケットを作成

### 12.5 優先順位
Phase 1（MVP）として以下の順序で実装：
1. 初期セットアップ（チケット01）
2. アカウント管理（チケット02）
3. ツイートインポート（チケット03）
4. ツイート管理（チケット04）
5. 重複チェック（チケット06）
6. ダークモード（チケット05）
7. レイアウト統合（チケット07）
8. テスト・デプロイ（チケット08）