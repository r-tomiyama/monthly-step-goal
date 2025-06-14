# Hooks ディレクトリ ガイドライン

## 概要

`src/hooks/` ディレクトリはカスタムフックを管理します。React のフック機能を活用して、コンポーネント間で共通のロジックを再利用可能にします。

## 役割

- データ取得ロジックの抽象化
- 状態管理の共通化
- React Query との統合
- Firebase との連携ロジック

## 実装パターン

### データ取得フック

#### 基本構造

```typescript
import { useQuery } from '@tanstack/react-query';
import type { User } from 'firebase/auth';
import { fetchTodaySteps } from '../services';

export const useStepsQuery = (user: User | null) => {
  return useQuery({
    queryKey: ['steps', 'today', user?.uid],
    queryFn: () => {
      if (!user) throw new Error('User not authenticated');
      return fetchTodaySteps(user);
    },
    enabled: !!user,
  });
};
```

### フック設計パターン

#### 1. クエリキー設計

```typescript
// 階層的なクエリキー構造
queryKey: ['steps', 'today', user?.uid]
//         [リソース, 期間, ユーザー識別子]
```

#### 2. 条件付き実行

```typescript
// ユーザーが認証済みの場合のみクエリを実行
enabled: !!user
```

#### 3. エラーハンドリング

```typescript
queryFn: () => {
  if (!user) throw new Error('User not authenticated');
  return fetchTodaySteps(user);
}
```

## ガイドライン

### React Query 統合

#### 基本設定

```typescript
export const useStepsQuery = (user: User | null) => {
  return useQuery({
    queryKey: ['steps', 'today', user?.uid],  // 一意のキー
    queryFn: () => fetchTodaySteps(user),     // データ取得関数
    enabled: !!user,                          // 実行条件
    staleTime: 1000 * 60 * 5,                // キャッシュ有効期間
    retry: 3,                                 // リトライ回数
  });
};
```

#### 戻り値の活用

```typescript
// コンポーネントでの使用例
const { data: steps, isLoading, error } = useStepsQuery(user);

// 分割代入で適切な名前を付ける
const { 
  data: steps, 
  isLoading: isStepsLoading,
  error: stepsError 
} = useStepsQuery(user);
```



## パフォーマンス考慮事項

### キャッシュ戦略

```typescript
{
  queryKey: ['steps', 'today', user?.uid],
  staleTime: 1000 * 60 * 5,  // 5分間キャッシュ
  refetchOnWindowFocus: false, // フォーカス時の再取得を無効化
}
```

### 条件付き実行の活用

```typescript
// 必要な条件が揃った場合のみクエリを実行
enabled: !!user && !!user.uid
```

## 拡張パターン

### 複数データの取得

```typescript
export const useMonthlyStepsQuery = (user: User | null, year: number, month: number) => {
  return useQuery({
    queryKey: ['steps', 'monthly', user?.uid, year, month],
    queryFn: () => {
      if (!user) throw new Error('User not authenticated');
      return fetchMonthlySteps(user, year, month);
    },
    enabled: !!user && year > 0 && month > 0,
  });
};
```

### ミューテーション（更新処理）

```typescript
export const useUpdateGoalMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ user, goal }: { user: User; goal: number }) => 
      updateMonthlyGoal(user, goal),
    onSuccess: () => {
      // 関連するクエリを無効化してリフレッシュ
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
};
```

### カスタム状態管理

```typescript
export const useAuthState = () => {
  const [user] = useAuthState(auth);
  const [isInitializing, setIsInitializing] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsInitializing(false);
    });
    
    return unsubscribe;
  }, []);
  
  return { user, isInitializing };
};
```

## テスト考慮事項


## 今後の拡張

### 新しいフックの追加時

1. React Query のパターンを統一
2. パフォーマンスを考慮した設定を行う
