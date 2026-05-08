import React from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Drawer,
  useMediaQuery,
  useTheme,
  Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { useNavigate, useLocation } from 'react-router';

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { label: 'Activities', icon: <DirectionsRunIcon />, path: '/activities' },
];

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleNav = (path) => {
    navigate(path);
    if (isMobile) onClose();
  };

  const sidebarContent = (
    <Box
      sx={{
        width: 'var(--sidebar-width)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        pt: 'calc(var(--navbar-height) + 16px)',
        px: 2,
        background: 'rgba(15, 15, 26, 0.95)',
        borderRight: '1px solid rgba(148, 163, 184, 0.06)',
      }}
    >
      <List sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <ListItemButton
              key={item.path}
              onClick={() => handleNav(item.path)}
              id={`nav-${item.label.toLowerCase()}`}
              sx={{
                borderRadius: '14px',
                py: 1.4,
                px: 2,
                mb: 0.5,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.25s ease',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)'
                  : 'transparent',
                border: isActive
                  ? '1px solid rgba(124, 58, 237, 0.2)'
                  : '1px solid transparent',
                '&:hover': {
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.18) 0%, rgba(6, 182, 212, 0.12) 100%)'
                    : 'rgba(148, 163, 184, 0.06)',
                },
                '&::before': isActive
                  ? {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: '20%',
                      bottom: '20%',
                      width: 3,
                      borderRadius: '0 3px 3px 0',
                      background: 'linear-gradient(180deg, #7C3AED, #06B6D4)',
                    }
                  : {},
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: isActive ? '#A78BFA' : 'text.secondary',
                  transition: 'color 0.25s ease',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.92rem',
                  color: isActive ? 'text.primary' : 'text.secondary',
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* Bottom branding */}
      <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.06)', mb: 2 }} />
      <Box sx={{ pb: 3, px: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <FitnessCenterIcon sx={{ fontSize: 18, color: 'text.secondary', opacity: 0.5 }} />
        <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.5 }}>
          FitTrack v1.0
        </Typography>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        open={open}
        onClose={onClose}
        id="mobile-sidebar"
        PaperProps={{
          sx: {
            background: 'transparent',
            boxShadow: 'none',
          },
        }}
        ModalProps={{
          BackdropProps: {
            sx: { backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' },
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return (
    <Box
      component="nav"
      id="desktop-sidebar"
      sx={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: (theme) => theme.zIndex.drawer,
      }}
    >
      {sidebarContent}
    </Box>
  );
};

export default Sidebar;
