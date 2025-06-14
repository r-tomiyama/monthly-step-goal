import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import type { User } from 'firebase/auth';
import type { ReactNode } from 'react';

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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            月間歩数目標
          </Typography>
          {stepCounter && <Box sx={{ mr: 3 }}>{stepCounter}</Box>}
          {/* <Typography sx={{ mr: 2 }}>{user.displayName}</Typography> */}
          <Button color="inherit" onClick={onLogout}>
            ログアウト
          </Button>
        </Toolbar>
      </AppBar>
      <Box component="main">{children}</Box>
    </Box>
  );
};
