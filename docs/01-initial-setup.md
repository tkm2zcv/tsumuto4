# チケット01: 初期プロジェクトセットアップ

## 概要
Next.js 14 (App Router)を使用したプロジェクトの初期セットアップとプロジェクト構造の作成

## 目的
- 開発環境の構築
- プロジェクトの基盤作成
- 必要なパッケージのインストール

## タスク一覧

### 環境構築
- [ ] Next.js 14プロジェクトの作成（TypeScript, Tailwind CSS, App Router）
- [ ] 必要なnpmパッケージのインストール
- [ ] ESLint, Prettierの設定
- [ ] Git リポジトリの初期化

### プロジェクト構造
- [ ] src/app ディレクトリ構成の作成
- [ ] src/components ディレクトリ構成の作成
- [ ] src/hooks ディレクトリの作成
- [ ] src/lib ディレクトリの作成
- [ ] src/types ディレクトリの作成
- [ ] src/constants ディレクトリの作成

### 基本設定
- [ ] tsconfig.json のパス設定
- [ ] tailwind.config.ts の設定
- [ ] グローバルCSSの初期設定
- [ ] 環境変数ファイル（.env.local）の作成

## 受け入れ条件
- `npm run dev` でローカル開発サーバーが起動すること
- TypeScriptの型チェックがエラーなく通ること
- 基本的なディレクトリ構造が作成されていること

## 技術詳細
```bash
# プロジェクト作成コマンド
npx create-next-app@latest tsumuto777 --typescript --tailwind --app --src-dir --import-alias "@/*"

# 追加パッケージ
npm install clsx
```

## 備考
- Node.js v18以上が必要
- VercelへのデプロイはPhase 1完了後に実施