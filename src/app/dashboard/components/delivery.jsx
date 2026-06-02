'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  Chip,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  Snackbar,
  Alert,
} from '@mui/material';

export default function DeliveryView({ activeTab }) {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showToast = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%', borderRadius: '12px' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* DELIVERY & LOGISTICS VIEW */}
      {activeTab === 'delivery-partners' && (
        <Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>Courier Delivery Partners</Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>Active APIs for courier shipping and prescription home dispatch.</Typography>
          </Box>
          <Grid container spacing={3}>
            {[
              { name: 'Delhivery API', time: '1-2 Days (Local)', status: 'Connected', logo: 'Dl' },
              { name: 'Shadowfax Quick', time: '3 Hours (Hyperlocal)', status: 'Connected', logo: 'Sf' },
              { name: 'DHL Express', time: '2-4 Days (National)', status: 'Maintenance', logo: 'Dhl' }
            ].map((p, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Card className="glass" sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2.5 }}>
                  <Avatar sx={{ width: 44, height: 44, bgcolor: 'rgba(236,72,153,0.1)', color: '#ec4899', fontWeight: 700 }}>
                    {p.logo}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>{p.name}</Typography>
                    <Typography variant="caption" sx={{ color: '#a1a1aa', display: 'block', mt: 0.2 }}>{p.time}</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 750, color: p.status === 'Connected' ? '#10b981' : '#f59e0b', display: 'block', mt: 1, fontSize: '9px', textTransform: 'uppercase' }}>{p.status}</Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {activeTab === 'tracking' && (
        <Paper className="glass" sx={{ p: 3 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>Live Delivery Tracking</Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>Real-time status updates from Shadowfax and Delhivery integrations.</Typography>
          </Box>

          <Box sx={{ border: '1px solid var(--card-border)', p: 3, borderRadius: '16px', bgcolor: 'rgba(9, 9, 11, 0.2)', mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 4 }}>
              <Box>
                <Chip label="SHADOWFAX" size="small" sx={{ fontSize: '9px', fontWeight: 700, color: '#ec4899', bgcolor: 'rgba(236,72,153,0.1)' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'var(--foreground)', mt: 1 }}>Active Ship Ref: SFX-9902911-IN</Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" sx={{ color: '#71717a', display: 'block' }}>Estimated Delivery</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>Today, 10:30 PM (Hyperlocal)</Typography>
              </Box>
            </Box>

            <Stepper activeStep={2} alternativeLabel sx={{ '& .MuiStepConnector-line': { borderColor: 'var(--card-border)' } }}>
              {[
                { label: 'Dispensed' },
                { label: 'Picked Up' },
                { label: 'Out for Delivery' },
                { label: 'Arrived' }
              ].map((step, index) => (
                <Step key={index}>
                  <StepLabel 
                    StepIconProps={{
                      sx: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '50%',
                        '&.Mui-active': { color: '#ec4899' },
                        '&.Mui-completed': { color: '#ec4899' }
                      }
                    }}
                  >
                    <Typography variant="caption" sx={{ color: 'var(--foreground)', fontWeight: 700, fontSize: '10px' }}>{step.label}</Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
