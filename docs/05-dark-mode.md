# チケット05: ダークモード実装

## 概要
アプリケーション全体のダークモード/ライトモード切り替え機能の実装

## 目的
- 目の疲労軽減
- ユーザーの好みに応じた表示切り替え
- 設定の永続化

## タスク一覧

### Context設定
- [ ] ThemeContext.tsx の作成
- [ ] ThemeProvider の実装
- [ ] useTheme フックの作成

### コンポーネント開発
- [ ] ThemeToggle.tsx の作成（切り替えボタン）
- [ ] ThemeIcon.tsx の作成（太陽/月アイコン）

### スタイリング
- [ ] Tailwind CSS dark: プレフィックスの設定
- [ ] カラーパレットの定義（CSS変数）
- [ ] 各コンポーネントのダークモード対応

### 機能実装
- [ ] テーマ切り替えロジック
- [ ] ローカルストレージへの保存
- [ ] 初回読み込み時のテーマ適用
- [ ] スムーズな切り替えトランジション

### UI更新
- [ ] 背景色の切り替え
- [ ] テキストカラーの切り替え
- [ ] ボーダー・シャドウの調整
- [ ] フォームエレメントのスタイル調整

## 受け入れ条件
- ダークモード/ライトモードの切り替えが動作すること
- 設定がローカルストレージに保存されること
- ページリロード後も設定が維持されること
- すべてのコンポーネントが両モードで見やすいこと

## 技術詳細
```typescript
// contexts/ThemeContext.tsx
'use client';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark';
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle('dark', saved === 'dark');
    }
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

## カラーパレット
```css
/* globals.css */
:root {
  --background: #ffffff;
  --foreground: #171717;
  --card: #ffffff;
  --card-foreground: #171717;
  --border: #e5e7eb;
}

.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
  --card: #171717;
  --card-foreground: #ededed;
  --border: #27272a;
}
```

## UIデザイン
- 切り替えボタンは画面右上に固定
- アイコン: ライトモード時は月、ダークモード時は太陽
- トランジション: 0.3秒のease-in-out
- ホバー時にアイコンが回転

## 備考
- システム設定との連動は今回は実装しない（手動切り替えのみ）
- アクセシビリティ: prefers-reduced-motionを考慮
- コントラスト比はWCAG AA基準を満たす