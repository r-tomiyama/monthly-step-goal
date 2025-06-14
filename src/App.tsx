import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { type User, onAuthStateChanged, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import Login from './components/Login';
import { auth } from './config/firebase';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <Typography>Loading...</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Login onLoginSuccess={() => {}} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Monthly Step Goal
            </Typography>
            <Typography sx={{ mr: 2 }}>
              {user.displayName || user.email}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              ログアウト
            </Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4">
            ようこそ、{user.displayName}さん！
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            ここにダッシュボードコンテンツが表示されます。
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
