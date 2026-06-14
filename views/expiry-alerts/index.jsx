'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import { useMedicine } from '../../services/medicineService/MedicineContext';

function ExpiryAlerts({
  medicines = []
}) {
  const { deleteMedicine } = useMedicine();
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showToast = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDeleteMedicine = async (id, name) => {
    if (deleteConfirmId !== id) {
      setDeleteConfirmId(id);
      setTimeout(() => setDeleteConfirmId(prev => prev === id ? null : prev), 3000);
      return;
    }
    try {
      await deleteMedicine(id);
      showToast(`${name} deleted successfully!`);
      setDeleteConfirmId(null);
    } catch (err) {
      showToast('Failed to delete medicine: ' + err.message, 'error');
    }
  };

  const alertedMeds = medicines.map((m) => {
    if (m.expiry === 'N/A') return null;
    const expiryDate = new Date(m.expiry);
    const diffTime = expiryDate.getTime() - Date.now();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 180) return null;
    const severity = diffDays < 30 ? 'critical' : (diffDays < 90 ? 'warning' : 'info');
    return (
      <Box
        key={m.id}
        sx={{
          p: 2.5,
          borderRadius: '16px',
          border: '1px solid',
          backgroundColor:
            severity === 'critical'
              ? 'rgba(239, 68, 68, 0.03)'
              : severity === 'warning'
              ? 'rgba(245, 158, 11, 0.03)'
              : 'rgba(255, 255, 255, 0.02)',
          borderColor:
            severity === 'critical'
              ? 'rgba(239, 68, 68, 0.15)'
              : severity === 'warning'
              ? 'rgba(245, 158, 11, 0.15)'
              : 'var(--card-border)',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { sm: 'center' },
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Avatar
            sx={{
              bgcolor: severity === 'critical' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
              color: severity === 'critical' ? '#ef4444' : '#f59e0b',
            }}
          >
            ⚠️
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
              {m.name}
            </Typography>
            <Typography variant="caption" sx={{ color: '#71717a' }}>
              {m.sku} • {m.brand}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 700, color: severity === 'critical' ? '#ef4444' : '#f59e0b' }}>
            {diffDays < 0 ? 'Expired' : `${diffDays} days left`}
          </Typography>
          <Typography variant="caption" sx={{ color: '#71717a' }}>
            Expires: {m.expiry}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleDeleteMedicine(m.id, m.name)}
          sx={{
            borderColor: deleteConfirmId === m.id ? '#ef4444' : 'var(--card-border)',
            color: deleteConfirmId === m.id ? '#ef4444' : '#a1a1aa',
            bgcolor: deleteConfirmId === m.id ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
            '&:hover': { borderColor: '#ef4444', color: '#f87171', bgcolor: 'rgba(239, 68, 68, 0.05)' },
          }}
        >
          {deleteConfirmId === m.id ? 'Confirm?' : 'Dispose Batch'}
        </Button>
      </Box>
    );
  }).filter(Boolean);

  return (
    <Paper className="glass" sx={{ p: 3 }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%', borderRadius: '12px' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#ef4444' }}>
          Critical Expiry Alerts
        </Typography>
        <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>
          Near-term expiry notifications. Immediate clearance or disposal protocol advised.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {alertedMeds}
        {alertedMeds.length === 0 && (
          <Typography variant="body2" sx={{ color: '#a1a1aa', textAlign: 'center', py: 4 }}>
            No near-term expiry alerts.
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

export default ExpiryAlerts;
