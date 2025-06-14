# Monthly Step Goal

Google Fit APIを使用して月間の歩数目標を管理するWebアプリケーション

## セットアップ

1. 依存関係のインストール

```bash
npm ci
```

2. 環境変数の設定
`.env.example`を`.env`にコピーし、Firebaseの設定値を入力してください。

```bash
cp .env.example .env
```

3. Firebaseプロジェクトの設定

- [Firebase Console](https://console.firebase.google.com/)でプロジェクトを作成
- Authenticationを有効化し、Googleプロバイダーを設定
- Firestoreを有効化

4. 開発サーバーの起動

```bash
npm run dev
```

## 技術スタック

- React + TypeScript
- Vite
- Firebase (Authentication, Firestore)
- Material-UI
- Google Fit API

## ドキュメント

詳細な設計については`docs`ディレクトリを参照してください。
