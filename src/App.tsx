import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { type User, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { DashboardPage } from './components/pages/DashboardPage';
import { LoadingPage } from './components/pages/LoadingPage';
import { LoginPage } from './components/pages/LoginPage';
import { auth } from './config/firebase';
import { queryClient } from './lib/queryClient';

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

export const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <LoadingPage />
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  if (!user) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <LoginPage />
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <DashboardPage user={user} />
      </ThemeProvider>
    </QueryClientProvider>
  );
};
