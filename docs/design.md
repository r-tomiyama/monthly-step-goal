# Monthly Step Goal - Design Document

## 1. 概要

### 1.1 アプリケーション概要

Google Fit APIを使用して歩数データを取得し、月間の歩数目標を管理するWebアプリケーション。ユーザーは1日の歩数目標を設定し、その値に基づいて自動計算される月間目標の達成状況を確認できる。

### 1.2 主要機能

- Googleアカウントでのログイン
- Google Fit APIとの連携による歩数データの自動取得
- 1日の歩数目標設定
- 月間歩数目標の自動計算（1日の目標 × 月の日数）
- リアルタイムの進捗表示
- 目標達成時の通知

## 2. 技術スタック

### 2.1 フロントエンド

- **React**
- **TypeScript** - 型安全性の確保
- **React Router** - ルーティング管理
- **Material-UI (MUI)** - UIコンポーネントライブラリ
- **React Query** - APIデータのキャッシュと同期
- **Recharts** - グラフ表示用ライブラリ

### 2.2 バックエンド/データベース

- **Firebase Authentication** - 認証管理
- **Cloud Firestore** - NoSQLデータベース
- **Firebase SDK** - Firebaseサービスとの統合

### 2.3 状態管理

- **Zustand** - グローバル状態管理（軽量で使いやすい）
- **React Context** - 認証状態の管理

### 2.4 開発ツール

- **Vite** - 高速な開発サーバーとビルドツール
- **Biome** - コード品質管理
- **Prettier** - コードフォーマッター

## 3. アーキテクチャ

### 3.1 全体構成

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│                 │     │                  │     │                 │
│   React App     │────▶│Firebase Auth +   │────▶│ Google Fit API  │
│                 │     │ Google OAuth2    │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                         │
        │                         │
        ▼                         ▼
┌─────────────────┐     ┌──────────────────┐
│                 │     │                  │
│  React Query    │     │ Cloud Firestore  │
│ (メモリキャッシュ) │     │  (永続化データ)   │
└─────────────────┘     └──────────────────┘
```

### 3.2 ディレクトリ構造

```
monthly-step-goal/
├── src/
│   ├── components/       # UIコンポーネント
│   │   ├── common/      # 共通コンポーネント
│   │   ├── auth/        # 認証関連
│   │   ├── dashboard/   # ダッシュボード
│   │   └── settings/    # 設定画面
│   ├── hooks/           # カスタムフック
│   ├── services/        # API通信ロジック
│   ├── stores/          # Zustandストア
│   ├── model/           # model定義
│   ├── utils/           # ユーティリティ関数
│   └── App.tsx
├── public/
└── docs/
```

## 4. 認証フロー

### 4.1 Firebase Authentication + Google OAuth2認証フロー

1. ユーザーがログインボタンをクリック
2. Firebase AuthのsignInWithPopup/signInWithRedirectを呼び出し
3. Googleアカウント選択画面が表示される
4. ユーザーが権限を承認（Google Fit APIアクセス権限を含む）
5. Firebase Authがユーザー情報を自動的に作成/更新
6. 認証成功後、Google Fit APIのアクセストークンを取得
7. Firestoreにユーザー情報を保存/更新
8. アプリケーションにリダイレクト

### 4.2 必要なスコープ

```
https://www.googleapis.com/auth/fitness.activity.read
```

## 5. セキュリティ考慮事項

### 5.1 Firebase Authentication

- Googleプロバイダーを使用した安全な認証
- Firebaseが管理するセッショントークン
- 自動的なトークンリフレッシュ

### 5.2 Firestore セキュリティルール

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザーは自分のデータのみアクセス可能
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // サブコレクション
      match /monthlyGoals/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### 5.3 APIキーの管理

- Firebase設定は環境変数で管理（.env.local）
- Google Cloud ConsoleでAPIキーの制限設定

## 6. パフォーマンス最適化

### 6.1 データキャッシング

- React Queryによる自動キャッシュ
- Firestoreのオフライン永続化機能
- 歩数データは5分間キャッシュ
- オフライン対応（Firebase SDK内蔵）

### 6.2 遅延読み込み

- React.lazyによるコード分割
- 画像の遅延読み込み

### 6.3 Firestoreの最適化

- 複合クエリのインデックス作成
- データの非正規化による読み取り回数削減
- バッチ書き込みの活用

## 7. 今後の拡張可能性

- 他のフィットネスデータ（カロリー、距離）の追加
- 週間・年間目標の設定
- エクスポート機能（CSV、PDF）
- プッシュ通知（PWA化）
