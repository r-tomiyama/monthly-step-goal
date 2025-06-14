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

  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(EXPIRY_STORAGE_KEY);

  throw new Error(
    'Google Fit access token not available. Please sign in again to grant Google Fit permissions.'
  );
}
