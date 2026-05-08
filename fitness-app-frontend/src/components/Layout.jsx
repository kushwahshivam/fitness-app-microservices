import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children, user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box className="app-layout">
      <Navbar
        user={user}
        onLogout={onLogout}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <Box
        component="main"
        className={`app-main ${isMobile ? 'sidebar-collapsed' : ''}`}
        sx={{
          marginLeft: isMobile ? 0 : 'var(--sidebar-width)',
        }}
      >
        <Box className="app-content page-enter">
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
