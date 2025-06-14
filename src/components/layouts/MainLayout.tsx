import { Logout } from '@mui/icons-material';
import { AppBar, Box, IconButton, Toolbar } from '@mui/material';
import type { User } from 'firebase/auth';
import type { ReactNode } from 'react';
import { StepsLogo } from '../ui/StepsLogo';

interface MainLayoutProps {
  user: User;
  onLogout: () => void;
  children: ReactNode;
  stepCounter?: ReactNode;
}

export const MainLayout = ({
  onLogout,
  children,
  stepCounter,
}: MainLayoutProps) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <StepsLogo sx={{ mr: 1, fontSize: 28 }} />
          </Box>
          {stepCounter && <Box sx={{ mr: 2 }}>{stepCounter}</Box>}
          <IconButton color="inherit" onClick={onLogout} size="small">
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component="main">{children}</Box>
    </Box>
  );
};
