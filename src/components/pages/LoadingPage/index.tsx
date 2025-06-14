import { Box, CircularProgress, Container, Typography } from '@mui/material';

export const LoadingPage = () => {
  return (
    <Container component="main">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          読み込み中...
        </Typography>
      </Box>
    </Container>
  );
};
