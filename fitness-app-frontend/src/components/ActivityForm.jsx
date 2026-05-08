import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { addActivity } from '../services/api';

const activityTypes = [
  { value: 'RUNNING', label: 'Running', icon: '🏃' },
  { value: 'WALKING', label: 'Walking', icon: '🚶' },
  { value: 'CYCLING', label: 'Cycling', icon: '🚴' },
];

const ActivityForm = ({ onActivityAdded }) => {
  const [activity, setActivity] = useState({
    type: 'RUNNING',
    duration: '',
    caloriesBurned: '',
    additionalMetrics: {},
    userId: localStorage.getItem('userId'),
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activity.duration || !activity.caloriesBurned) return;

    setLoading(true);
    try {
      await addActivity(activity);
      setSuccess(true);
      setActivity({
        type: 'RUNNING',
        duration: '',
        caloriesBurned: '',
        additionalMetrics: {},
        userId: localStorage.getItem('userId'),
      });
      onActivityAdded();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const selectedType = activityTypes.find((t) => t.value === activity.type);

  return (
    <>
      <Card
        sx={{
          mb: 4,
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(6, 182, 212, 0.1))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
              }}
            >
              {selectedType?.icon || '🏋️'}
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                Log Activity
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Record your workout session
              </Typography>
            </Box>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            id="activity-form"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
          >
            <FormControl fullWidth>
              <InputLabel>Activity Type</InputLabel>
              <Select
                value={activity.type}
                label="Activity Type"
                onChange={(e) => setActivity({ ...activity, type: e.target.value })}
                id="activity-type-select"
                sx={{
                  borderRadius: '12px',
                  background: 'rgba(15, 15, 26, 0.5)',
                  '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.15)' },
                }}
              >
                {activityTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <span>{type.icon}</span>
                      <span>{type.label}</span>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Duration (Minutes)"
              type="number"
              value={activity.duration}
              onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
              id="activity-duration"
              inputProps={{ min: 1 }}
              required
            />

            <TextField
              fullWidth
              label="Calories Burned"
              type="number"
              value={activity.caloriesBurned}
              onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })}
              id="activity-calories"
              inputProps={{ min: 1 }}
              required
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading || !activity.duration || !activity.caloriesBurned}
              startIcon={
                loading ? (
                  <CircularProgress size={20} sx={{ color: 'rgba(255,255,255,0.7)' }} />
                ) : (
                  <AddIcon />
                )
              }
              id="submit-activity"
              sx={{
                py: 1.5,
                mt: 0.5,
              }}
            >
              {loading ? 'Adding...' : 'Add Activity'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity="success"
          icon={<CheckCircleOutlineIcon />}
          sx={{
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34D399',
            backdropFilter: 'blur(10px)',
          }}
        >
          Activity logged successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ActivityForm;