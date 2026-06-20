'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  Snackbar,
  Alert,
} from '@mui/material';

export default function ReportsView({ activeTab }) {
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

      {['sales-report', 'inventory-report', 'customer-report', 'profit-report'].includes(activeTab) && (
        <Paper className="glass" sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)', textTransform: 'capitalize' }}>{activeTab.replace('-', ' ')}</Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>Audit clinical pharmacy performance, metrics, and transaction trends.</Typography>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid xs={12} sm={6} lg={3}>
              <Box sx={{ border: '1px solid var(--card-border)', p: 2.5, borderRadius: '16px' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase' }}>Monthly Revenue</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--foreground)', mt: 1 }}>₹4,28,900</Typography>
                <Typography variant="caption" sx={{ color: '#10b981', mt: 0.5, display: 'block' }}>↑ 14.5% versus last month</Typography>
              </Box>
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <Box sx={{ border: '1px solid var(--card-border)', p: 2.5, borderRadius: '16px' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase' }}>Average Rx Basket</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--foreground)', mt: 1 }}>₹685.20</Typography>
                <Typography variant="caption" sx={{ color: '#10b981', mt: 0.5, display: 'block' }}>↑ 2.1% basket size expansion</Typography>
              </Box>
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <Box sx={{ border: '1px solid var(--card-border)', p: 2.5, borderRadius: '16px' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase' }}>Dispensary Sales Qty</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--foreground)', mt: 1 }}>1,820 Units</Typography>
                <Typography variant="caption" sx={{ color: '#71717a', mt: 0.5, display: 'block' }}>Total medicine packs dispelled</Typography>
              </Box>
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <Box sx={{ border: '1px solid var(--card-border)', p: 2.5, borderRadius: '16px' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase' }}>Net Store Profit Margin</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--foreground)', mt: 1 }}>24.8%</Typography>
                <Typography variant="caption" sx={{ color: '#10b981', mt: 0.5, display: 'block' }}>↑ 1.2% cost reduction</Typography>
              </Box>
            </Grid>
          </Grid>

          <Card className="glass" sx={{ p: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'var(--foreground)', mb: 3 }}>Financial Analytics (Monthly Trend)</Typography>
            <Box sx={{ height: 160, display: 'flex', alignItems: 'flex-end', position: 'relative' }}>
              <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 500 120" preserveAspectRatio="none">
                <path d="M0 100 Q100 80 200 40 T400 20 T500 5 L500 120 L0 120 Z" fill="url(#salesGradMui)" opacity="0.15" />
                <path d="M0 100 Q100 80 200 40 T400 20 T500 5" fill="none" stroke="#ec4899" strokeWidth="3" />
                <defs>
                  <linearGradient id="salesGradMui" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#71717a', fontWeight: 600, mt: 2, px: 1 }}>
              <span>JAN</span>
              <span>FEB</span>
              <span>MAR</span>
              <span>APR</span>
              <span>MAY</span>
              <span>JUN (Live)</span>
            </Box>
          </Card>
        </Paper>
      )}
    </Box>
  );
}
