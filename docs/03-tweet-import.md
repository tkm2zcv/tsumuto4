# チケット03: ツイートインポート機能

## 概要
Geminiチャットで生成したツイート文章の一括インポートとDMリンク自動置換機能の実装

## 目的
- 大量のツイート文章を一括でインポート
- 選択したアカウントのDMリンクに自動置換
- 重複チェックによるスパム対策
- 「ツムツム代行」タグの自動補完

## タスク一覧

### 型定義
- [ ] Tweet型の定義
- [ ] ImportResult型の定義（成功・エラー情報）

### コンポーネント開発
- [ ] TweetImporter.tsx の作成
- [ ] ImportTextArea.tsx（入力エリア）の作成
- [ ] AccountSelector.tsx（アカウント選択）の作成
- [ ] ImportPreview.tsx（プレビュー表示）の作成
- [ ] DuplicateWarning.tsx（重複警告）の作成

### ユーティリティ関数
- [ ] tweetParser.ts の実装（ツイート分割ロジック）
- [ ] dmLinkReplacer.ts の実装（DMリンク置換）
- [ ] duplicateChecker.ts の実装（重複検出）
- [ ] hashtagCompleter.ts の実装（タグ補完）

### 機能実装
- [ ] テキストエリアからの入力受付
- [ ] 「---」区切りでのツイート分割
- [ ] 空行区切りでのツイート分割（フォールバック）
- [ ] DMリンクの検出と置換（正規表現）
- [ ] 「ツムツム代行」タグの自動追加（存在しない場合）
- [ ] 重複チェックと警告表示
- [ ] インポート結果のサマリー表示

### セッション管理
- [ ] useSessionStorage フックの実装
- [ ] インポートしたツイートのセッション保存

## 受け入れ条件
- 複数のツイートを一括でインポートできること
- DMリンクが正しく置換されること
- 重複ツイートが検出され警告が表示されること
- 「ツムツム代行」タグが自動補完されること
- インポート後にツイート一覧が表示されること

## 技術詳細
```typescript
// types/index.ts
export interface Tweet {
  id: string;
  content: string;
  originalContent: string;
  dmLink: string | null;
  hashedTags: string[];
  accountId: string | null;
  used: boolean;
  createdAt: Date;
}

// utils/tweetParser.ts
export function parseTweets(text: string): string[] {
  // 「---」で分割、なければ空行で分割
}

// utils/dmLinkReplacer.ts
const DM_LINK_REGEX = /https:\/\/x\.com\/messages\/[^\s]+/g;
export function replaceDMLink(content: string, newLink: string): string {
  // DMリンクを検出して置換
}
```

## UIデザイン
- 大きなテキストエリア（高さ300px以上）
- アカウント選択はドロップダウン
- インポートボタンは目立つデザイン
- 重複警告はモーダルまたはトースト表示

## 備考
- DMリンク以外のURLは置換しない
- 元のツイート内容も保持（originalContent）
- パフォーマンスを考慮し、1000件程度まで対応