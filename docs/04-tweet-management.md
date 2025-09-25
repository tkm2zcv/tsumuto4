# チケット04: ツイート管理・表示機能

## 概要
インポートされたツイートの表示、個別コピー、使用状況管理機能の実装

## 目的
- ツイートをカード形式で見やすく表示
- ワンクリックでクリップボードにコピー
- 使用済みツイートの視覚的管理
- 効率的なツイート選択と利用

## タスク一覧

### コンポーネント開発
- [ ] TweetList.tsx の作成（一覧表示）
- [ ] TweetCard.tsx の作成（個別カード）
- [ ] CopyButton.tsx の作成（コピーボタン）
- [ ] UsedCheckbox.tsx の作成（使用済みチェック）
- [ ] TweetStats.tsx の作成（統計情報表示）

### カスタムフック
- [ ] useClipboard フックの実装
- [ ] useTweets フックの実装（状態管理）
- [ ] useTweetFilter フックの実装（フィルタリング）

### 機能実装
- [ ] ツイートのカード表示
- [ ] クリップボードへのコピー機能
- [ ] コピー成功時のフィードバック（トースト/アニメーション）
- [ ] 使用済みチェックボックスの状態管理
- [ ] 使用済み/未使用のフィルタリング
- [ ] ツイート数の統計表示（全体/使用済み/未使用）

### UI/UX
- [ ] カードのホバーエフェクト
- [ ] コピーボタンのアニメーション
- [ ] チェックボックスのスタイリング
- [ ] レスポンシブグリッドレイアウト
- [ ] スクロール可能なリスト表示

### セッション管理
- [ ] 使用済み状態のセッション保存
- [ ] ページリロード時の状態復元

## 受け入れ条件
- ツイートがカード形式で表示されること
- コピーボタンでクリップボードにコピーできること
- 使用済みチェックが機能すること
- 統計情報が正しく表示されること
- レスポンシブデザインが適用されていること

## 技術詳細
```typescript
// components/features/TweetCard.tsx
interface TweetCardProps {
  tweet: Tweet;
  onCopy: (id: string) => void;
  onToggleUsed: (id: string) => void;
}

// hooks/useClipboard.ts
export function useClipboard() {
  const [copied, setCopied] = useState(false);
  
  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return { copy, copied };
}
```

## UIデザイン
- カードサイズ: 最小幅300px、最大幅400px
- グリッドレイアウト: 1-4列（画面幅に応じて）
- カード内要素:
  - ツイート本文（最大5行表示、それ以上はスクロール）
  - コピーボタン（右上配置）
  - 使用済みチェックボックス（左上配置）
  - 文字数表示（右下配置）

## パフォーマンス考慮
- 仮想スクロールの実装（500件以上の場合）
- React.memoによるカードの再レンダリング最適化
- useCallbackによるイベントハンドラの最適化

## 備考
- コピー機能はHTTPS環境でのみ動作
- 使用済み状態はセッション限定（ブラウザを閉じるとリセット）