import { useContext, useEffect, useState } from 'react';
import { AuthContext } from 'react-oauth2-code-pkce';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router';
import { setCredentials } from './store/authSlice';

import LoginPage from './components/LoginPage';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ActivityForm from './components/ActivityForm';
import ActivityList from './components/ActivityList';
import ActivityDetail from './components/ActivityDetail';

import { Box, Typography } from '@mui/material';

const ActivitiesPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          Activities
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Log and manage your workout sessions
        </Typography>
      </Box>
      <ActivityForm onActivityAdded={() => setRefreshKey((k) => k + 1)} />
      <ActivityList key={refreshKey} />
    </Box>
  );
};

function App() {
  const { token, tokenData, logIn, logOut } = useContext(AuthContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(setCredentials({ token, user: tokenData }));
    }
  }, [token, tokenData, dispatch]);

  if (!token) {
    return (
      <Router>
        <LoginPage onLogin={logIn} />
      </Router>
    );
  }

  return (
    <Router>
      <Layout user={tokenData} onLogout={logOut}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/activities/:id" element={<ActivityDetail />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
