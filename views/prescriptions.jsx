'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Chip,
  Checkbox,
  FormControlLabel,
  Divider,
  Avatar,
  Snackbar,
  Alert,
} from '@mui/material';

export default function PrescriptionsView({ activeTab }) {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showToast = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // State for prescriptions
  const [prescriptions, setPrescriptions] = useState([
    { id: 'RX-9921', patient: 'Ramesh Kumar', doctor: 'Dr. Alok Sen (MD)', date: '2026-06-02', file: 'prescription_ramesh.pdf', status: 'Pending Verification', checkedItems: { id: false, signature: false, med: false } },
    { id: 'RX-9920', patient: 'Sunita Sharma', doctor: 'Dr. Priya Shah (MBBS)', date: '2026-06-02', file: 'prescription_sunita.pdf', status: 'Approved', checkedItems: { id: true, signature: true, med: true } },
    { id: 'RX-9919', patient: 'Mohit Verma', doctor: 'Dr. K. G. Patel', date: '2026-06-01', file: 'rx_blurry_scan.png', status: 'Rejected', reason: 'Blurry document image. Unreadable items.' }
  ]);

  const handleCheckoff = (id, checkField) => {
    setPrescriptions(prev => prev.map(rx => {
      if (rx.id === id) {
        const updatedChecks = { ...rx.checkedItems, [checkField]: !rx.checkedItems[checkField] };
        return { ...rx, checkedItems: updatedChecks };
      }
      return rx;
    }));
  };

  const handlePrescriptionStatus = (id, newStatus, reason = '') => {
    setPrescriptions(prev => prev.map(rx => {
      if (rx.id === id) {
        return { ...rx, status: newStatus, reason: reason || undefined };
      }
      return rx;
    }));
    showToast(`Prescription ${id} has been ${newStatus.toLowerCase()}`);
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

      {/* PRESCRIPTIONS PENDING VIEW */}
      {activeTab === 'pending-verification' && (
        <Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>Prescription Verification Center</Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>Cross-check patient uploaded medical charts and verify prescribing clinician license.</Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Left Queue List */}
            <Grid xs={12} lg={4}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase', mb: 2, display: 'block' }}>Verification Queue</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {prescriptions
                  .filter(rx => rx.status === 'Pending Verification')
                  .map((rx) => (
                    <Box key={rx.id} className="glass" sx={{ p: 2.5, borderRadius: '16px', border: '1px solid rgba(236,72,153,0.15)', bgcolor: 'rgba(236,72,153,0.02)' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>{rx.patient}</Typography>
                          <Typography variant="caption" sx={{ color: '#a1a1aa', display: 'block', mt: 0.5 }}>{rx.doctor} • {rx.date}</Typography>
                        </Box>
                        <Chip label="NEW RX" size="small" sx={{ fontSize: '8px', fontWeight: 700, color: '#ec4899', bgcolor: 'rgba(236,72,153,0.15)' }} />
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <Chip label={rx.file} size="small" variant="outlined" sx={{ fontSize: '9px', borderColor: 'var(--card-border)', color: '#a1a1aa' }} />
                      </Box>
                    </Box>
                  ))}
                {prescriptions.filter(rx => rx.status === 'Pending Verification').length === 0 && (
                  <Paper className="glass" sx={{ p: 3, textAlign: 'center', fontStyle: 'italic', color: '#71717a' }}>
                    All prescriptions verified! Queue is clean.
                  </Paper>
                )}
              </Box>
            </Grid>

            {/* Right Split Prescription Inspector */}
            <Grid xs={12} lg={8}>
              {prescriptions.filter(rx => rx.status === 'Pending Verification').map((rx) => (
                <Paper key={rx.id} className="glass" sx={{ p: 3, position: 'relative', overflow: 'hidden' }}>
                  <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, #ec4899, #9333ea)' }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2, borderBottom: '1px solid var(--card-border)', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Chip label={rx.id} size="small" sx={{ fontWeight: 700, fontSize: '10px' }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>Active Inspection: {rx.patient}</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: '#ec4899', fontWeight: 700, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>View PDF Scan</Typography>
                  </Box>

                  <Grid container spacing={3}>
                    {/* Visual RX Doctor Note */}
                    <Grid xs={12} md={6}>
                      <Box sx={{ border: '1px solid var(--card-border)', borderRadius: '16px', bgcolor: 'rgba(9, 9, 11, 0.4)', p: 3, fontFamily: 'monospace', fontSize: '11px', color: '#a1a1aa', position: 'relative', minHeight: 220 }}>
                        <Box sx={{ position: 'absolute', top: 12, right: 12, fontSize: '9px', fontWeight: 700, border: '1px solid rgba(255,255,255,0.08)', px: 1, py: 0.5, borderRadius: '4px' }}>RX NOTE</Box>
                        <Typography variant="caption" sx={{ fontWeight: 750, color: 'var(--foreground)', fontFamily: 'monospace', display: 'block', mb: 0.5 }}>{rx.doctor}</Typography>
                        <Typography variant="caption" sx={{ fontSize: '10px', color: '#71717a', fontFamily: 'monospace', display: 'block', mb: 2 }}>Reg No: MCI-22091-B • Fortis Clinic</Typography>
                        
                        <Divider sx={{ borderStyle: 'dashed', my: 1.5, opacity: 0.1 }} />
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', display: 'block' }}><strong>Patient:</strong> {rx.patient} (Age: 38, M)</Typography>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', display: 'block', mb: 2 }}><strong>Date:</strong> 02-June-2026</Typography>
                        
                        <Divider sx={{ borderStyle: 'dashed', my: 1.5, opacity: 0.1 }} />
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', display: 'block', mb: 1, fontWeight: 700, color: 'var(--foreground)' }}>Rx Prescribed formulations:</Typography>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#ec4899', display: 'block', pl: 1 }}>1. Tab. Paracetamol 650mg — TDS x 5 Days</Typography>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#ec4899', display: 'block', pl: 1, mb: 2 }}>2. Syrup Benadryl Cough 100ml — 1 tsp HS</Typography>
                        
                        <Divider sx={{ borderStyle: 'dashed', my: 1.5, opacity: 0.1 }} />
                        <Typography variant="caption" sx={{ fontSize: '9px', fontStyle: 'italic', display: 'block', textAlign: 'right', color: '#71717a' }}>Digitally Verified Key</Typography>
                      </Box>
                    </Grid>

                    {/* Pharmacist Checklist Form */}
                    <Grid xs={12} md={6}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'var(--foreground)', textTransform: 'uppercase', mb: 2, display: 'block' }}>Pharmacist Audit Checklist</Typography>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5, border: '1px solid var(--card-border)', borderRadius: '12px', bgcolor: 'rgba(9, 9, 11, 0.2)' }}>
                          <FormControlLabel
                            control={<Checkbox checked={rx.checkedItems.id} onChange={() => handleCheckoff(rx.id, 'id')} color="primary" />}
                            label={
                              <Box>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'var(--foreground)', display: 'block' }}>Patient Credentials Valid</Typography>
                                <Typography variant="caption" sx={{ color: '#71717a', fontSize: '9px' }}>Name matches customer registration record.</Typography>
                              </Box>
                            }
                          />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5, border: '1px solid var(--card-border)', borderRadius: '12px', bgcolor: 'rgba(9, 9, 11, 0.2)' }}>
                          <FormControlLabel
                            control={<Checkbox checked={rx.checkedItems.signature} onChange={() => handleCheckoff(rx.id, 'signature')} color="primary" />}
                            label={
                              <Box>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'var(--foreground)', display: 'block' }}>Doctor Registry Active</Typography>
                                <Typography variant="caption" sx={{ color: '#71717a', fontSize: '9px' }}>Verified registration license with Medical Council.</Typography>
                              </Box>
                            }
                          />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5, border: '1px solid var(--card-border)', borderRadius: '12px', bgcolor: 'rgba(9, 9, 11, 0.2)' }}>
                          <FormControlLabel
                            control={<Checkbox checked={rx.checkedItems.med} onChange={() => handleCheckoff(rx.id, 'med')} color="primary" />}
                            label={
                              <Box>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'var(--foreground)', display: 'block' }}>Matches Order SKU items</Typography>
                                <Typography variant="caption" sx={{ color: '#71717a', fontSize: '9px' }}>Formulations and doses map to items in ORD-1092.</Typography>
                              </Box>
                            }
                          />
                        </Box>
                      </Box>

                      <Grid container spacing={2}>
                        <Grid xs={6}>
                          <Button
                            fullWidth
                            variant="contained"
                            color="success"
                            onClick={() => {
                              if (!rx.checkedItems.id || !rx.checkedItems.signature || !rx.checkedItems.med) {
                                showToast('Please check off all verification boxes before approving.', 'error');
                              } else {
                                handlePrescriptionStatus(rx.id, 'Approved');
                              }
                            }}
                          >
                            Approve
                          </Button>
                        </Grid>
                        <Grid xs={6}>
                          <Button
                            fullWidth
                            variant="contained"
                            color="error"
                            onClick={() => {
                              const reason = prompt('Specify rejection reason:');
                              if (reason) {
                                handlePrescriptionStatus(rx.id, 'Rejected', reason);
                              }
                            }}
                          >
                            Reject
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Grid>
          </Grid>
        </Box>
      )}

      {/* PRESCRIPTIONS APPROVED/REJECTED VIEW */}
      {['approved-prescriptions', 'rejected-prescriptions'].includes(activeTab) && (
        <Paper className="glass" sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)', textTransform: 'capitalize' }}>{activeTab.replace('-prescriptions', '')} Prescriptions</Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>Archived log of past pharmacist prescription audits.</Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {prescriptions
              .filter(rx => rx.status.toLowerCase() === activeTab.replace('-prescriptions', ''))
              .map((rx) => (
                <Box key={rx.id} sx={{ p: 2, border: '1px solid var(--card-border)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>{rx.patient}</Typography>
                    <Typography variant="caption" sx={{ color: '#71717a' }}>{rx.doctor} • Checked: {rx.date}</Typography>
                    {rx.reason && <Typography variant="caption" sx={{ color: '#f87171', display: 'block', mt: 1, fontWeight: 600 }}>Rejection Reason: "{rx.reason}"</Typography>}
                  </Box>
                  <Chip
                    label={rx.status}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      fontSize: '10px',
                      borderRadius: '8px',
                      border: '1px solid',
                      backgroundColor: rx.status === 'Approved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      borderColor: rx.status === 'Approved' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: rx.status === 'Approved' ? '#10b981' : '#ef4444',
                    }}
                  />
                </Box>
              ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
}
