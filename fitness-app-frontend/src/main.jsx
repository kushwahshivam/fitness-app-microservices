import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress, Typography } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

import { Provider } from 'react-redux';
import { store } from './store/store';

import { AuthProvider } from 'react-oauth2-code-pkce';
import { authConfig } from './authConfig';

import theme from './theme';
import App from './App';

import './index.css';
import './App.css';

const LoadingScreen = () => (
  <Box
    sx={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0F0F1A',
      gap: 3,
    }}
  >
    <Box
      sx={{
        width: 72,
        height: 72,
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(6, 182, 212, 0.2))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'pulseGlow 2s ease-in-out infinite',
      }}
    >
      <FitnessCenterIcon sx={{ fontSize: 36, color: '#A78BFA' }} />
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <CircularProgress size={20} sx={{ color: '#7C3AED' }} />
      <Typography
        variant="body2"
        sx={{
          color: '#94A3B8',
          fontFamily: '"Inter", sans-serif',
          fontWeight: 500,
        }}
      >
        Loading FitTrack...
      </Typography>
    </Box>
  </Box>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthProvider
      authConfig={authConfig}
      loadingComponent={<LoadingScreen />}
    >
      <Provider store={store}>
        <App />
      </Provider>
    </AuthProvider>
  </ThemeProvider>,
);