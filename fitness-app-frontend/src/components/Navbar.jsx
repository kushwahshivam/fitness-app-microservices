import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
  useMediaQuery,
  useTheme,
  Chip,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = ({ user, onLogout, onToggleSidebar }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const displayName = user?.preferred_username || user?.name || user?.email || 'User';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      id="main-navbar"
      sx={{
        background: 'rgba(15, 15, 26, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        height: 'var(--navbar-height)',
      }}
    >
      <Toolbar sx={{ height: '100%', px: { xs: 2, md: 3 } }}>
        {/* Mobile menu toggle */}
        {isMobile && (
          <IconButton
            onClick={onToggleSidebar}
            sx={{ mr: 1, color: 'text.secondary' }}
            id="sidebar-toggle"
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(6, 182, 212, 0.2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FitnessCenterIcon sx={{ fontSize: 22, color: '#A78BFA' }} />
          </Box>
          <Typography
            variant="h6"
            className="gradient-text"
            sx={{
              fontWeight: 800,
              fontSize: '1.25rem',
              letterSpacing: '-0.02em',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            FitTrack
          </Typography>
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Right section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            avatar={
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 28,
                  height: 28,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}
              >
                {initials}
              </Avatar>
            }
            label={isMobile ? '' : displayName}
            variant="outlined"
            sx={{
              borderColor: 'rgba(148, 163, 184, 0.15)',
              color: 'text.primary',
              fontWeight: 500,
              '& .MuiChip-label': {
                display: isMobile ? 'none' : 'block',
              },
              px: isMobile ? 0 : 1,
            }}
          />

          <Button
            onClick={onLogout}
            startIcon={<LogoutIcon sx={{ fontSize: 18 }} />}
            id="logout-button"
            sx={{
              color: 'text.secondary',
              fontSize: '0.85rem',
              px: 2,
              borderRadius: '10px',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              '&:hover': {
                background: 'rgba(239, 68, 68, 0.08)',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                color: '#F87171',
              },
            }}
          >
            {isMobile ? '' : 'Logout'}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
