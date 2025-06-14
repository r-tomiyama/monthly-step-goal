import GoogleIcon from '@mui/icons-material/Google';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Login successful:', result.user);
      onLoginSuccess();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Monthly Step Goal
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 4 }}>
            Googleアカウントでログインして、歩数目標を管理しましょう
          </Typography>
          <Button
            fullWidth
            variant="contained"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            sx={{ mt: 3, mb: 2 }}
          >
            Googleでログイン
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
