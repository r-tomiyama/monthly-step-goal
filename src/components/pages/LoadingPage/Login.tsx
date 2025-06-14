import { Google as GoogleIcon } from '@mui/icons-material';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { login } from '../../../services';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login = ({ onLoginSuccess }: LoginProps) => {
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
            onClick={() => {
              login(onLoginSuccess);
            }}
            sx={{ mt: 3, mb: 2 }}
          >
            Googleでログイン
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};
