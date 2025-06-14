import { EXPIRY_STORAGE_KEY, TOKEN_STORAGE_KEY } from './keys';

export function storeAccessToken(accessToken: string): void {
  const expiry = Date.now() + 50 * 60 * 1000; // 50 minutes
  sessionStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
  sessionStorage.setItem(EXPIRY_STORAGE_KEY, expiry.toString());
}
