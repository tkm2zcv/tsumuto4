# チケット08: テスト・デプロイ

## 概要
アプリケーションの品質保証とVercelへのデプロイ

## 目的
- 機能の動作確認
- バグの早期発見
- 本番環境へのデプロイ

## タスク一覧

### ユニットテスト
- [ ] ユーティリティ関数のテスト作成
- [ ] カスタムフックのテスト作成
- [ ] tweetParser.tsのテスト
- [ ] duplicateChecker.tsのテスト
- [ ] dmLinkReplacer.tsのテスト

### 統合テスト
- [ ] アカウント管理機能のE2Eテスト
- [ ] ツイートインポート機能のE2Eテスト
- [ ] ツイート管理機能のE2Eテスト
- [ ] ダークモード切り替えのテスト

### パフォーマンステスト
- [ ] 1000件のツイートインポート
- [ ] レンダリングパフォーマンス測定
- [ ] メモリ使用量の確認

### ブラウザテスト
- [ ] Chrome での動作確認
- [ ] Firefox での動作確認
- [ ] Safari での動作確認
- [ ] Edge での動作確認
- [ ] モバイルブラウザでの動作確認

### デプロイ準備
- [ ] 環境変数の設定
- [ ] ビルドエラーの解消
- [ ] TypeScriptエラーの解消
- [ ] ESLintエラーの解消

### Vercelデプロイ
- [ ] Vercelアカウントとの連携
- [ ] デプロイ設定
- [ ] カスタムドメイン設定（必要に応じて）
- [ ] 本番環境での動作確認

## 受け入れ条件
- すべてのテストが成功すること
- ビルドエラーがないこと
- Vercelで正常に動作すること
- パフォーマンスが要件を満たすこと

## テストケース例
```typescript
// __tests__/utils/tweetParser.test.ts
describe('tweetParser', () => {
  it('should split tweets by --- delimiter', () => {
    const input = 'tweet1\n---\ntweet2\n---\ntweet3';
    const result = parseTweets(input);
    expect(result).toHaveLength(3);
  });
  
  it('should fallback to empty line split', () => {
    const input = 'tweet1\n\ntweet2\n\ntweet3';
    const result = parseTweets(input);
    expect(result).toHaveLength(3);
  });
});

// __tests__/utils/duplicateChecker.test.ts
describe('duplicateChecker', () => {
  it('should detect exact duplicates', () => {
    const existing = [{ content: 'test tweet' }];
    const newTweets = ['test tweet'];
    const result = checkDuplicates(newTweets, existing);
    expect(result.hasDuplicates).toBe(true);
  });
});
```

## パフォーマンス目標
- 初回ロード: 3秒以内
- ツイートインポート（1000件）: 2秒以内
- ツイートリスト表示（500件）: 1秒以内
- メモリ使用量: 100MB以下

## デプロイチェックリスト
- [ ] ローカルでのビルド成功
- [ ] 全テストの成功
- [ ] セキュリティ脆弱性のチェック
- [ ] アクセシビリティのチェック
- [ ] SEOメタタグの設定
- [ ] favicon の設定
- [ ] OGP画像の設定

## Vercel設定
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["hnd1"]
}
```

## 備考
- CI/CDパイプラインは将来的に検討
- モニタリング設定は別途検討
- エラートラッキングは将来実装