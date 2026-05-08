import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getActivityDetail } from '../services/api';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Skeleton,
  Typography,
} from '@mui/material';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TimerIcon from '@mui/icons-material/Timer';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

const getTypeConfig = (type) => {
  switch (type?.toUpperCase()) {
    case 'RUNNING':
      return { icon: '🏃', color: '#A78BFA', bg: 'rgba(124, 58, 237, 0.12)' };
    case 'WALKING':
      return { icon: '🚶', color: '#34D399', bg: 'rgba(16, 185, 129, 0.12)' };
    case 'CYCLING':
      return { icon: '🚴', color: '#22D3EE', bg: 'rgba(6, 182, 212, 0.12)' };
    default:
      return { icon: '🏋️', color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.12)' };
  }
};

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivityDetail = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const activityResponse = await axios.get(`http://localhost:8080/api/activities/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-User-ID': userId,
          },
        });
        setActivity(activityResponse.data);

        const recResponse = await getActivityDetail(id);
        setRecommendation(recResponse.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityDetail();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Skeleton variant="rounded" height={200} sx={{ borderRadius: '24px', mb: 3, bgcolor: 'rgba(26,26,46,0.7)' }} />
        <Skeleton variant="rounded" height={300} sx={{ borderRadius: '20px', bgcolor: 'rgba(26,26,46,0.7)' }} />
      </Box>
    );
  }

  if (!activity) {
    return (
      <Box className="empty-state">
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          Activity not found
        </Typography>
      </Box>
    );
  }

  const typeConfig = getTypeConfig(activity.type);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }} className="page-enter">
      {/* Back Button */}
      <IconButton
        onClick={() => navigate('/activities')}
        id="back-button"
        sx={{
          mb: 3,
          color: 'text.secondary',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          borderRadius: '12px',
          width: 44,
          height: 44,
          transition: 'all 0.25s ease',
          '&:hover': {
            borderColor: 'rgba(124, 58, 237, 0.3)',
            color: 'primary.light',
            background: 'rgba(124, 58, 237, 0.06)',
            transform: 'translateX(-3px)',
          },
        }}
      >
        <ArrowBackIcon fontSize="small" />
      </IconButton>

      {/* Hero Section */}
      <Card
        className="detail-hero"
        sx={{
          mb: 3,
          background: 'rgba(26, 26, 46, 0.7)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(148, 163, 184, 0.08)',
          borderRadius: '24px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Gradient overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, ${typeConfig.bg} 0%, transparent 60%)`,
            zIndex: 0,
          }}
        />
        <CardContent sx={{ p: { xs: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '20px',
                background: typeConfig.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
              }}
            >
              {typeConfig.icon}
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                {activity.type}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                Activity Details
              </Typography>
            </Box>
          </Box>

          {/* Stat Chips */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            <Chip
              icon={<TimerIcon sx={{ fontSize: 18 }} />}
              label={`${activity.duration} minutes`}
              sx={{
                bgcolor: 'rgba(124, 58, 237, 0.1)',
                color: '#A78BFA',
                fontWeight: 600,
                borderRadius: '10px',
                py: 2.5,
                px: 0.5,
                '& .MuiChip-icon': { color: '#A78BFA' },
              }}
            />
            <Chip
              icon={<LocalFireDepartmentIcon sx={{ fontSize: 18 }} />}
              label={`${activity.caloriesBurned} calories`}
              sx={{
                bgcolor: 'rgba(6, 182, 212, 0.1)',
                color: '#22D3EE',
                fontWeight: 600,
                borderRadius: '10px',
                py: 2.5,
                px: 0.5,
                '& .MuiChip-icon': { color: '#22D3EE' },
              }}
            />
            {activity.createdAt && (
              <Chip
                icon={<CalendarTodayIcon sx={{ fontSize: 16 }} />}
                label={new Date(activity.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
                sx={{
                  bgcolor: 'rgba(16, 185, 129, 0.1)',
                  color: '#34D399',
                  fontWeight: 600,
                  borderRadius: '10px',
                  py: 2.5,
                  px: 0.5,
                  '& .MuiChip-icon': { color: '#34D399' },
                }}
              />
            )}
          </Box>
        </CardContent>
      </Card>

      {/* AI Recommendation */}
      {recommendation && (
        <Card
          sx={{
            background: 'rgba(26, 26, 46, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(148, 163, 184, 0.08)',
            borderRadius: '24px',
            animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards',
            opacity: 0,
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(6, 182, 212, 0.15))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AutoAwesomeIcon sx={{ fontSize: 22, color: '#A78BFA' }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  AI Recommendation
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Personalized insights powered by AI
                </Typography>
              </Box>
            </Box>

            {/* Analysis */}
            {recommendation.recommendation && (
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: '16px',
                  background: 'rgba(124, 58, 237, 0.06)',
                  border: '1px solid rgba(124, 58, 237, 0.12)',
                  mb: 3,
                }}
              >
                <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.8 }}>
                  {recommendation.recommendation}
                </Typography>
              </Box>
            )}

            {/* Improvements */}
            {recommendation?.improvements?.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TrendingUpIcon sx={{ fontSize: 20, color: '#22D3EE' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#22D3EE' }}>
                    Improvements
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {recommendation.improvements.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.5,
                        p: 2,
                        borderRadius: '12px',
                        background: 'rgba(6, 182, 212, 0.04)',
                        border: '1px solid rgba(6, 182, 212, 0.08)',
                        transition: 'all 0.25s ease',
                        '&:hover': { borderColor: 'rgba(6, 182, 212, 0.2)' },
                      }}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          bgcolor: '#22D3EE',
                          mt: 1,
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.7 }}>
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Suggestions */}
            {recommendation?.suggestions?.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.06)', mb: 3 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TipsAndUpdatesIcon sx={{ fontSize: 20, color: '#FBBF24' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FBBF24' }}>
                    Suggestions
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {recommendation.suggestions.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.5,
                        p: 2,
                        borderRadius: '12px',
                        background: 'rgba(245, 158, 11, 0.04)',
                        border: '1px solid rgba(245, 158, 11, 0.08)',
                        transition: 'all 0.25s ease',
                        '&:hover': { borderColor: 'rgba(245, 158, 11, 0.2)' },
                      }}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          bgcolor: '#FBBF24',
                          mt: 1,
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.7 }}>
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Safety */}
            {recommendation?.safety?.length > 0 && (
              <Box>
                <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.06)', mb: 3 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <HealthAndSafetyIcon sx={{ fontSize: 20, color: '#F87171' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#F87171' }}>
                    Safety Guidelines
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {recommendation.safety.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.5,
                        p: 2,
                        borderRadius: '12px',
                        background: 'rgba(239, 68, 68, 0.04)',
                        border: '1px solid rgba(239, 68, 68, 0.08)',
                        transition: 'all 0.25s ease',
                        '&:hover': { borderColor: 'rgba(239, 68, 68, 0.2)' },
                      }}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          bgcolor: '#F87171',
                          mt: 1,
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.7 }}>
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ActivityDetail;