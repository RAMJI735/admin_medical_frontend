'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Grid,
  Card,
  Chip,
  Snackbar,
  Alert,
} from '@mui/material';

export default function UsersRolesView({ activeTab }) {
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

      {/* USERS VIEW */}
      {activeTab === 'users' && (
        <Paper className="glass" sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>Pharmacists & Admins</Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>Configure backend dashboard access levels for staff chemists and support.</Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Staff Member</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Assigned Role</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { name: 'MedRx Admin', email: 'admin@medrx.com', role: 'Super Admin' },
                  { name: 'Dr. Vivek Malhotra', email: 'pharmacist@medrx.com', role: 'Pharmacist Expert' },
                  { name: 'Support Agent Nitin', email: 'support@medrx.com', role: 'Support Agent' }
                ].map((staff, i) => (
                  <TableRow key={i} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.02)' } }}>
                    <TableCell sx={{ fontWeight: 700, color: 'var(--foreground)' }}>{staff.name}</TableCell>
                    <TableCell sx={{ color: '#a1a1aa' }}>{staff.email}</TableCell>
                    <TableCell>
                      <Chip label={staff.role} size="small" sx={{ fontSize: '9px', fontWeight: 700, color: '#ec4899', bgcolor: 'rgba(236,72,153,0.1)' }} />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => showToast(`Opening permissions panel for ${staff.name}`)}
                        sx={{ borderColor: 'var(--card-border)', color: '#a1a1aa' }}
                      >
                        Adjust Access
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* ROLES VIEW */}
      {activeTab === 'roles' && (
        <Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>Backend Roles Configurator</Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>Configure permissions structure mapping staff credentials to operations.</Typography>
          </Box>
          <Grid container spacing={3}>
            {[
              { name: 'Super Admin', access: 'All access, database settings write-level, master role.', count: '1 User' },
              { name: 'Pharmacist Expert', access: 'Approve or reject doctor prescriptions, audit stock logs.', count: '1 User' },
              { name: 'Support Staff', access: 'Access orders view, trigger delivery tracking checkups, search medicines.', count: '1 User' }
            ].map((role, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Card className="glass" sx={{ p: 3, height: 160, display: 'flex', flexDirection: 'column', justifycontent: 'space-between' }}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 750, color: 'var(--foreground)' }}>{role.name}</Typography>
                      <Chip label={role.count} size="small" sx={{ fontSize: '9px', fontWeight: 700 }} />
                    </Box>
                    <Typography variant="caption" sx={{ color: '#a1a1aa', lineHeight: 1.5, display: 'block' }}>{role.access}</Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* PERMISSIONS VIEW */}
      {activeTab === 'permissions' && (
        <Paper className="glass" sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>Fine-Grained Matrix</Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>Audit table showing accessible navigation modules mapped to user roles.</Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Navigation Node</TableCell>
                  <TableCell>Super Admin</TableCell>
                  <TableCell>Pharmacist</TableCell>
                  <TableCell>Support</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { node: 'Medicines Inventory (Add, Delete)', sa: true, ph: true, su: false },
                  { node: 'Prescription Audits (Approve, Reject)', sa: true, ph: true, su: false },
                  { node: 'Customer & Order Logs', sa: true, ph: true, su: true },
                  { node: 'Store Settings Configurations', sa: true, ph: false, su: false }
                ].map((perm, i) => (
                  <TableRow key={i} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.02)' } }}>
                    <TableCell sx={{ color: '#a1a1aa', fontWeight: 600 }}>{perm.node}</TableCell>
                    <TableCell sx={{ color: '#10b981', fontWeight: 600 }}>{perm.sa ? '✓ Authorized' : '✕ Denied'}</TableCell>
                    <TableCell sx={{ color: perm.ph ? '#10b981' : '#ef4444', fontWeight: 600 }}>{perm.ph ? '✓ Authorized' : '✕ Denied'}</TableCell>
                    <TableCell sx={{ color: perm.su ? '#10b981' : '#ef4444', fontWeight: 600 }}>{perm.su ? '✓ Authorized' : '✕ Denied'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}
