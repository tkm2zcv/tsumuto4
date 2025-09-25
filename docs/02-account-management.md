# チケット02: アカウント管理機能

## 概要
Twitterアカウント情報（ID + DMリンク）の登録・編集・削除機能の実装

## 目的
- 約20個のアカウント情報を管理
- 各アカウントに固有のDMリンクを紐付け
- ローカルストレージでデータを永続化

## タスク一覧

### 型定義
- [ ] Account型の定義（types/index.ts）
- [ ] AccountFormData型の定義

### コンポーネント開発
- [ ] AccountManager.tsx の作成
- [ ] AccountForm.tsx（追加・編集フォーム）の作成
- [ ] AccountList.tsx（一覧表示）の作成
- [ ] AccountItem.tsx（個別アカウント表示）の作成

### カスタムフック
- [ ] useLocalStorage フックの実装
- [ ] useAccounts フックの実装（CRUD操作）

### 機能実装
- [ ] アカウント追加機能
- [ ] アカウント編集機能
- [ ] アカウント削除機能
- [ ] バリデーション（DMリンクのURL形式チェック）
- [ ] 削除確認ダイアログ

### UI/UX
- [ ] レスポンシブデザインの実装
- [ ] フォームのエラー表示
- [ ] 成功メッセージの表示
- [ ] ローディング状態の表示

## 受け入れ条件
- アカウントの追加・編集・削除が正常に動作すること
- ローカルストレージにデータが保存されること
- ブラウザをリロードしてもデータが保持されること
- DMリンクのバリデーションが機能すること

## 技術詳細
```typescript
// types/index.ts
export interface Account {
  id: string;
  name: string;
  dmLink: string;
  createdAt: Date;
  updatedAt: Date;
}

// hooks/useLocalStorage.ts
export function useLocalStorage<T>(key: string, initialValue: T) {
  // 実装
}
```

## UIデザイン
- カード形式でアカウント一覧を表示
- 編集・削除ボタンは各カードに配置
- 追加ボタンは画面上部に固定

## 備考
- DMリンクの形式: `https://x.com/messages/compose?recipient_id=xxx`
- アカウント名は重複可能
- IDは自動生成（UUID使用）