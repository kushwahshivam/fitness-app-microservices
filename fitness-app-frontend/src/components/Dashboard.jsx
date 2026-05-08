import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid2 as Grid,
  Button,
  Skeleton,
  Chip,
} from '@mui/material';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import TimerIcon from '@mui/icons-material/Timer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router';
import { getActivities } from '../services/api';

const StatCard = ({ icon, label, value, color, accentClass }) => (
  <Card
    className={`stat-card ${accentClass}`}
    sx={{ height: '100%' }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontWeight: 500 }}>
            {label}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1 }}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '14px',
            background: `linear-gradient(135deg, ${color}22, ${color}0A)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getActivities();
        setActivities(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalActivities = activities.length;
  const totalCalories = activities.reduce((sum, a) => sum + (Number(a.caloriesBurned) || 0), 0);
  const avgDuration = totalActivities
    ? Math.round(activities.reduce((sum, a) => sum + (Number(a.duration) || 0), 0) / totalActivities)
    : 0;
  const activityTypes = [...new Set(activities.map((a) => a.type))].length;

  const recentActivities = activities.slice(0, 5);

  const getTypeIcon = (type) => {
    switch (type?.toUpperCase()) {
      case 'RUNNING': return '🏃';
      case 'WALKING': return '🚶';
      case 'CYCLING': return '🚴';
      default: return '🏋️';
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toUpperCase()) {
      case 'RUNNING': return '#A78BFA';
      case 'WALKING': return '#34D399';
      case 'CYCLING': return '#22D3EE';
      default: return '#94A3B8';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Your fitness overview at a glance
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/activities')}
          id="add-activity-cta"
          sx={{ px: 3 }}
        >
          Log Activity
        </Button>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <Grid key={i} size={{ xs: 6, md: 3 }}>
              <Skeleton variant="rounded" height={120} sx={{ borderRadius: '20px', bgcolor: 'rgba(26,26,46,0.7)' }} />
            </Grid>
          ))
        ) : (
          <>
            <Grid size={{ xs: 6, md: 3 }}>
              <StatCard
                icon={<DirectionsRunIcon sx={{ color: '#A78BFA', fontSize: 24 }} />}
                label="Total Activities"
                value={totalActivities}
                color="#7C3AED"
                accentClass="violet"
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <StatCard
                icon={<LocalFireDepartmentIcon sx={{ color: '#22D3EE', fontSize: 24 }} />}
                label="Calories Burned"
                value={totalCalories.toLocaleString()}
                color="#06B6D4"
                accentClass="cyan"
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <StatCard
                icon={<TimerIcon sx={{ color: '#34D399', fontSize: 24 }} />}
                label="Avg Duration"
                value={`${avgDuration}m`}
                color="#10B981"
                accentClass="green"
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <StatCard
                icon={<TrendingUpIcon sx={{ color: '#FBBF24', fontSize: 24 }} />}
                label="Activity Types"
                value={activityTypes}
                color="#F59E0B"
                accentClass="orange"
              />
            </Grid>
          </>
        )}
      </Grid>

      {/* Recent Activities */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Recent Activities
            </Typography>
            <Button
              size="small"
              onClick={() => navigate('/activities')}
              sx={{ color: 'primary.light', fontWeight: 600 }}
            >
              View All
            </Button>
          </Box>

          {loading ? (
            [1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rounded" height={56} sx={{ mb: 1.5, borderRadius: '12px', bgcolor: 'rgba(15,15,26,0.5)' }} />
            ))
          ) : recentActivities.length === 0 ? (
            <Box className="empty-state" sx={{ py: 4 }}>
              <Typography sx={{ fontSize: '3rem', mb: 1 }}>🏃</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                No activities yet. Start tracking your fitness journey!
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {recentActivities.map((activity, index) => (
                <Box
                  key={activity.id || index}
                  onClick={() => navigate(`/activities/${activity.id}`)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    borderRadius: '14px',
                    background: 'rgba(15, 15, 26, 0.4)',
                    border: '1px solid rgba(148, 163, 184, 0.06)',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    animation: 'fadeInUp 0.5s ease forwards',
                    animationDelay: `${index * 0.08}s`,
                    opacity: 0,
                    '&:hover': {
                      background: 'rgba(124, 58, 237, 0.06)',
                      borderColor: 'rgba(124, 58, 237, 0.2)',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <Box sx={{ fontSize: '1.4rem' }}>{getTypeIcon(activity.type)}</Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {activity.type}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {activity.duration} min · {activity.caloriesBurned} cal
                    </Typography>
                  </Box>
                  <Chip
                    label={activity.type?.toLowerCase()}
                    size="small"
                    sx={{
                      bgcolor: `${getTypeColor(activity.type)}15`,
                      color: getTypeColor(activity.type),
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: 26,
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
