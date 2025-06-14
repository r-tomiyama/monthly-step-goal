# Services ディレクトリ ガイドライン

## 概要

`src/services/` ディレクトリは外部API通信とビジネスロジックを管理します。Firebase、Google Fit API などの外部サービスとの連携処理を抽象化し、コンポーネントから分離します。

## ディレクトリ構造

```
services/
├── index.ts                  # エクスポート統合
├── login.ts                  # 認証ロジック
├── googleFit/               # Google Fit API関連
│   ├── index.ts
│   └── fetchTodaySteps.ts
└── tokenStorage/            # トークン管理
    ├── index.ts
    ├── keys.ts
    ├── getAccessToken.ts
    └── storeAccessToken.ts
```

## 実装パターン

### 認証サービス (login.ts)

#### 基本構造

```typescript
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { storeAccessToken } from '../services';

export const login = async (onLoginSuccess: () => void) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    // OAuth アクセストークンを取得してGoogle Fit API用に保存
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
      storeAccessToken(credential.accessToken);
      console.log('Google Fit access token stored');
    }

    onLoginSuccess();
  } catch (error) {
    console.error('Login error:', error);
  }
};
```

### 外部API通信 (googleFit/fetchTodaySteps.ts)

#### データ取得パターン

```typescript
import type { User } from 'firebase/auth';
import { getAccessToken } from '../tokenStorage';

const FITNESS_API_BASE = 'https://www.googleapis.com/fitness/v1';

export async function fetchTodaySteps(user: User): Promise<number> {
  const accessToken = await getAccessToken(user);

  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  return fetchStepDataForDate(accessToken, startOfDay, endOfDay);
}

async function fetchStepDataForDate(
  accessToken: string,
  startDate: Date,
  endDate: Date
): Promise<number> {
  const requestBody = {
    aggregateBy: [{ dataTypeName: 'com.google.step_count.delta' }],
    bucketByTime: {
      durationMillis: 86400000, // 1 day
    },
    startTimeMillis: startDate.getTime(),
    endTimeMillis: endDate.getTime(),
  };

  try {
    const response = await fetch(
      `${FITNESS_API_BASE}/users/me/dataset:aggregate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(`Google Fit API error: ${response.status}`);
    }

    const data = await response.json();

    // データ集計ロジック
    let totalSteps = 0;
    if (data.bucket && data.bucket.length > 0) {
      for (const bucket of data.bucket) {
        if (bucket.dataset && bucket.dataset.length > 0) {
          for (const dataset of bucket.dataset) {
            if (dataset.point && dataset.point.length > 0) {
              for (const point of dataset.point) {
                if (point.value && point.value.length > 0) {
                  totalSteps += point.value[0].intVal || 0;
                }
              }
            }
          }
        }
      }
    }

    return totalSteps;
  } catch (error) {
    console.error('Error fetching step data:', error);
    throw error;
  }
}
```

### トークン管理 (tokenStorage/)

#### トークン保存

```typescript
import { EXPIRY_STORAGE_KEY, TOKEN_STORAGE_KEY } from './keys';

export function storeAccessToken(accessToken: string): void {
  const expiry = Date.now() + 50 * 60 * 1000; // 50分
  sessionStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
  sessionStorage.setItem(EXPIRY_STORAGE_KEY, expiry.toString());
}
```

#### トークン取得と検証

```typescript
import type { User } from 'firebase/auth';
import { EXPIRY_STORAGE_KEY, TOKEN_STORAGE_KEY } from './keys';

export async function getAccessToken(_user: User): Promise<string> {
  const storedToken = sessionStorage.getItem(TOKEN_STORAGE_KEY);
  const storedExpiry = sessionStorage.getItem(EXPIRY_STORAGE_KEY);

  if (
    storedToken &&
    storedExpiry &&
    Date.now() < Number.parseInt(storedExpiry)
  ) {
    return storedToken;
  }

  // 期限切れトークンのクリーンアップ
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(EXPIRY_STORAGE_KEY);

  throw new Error(
    'Google Fit access token not available. Please sign in again to grant Google Fit permissions.'
  );
}
```

#### 定数管理

```typescript
// keys.ts
export const TOKEN_STORAGE_KEY = 'google_fit_token';
export const EXPIRY_STORAGE_KEY = 'google_fit_token_expiry';
```

## ガイドライン

### ディレクトリ分割の原則

- **機能別分割**: Google Fit、Firebase、その他の外部サービスごと
- **責任分離**: 認証、データ取得、トークン管理を明確に分離
- **再利用性**: 共通ロジックは適切に抽象化

## データ処理パターン

### 時刻処理

```typescript
const today = new Date();
const startOfDay = new Date(today);
startOfDay.setHours(0, 0, 0, 0);

const endOfDay = new Date(today);
endOfDay.setHours(23, 59, 59, 999);
```

### API レスポンス処理

```typescript
// ネストした構造の安全な処理
let totalSteps = 0;
if (data.bucket && data.bucket.length > 0) {
  for (const bucket of data.bucket) {
    if (bucket.dataset && bucket.dataset.length > 0) {
      // さらにネストした処理...
    }
  }
}
```

## 拡張パターン

### 新しい外部API追加時

```typescript
// services/newService/
// ├── index.ts
// ├── fetchData.ts
// └── types.ts

export async function fetchNewServiceData(
  user: User, 
  params: NewServiceParams
): Promise<NewServiceResponse> {
  // 実装
}
```

### キャッシュ機能の追加

```typescript
const cache = new Map<string, { data: any; expiry: number }>();

export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 300000 // 5分
): Promise<T> {
  const cached = cache.get(key);
  if (cached && Date.now() < cached.expiry) {
    return cached.data;
  }

  const data = await fetcher();
  cache.set(key, { data, expiry: Date.now() + ttl });
  return data;
}
```

## テスト考慮事項
