import { Box, Container } from '@mui/material';
import { Login } from '../LoadingPage/Login';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

export const LoginPage = ({ onLoginSuccess }: LoginPageProps) => {
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
        <Login onLoginSuccess={onLoginSuccess || (() => {})} />
      </Box>
    </Container>
  );
};
