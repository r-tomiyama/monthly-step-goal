# Components ディレクトリ コーディングガイドライン

## 概要

`src/components/` ディレクトリは UI コンポーネントを管理します。以下の3つのサブディレクトリに分類されます。

## ディレクトリ構造

```
components/
├── layouts/     # レイアウトコンポーネント
├── pages/       # ページコンポーネント  
└── ui/          # 共通UIコンポーネント
```

## 共通ガイドライン

### スタイリング

- Material-UI の `sx` プロパティを基本とする
- 一貫したスペーシング（`mb: 2`, `p: 3` など）を使用
- カラーパレットはテーマ定義を使用（`primary.main`, `error.main` など）

## layouts/ ディレクトリ

### 役割

- アプリケーション全体のレイアウト構造を定義
- ヘッダー、フッター、ナビゲーションなどの共通レイアウト要素

### 命名規則

- `{名前}Layout.tsx` の形式
- 例: `MainLayout.tsx`

### 実装パターン

```typescript
interface MainLayoutProps {
  user: User;
  onLogout: () => void;
  children: ReactNode;
}

export const MainLayout = ({ user, onLogout, children }: MainLayoutProps) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* レイアウト構造 */}
      <AppBar position="static">
        {/* ヘッダー内容 */}
      </AppBar>
      <Box component="main" sx={{ p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};
```

### ガイドライン

- `children` プロパティを必須とし、レイアウト内にコンテンツを配置
- Material-UI の `Box` コンポーネントを基本構造として使用
- スタイリングは `sx` プロパティを使用

## pages/ ディレクトリ

### 役割

- 各ページの UI コンポーネントを管理
- ページ固有のロジックと UI を組み合わせ

### ディレクトリ構造

```
pages/
├── DashboardPage/
│   ├── index.tsx        # メインページコンポーネント
│   └── StepCounter.tsx  # ページ内サブコンポーネント
└── LoginPage/
    └── index.tsx
```

### 命名規則

- ディレクトリ: `{ページ名}Page/`
- メインコンポーネント: `index.tsx`
- サブコンポーネント: `{機能名}.tsx`

### 実装パターン

#### メインページコンポーネント (index.tsx)

```typescript
interface DashboardPageProps {
  user: User;
}

export const DashboardPage = ({ user }: DashboardPageProps) => {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <MainLayout user={user} onLogout={handleLogout}>
      <StepCounter />
    </MainLayout>
  );
};
```

#### サブコンポーネント

```typescript
export default function StepCounter() {
  const [user] = useAuthState(auth);
  const { data: steps, isLoading, error } = useStepsQuery(user || null);

  // ローディング状態のUI
  if (isLoading) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="center" p={2}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>歩数を取得中...</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // エラー状態のUI
  if (error) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center">
            <DirectionsWalk sx={{ fontSize: 40, mr: 2, color: 'error.main' }} />
            <Box>
              <Typography variant="h6" color="error">
                エラー
              </Typography>
              <Typography variant="body2" color="error">
                歩数データの取得に失敗しました
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // 正常状態のUI
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center">
          <DirectionsWalk sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Box>
            <Typography variant="h6" color="textSecondary">
              本日の歩数
            </Typography>
            <Typography variant="h4" color="primary">
              {steps?.toLocaleString() || '0'} 歩
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
```

### ガイドライン

- メインページコンポーネントはレイアウトコンポーネントをラップして使用
- データ取得は カスタムフック（`hooks/`）を使用
- ローディング・エラー・正常状態の UI を明示的に分岐
- Material-UI の `Card` コンポーネントを基本単位として使用
- アイコンは `@mui/icons-material` を使用

## ui/ ディレクトリ

### 役割

- アプリケーション全体で再利用可能な UI コンポーネント
- ボタン、フォーム、モーダルなど共通要素

### 実装予定パターン

- プロジェクトが成長するにつれて共通コンポーネントを追加
- Material-UI をベースとしたカスタムコンポーネント
