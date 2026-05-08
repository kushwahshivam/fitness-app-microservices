import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import InsightsIcon from '@mui/icons-material/Insights';
import SecurityIcon from '@mui/icons-material/Security';

const LoginPage = ({ onLogin }) => {
  return (
    <Box className="login-page">
      {/* Background orbs */}
      <Box className="login-bg" />
      <Box className="login-orb login-orb-1" />
      <Box className="login-orb login-orb-2" />
      <Box className="login-orb login-orb-3" />

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: 2 }}>
        {/* Login Card */}
        <Box className="login-card" sx={{ textAlign: 'center' }}>
          <Box className="login-icon-wrapper">
            <FitnessCenterIcon sx={{ fontSize: 40, color: '#A78BFA' }} />
          </Box>

          <Typography
            variant="h3"
            className="gradient-text"
            sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '1.8rem', sm: '2.2rem' } }}
          >
            FitTrack
          </Typography>

          <Typography
            variant="h6"
            sx={{ color: 'text.primary', fontWeight: 600, mb: 1 }}
          >
            Welcome Back
          </Typography>

          <Typography
            variant="body1"
            sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.6 }}
          >
            Track your fitness journey with AI-powered insights and personalized recommendations.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={onLogin}
            fullWidth
            id="login-button"
            sx={{
              py: 1.6,
              fontSize: '1rem',
              fontWeight: 700,
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 50%, #06B6D4 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradientShift 4s ease infinite',
              boxShadow: '0 6px 24px rgba(124, 58, 237, 0.35)',
              '&:hover': {
                boxShadow: '0 8px 32px rgba(124, 58, 237, 0.5)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Get Started
          </Button>

          <Typography
            variant="caption"
            sx={{ display: 'block', mt: 2.5, color: 'text.secondary', opacity: 0.7 }}
          >
            Secured with OAuth 2.0 · PKCE Flow
          </Typography>
        </Box>

        {/* Feature Highlights */}
        <Box className="login-features">
          {[
            {
              icon: <DirectionsRunIcon sx={{ fontSize: 28, color: '#A78BFA' }} />,
              title: 'Track Activities',
              desc: 'Log runs, walks & rides',
            },
            {
              icon: <InsightsIcon sx={{ fontSize: 28, color: '#22D3EE' }} />,
              title: 'AI Insights',
              desc: 'Smart recommendations',
            },
            {
              icon: <SecurityIcon sx={{ fontSize: 28, color: '#34D399' }} />,
              title: 'Stay Safe',
              desc: 'Personalized guidelines',
            },
          ].map((feature, i) => (
            <Box className="login-feature-item" key={i}>
              <Box sx={{ mb: 1 }}>{feature.icon}</Box>
              <Typography variant="subtitle2" sx={{ color: 'text.primary', fontWeight: 600, mb: 0.5 }}>
                {feature.title}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {feature.desc}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
