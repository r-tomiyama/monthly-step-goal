# コーディングガイドライン

## 概要

このドキュメントは、月間歩数目標管理アプリの開発において統一されたコーディングスタイルとベストプラクティスを定義します。

※このガイドラインは、プロジェクトの成長に合わせて継続的に更新されます。新しいパターンや重要な決定事項があれば、該当するセクションを更新してください。

## 全体方針

### 基本原則

1. **一貫性**: プロジェクト全体で統一されたスタイルを維持
2. **可読性**: コードの意図が明確に伝わるよう記述
3. **保守性**: 将来の変更や拡張に対応しやすい構造
4. **型安全性**: TypeScript の機能を最大限活用し、実行時エラーを防ぐ

## ディレクトリ別ガイドライン

各ディレクトリの詳細なガイドラインは以下を参照してください：

- [components/](./components.md) - UIコンポーネントの実装方針
- [config/](./config.md) - 設定ファイルの管理方針  
- [hooks/](./hooks.md) - カスタムフックの実装方針
- [lib/](./lib.md) - ライブラリクライアントの設定方針
- [services/](./services.md) - 外部やAPI通信の実装方針

## コーディング規約

### エクスポート方針

**特別な理由がない限り、名前付きエクスポートを使用する**

```typescript
// ✅ 推奨: 名前付きエクスポート
export const MainLayout = ({ user, onLogout, children }: MainLayoutProps) => {
  // 実装
};
```

```typescript
// ❌ 避ける: デフォルトエクスポート（特別な理由がない限り）
export default function MainLayout({ user, onLogout, children }) {
  // 実装
}
```

#### 名前付きエクスポートを使用する理由

1. **リファクタリングの安全性**: IDE でのリネームが確実に動作
2. **インポート時の一貫性**: ファイル間で同じ名前が使用される
3. **Tree Shaking の最適化**: 未使用の関数を確実に除去
4. **IDE のサポート**: オートコンプリートや検索が正確に機能

#### デフォルトエクスポートを許可する例外

- React のページコンポーネントでルーターライブラリが要求する場合
- サードパーティライブラリとの互換性が必要な場合
- プロジェクト固有の技術的制約がある場合

### 型の使用

- any 型の使用は最小限に抑える
- 型アサーションは最小限に抑える
- 関数定義時は、引数と戻り値の型を明示的に指定する

### インポート順序

1. React 関連ライブラリ
2. 外部ライブラリ (Material-UI, Firebase など)
3. 内部モジュール（絶対パス順）
4. 相対パス（近い順）

```typescript
import { type ReactNode } from 'react';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import type { User } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useStepsQuery } from '../hooks/useStepsQuery';
import { MainLayout } from './MainLayout';
```

#### 変数・関数

```typescript
// ✅ 関数名: 動詞 + 名詞
const fetchTodaySteps = async () => {};
const storeAccessToken = (token: string) => {};

// ✅ 変数名: 名詞
const accessToken = 'token';
const userSteps = 1000;

// ✅ Boolean: is/has/can + 形容詞
const isLoading = false;
const hasError = true;
const canAccess = false;

// ✅ カスタムフック: use + 機能名
const useStepsQuery = () => {};
const useAuthState = () => {};
```

### エラーハンドリング

```typescript
// ✅ 適切なエラーメッセージ
if (!user) {
  throw new Error('User not authenticated');
}

// ✅ エラーの再スロー（ログ出力後）
try {
  const data = await apiCall();
  return data;
} catch (error) {
  console.error('API call failed:', error);
  throw error; // 呼び出し元でハンドリング
}

// ✅ カスタムエラー（必要に応じて）
class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}
```

### React コンポーネント

```typescript
// ✅ 関数コンポーネントの推奨形式
export const MainLayout = ({ user, onLogout, children }: MainLayoutProps) => {
  // Early return パターン
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* JSX */}
    </Box>
  );
};
```

ロジックはコンポーネントの外に分離する。

## パフォーマンス考慮事項

### バンドルサイズ

```typescript
// ✅ 名前付きインポートを使用
import { Button, Card } from '@mui/material';

// ❌ デフォルトインポートは避ける
import * as MUI from '@mui/material';
```

## セキュリティ

### 環境変数

```typescript
// ✅ 環境変数の使用
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
};

// ❌ 直接埋め込みは禁止
const config = {
  apiKey: 'actual-api-key-value',
};
```

### トークン管理

```typescript
// ✅ セッションストレージの使用（自動削除）
sessionStorage.setItem(TOKEN_STORAGE_KEY, accessToken);

// ✅ 有効期限の設定
const expiry = Date.now() + 50 * 60 * 1000; // 50分
```
