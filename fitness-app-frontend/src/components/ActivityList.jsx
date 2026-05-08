import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid2 as Grid,
  Typography,
  Skeleton,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router';
import { getActivities } from '../services/api';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const getTypeConfig = (type) => {
  switch (type?.toUpperCase()) {
    case 'RUNNING':
      return { icon: '🏃', color: '#A78BFA', gradient: 'linear-gradient(180deg, #7C3AED, #A78BFA)', cssClass: 'running' };
    case 'WALKING':
      return { icon: '🚶', color: '#34D399', gradient: 'linear-gradient(180deg, #10B981, #34D399)', cssClass: 'walking' };
    case 'CYCLING':
      return { icon: '🚴', color: '#22D3EE', gradient: 'linear-gradient(180deg, #06B6D4, #22D3EE)', cssClass: 'cycling' };
    default:
      return { icon: '🏋️', color: '#94A3B8', gradient: 'linear-gradient(180deg, #64748B, #94A3B8)', cssClass: 'running' };
  }
};

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchActivities = async () => {
    try {
      const response = await getActivities();
      setActivities(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  if (loading) {
    return (
      <Grid container spacing={2.5}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, lg: 4 }}>
            <Skeleton
              variant="rounded"
              height={160}
              sx={{ borderRadius: '20px', bgcolor: 'rgba(26,26,46,0.7)' }}
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (activities.length === 0) {
    return (
      <Box className="empty-state">
        <Box className="empty-state-icon">🏃</Box>
        <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600, mb: 1 }}>
          No Activities Yet
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 320, mx: 'auto' }}>
          Start logging your workouts above to see them here. Every step counts!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Your Activities
        </Typography>
        <Chip
          label={`${activities.length} total`}
          size="small"
          sx={{
            bgcolor: 'rgba(124, 58, 237, 0.1)',
            color: '#A78BFA',
            fontWeight: 600,
            fontSize: '0.75rem',
          }}
        />
      </Box>

      <Grid container spacing={2.5}>
        {activities.map((activity, index) => {
          const typeConfig = getTypeConfig(activity.type);
          return (
            <Grid key={activity.id || index} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card
                className={`activity-card type-${typeConfig.cssClass}`}
                onClick={() => navigate(`/activities/${activity.id}`)}
                id={`activity-card-${activity.id}`}
                sx={{
                  height: '100%',
                  animation: 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  animationDelay: `${index * 0.07}s`,
                  opacity: 0,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Box className={`activity-type-icon ${typeConfig.cssClass}`}>
                      <span>{typeConfig.icon}</span>
                    </Box>
                    <ArrowForwardIosIcon
                      sx={{
                        fontSize: 14,
                        color: 'text.secondary',
                        opacity: 0.5,
                        transition: 'all 0.25s ease',
                        '.activity-card:hover &': {
                          opacity: 1,
                          color: typeConfig.color,
                          transform: 'translateX(3px)',
                        },
                      }}
                    />
                  </Box>

                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
                    {activity.type}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 3, mt: 1.5 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block' }}>
                        Duration
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        {activity.duration} <span style={{ fontWeight: 400, color: '#94A3B8' }}>min</span>
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block' }}>
                        Calories
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        {activity.caloriesBurned} <span style={{ fontWeight: 400, color: '#94A3B8' }}>cal</span>
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ActivityList;