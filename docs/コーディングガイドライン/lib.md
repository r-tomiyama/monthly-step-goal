# Lib ディレクトリ ガイドライン

## 概要

`src/lib/` ディレクトリは外部ライブラリの設定とクライアント初期化を管理します。ライブラリ固有の設定を一箇所に集約し、アプリケーション全体で一貫した設定を提供します。

## 役割

- React Query クライアントの設定と初期化
- その他のライブラリクライアントの設定管理
- ライブラリのデフォルト設定のカスタマイズ

## 実装パターン

### React Query クライアント設定

#### 基本構造

```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,       // 5分間はデータを新鮮と見なす
      retry: 3,                        // 失敗時に3回まで再試行
      refetchOnWindowFocus: false,     // ウィンドウフォーカス時の自動リフェッチを無効
    },
  },
});
```

## ガイドライン

### 設定値の基準

#### データ更新頻度

```typescript
staleTime: 1000 * 60 * 5  // 5分
```

- 歩数データは頻繁に変わらないため、5分間キャッシュを有効活用
- ユーザー体験とAPI呼び出し頻度のバランスを考慮

#### エラー処理

```typescript
retry: 3
```

- ネットワークエラーや一時的な API エラーに対して適切な再試行回数を設定
- 3回で失敗した場合は、明確にエラー状態を表示

#### UI/UX 設定

```typescript
refetchOnWindowFocus: false
```

- ユーザーが他のタブから戻った際の自動リフェッチを無効化
- 歩数アプリの特性上、頻繁な自動更新は不要

## 設定項目の詳細

### クエリ設定 (queries)

#### staleTime（データの有効期間）

```typescript
staleTime: 1000 * 60 * 5  // 5分間
```

- データが「古い」と判断されるまでの時間
- この期間内は自動的なリフェッチを行わない
- 歩数データの特性に合わせて適切な値を設定

#### retry（再試行回数）

```typescript
retry: 3
```

- クエリが失敗した際の再試行回数
- Google Fit API の一時的なエラーに対応
- 過度な再試行はパフォーマンスに影響するため適切な回数を設定

#### refetchOnWindowFocus（フォーカス時のリフェッチ）

```typescript
refetchOnWindowFocus: false
```

- ブラウザタブがアクティブになった際の自動リフェッチを制御
- 歩数データは頻繁に変わらないため無効化
- ユーザーの意図しないデータ更新を防ぐ

### 今後の拡張可能な設定

#### ミューテーション設定

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 既存の設定
    },
    mutations: {
      retry: 1,                    // 更新処理の再試行は1回のみ
      onError: (error) => {        // 共通エラーハンドリング
        console.error('Mutation error:', error);
      },
    },
  },
});
```

#### 開発環境での設定

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: import.meta.env.DEV ? 0 : 1000 * 60 * 5,  // 開発時は常に最新データ
      retry: import.meta.env.DEV ? 1 : 3,                  // 開発時はリトライ回数を削減
      refetchOnWindowFocus: false,
    },
  },
});
```

## 他のライブラリ設定の追加

### 新しいライブラリクライアントの追加時

```typescript
// 例: HTTP クライアントの設定
import axios from 'axios';

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// レスポンスインターセプターでエラーハンドリング
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('HTTP Error:', error);
    return Promise.reject(error);
  }
);
```

### ファイル分割の基準

- ライブラリごとに個別ファイルを作成
- `queryClient.ts`, `httpClient.ts`, `firebaseClient.ts` など
- 各ファイルから `index.ts` で再エクスポート

## パフォーマンス考慮事項

### メモリ管理

```typescript
// 不要になったクエリのガベージコレクション設定
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 30,  // 30分後にメモリから削除
    },
  },
});
```

### バックグラウンド更新

```typescript
refetchOnWindowFocus: false,     // ユーザー体験を優先
refetchOnReconnect: true,        // ネットワーク復旧時は更新
```

## デバッグとテスト

### 開発時のデバッグ設定

```typescript
// React Query Devtools との統合を考慮した設定
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // デバッグしやすい設定値
    },
  },
});
```

### テスト環境での設定

```typescript
// テスト用のクライアント設定
export const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,      // テストでは再試行しない
      staleTime: 0,      // 常に最新データを要求
    },
  },
});
```
