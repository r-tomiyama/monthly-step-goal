import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { storeAccessToken } from '../services';

export const login = async (onLoginSuccess: () => void) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    // Get OAuth access token for Google Fit API
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
