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

export default function CustomersView({ activeTab }) {
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

      {/* CUSTOMERS LIST VIEW */}
      {activeTab === 'all-customers' && (
        <Paper className="glass" sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>All Registered Customers</Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>Patient repository and historical buyer database.</Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Mobile</TableCell>
                  <TableCell>Total Orders</TableCell>
                  <TableCell>Health Group</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { name: 'Ramesh Kumar', email: 'ramesh@gmail.com', phone: '+91 98765-43210', orders: 12, group: 'Hypertension' },
                  { name: 'Sunita Sharma', email: 'sunita.s@gmail.com', phone: '+91 98123-45678', orders: 5, group: 'Diabetic Care' },
                  { name: 'Mohit Verma', email: 'mohit.v@yahoo.com', phone: '+91 99000-88877', orders: 2, group: 'General Healthcare' },
                  { name: 'Anjali Gupta', email: 'anjali@company.in', phone: '+91 88877-66554', orders: 21, group: 'VIP Patient' }
                ].map((cust, i) => (
                  <TableRow key={i} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.02)' } }}>
                    <TableCell sx={{ fontWeight: 700, color: 'var(--foreground)' }}>{cust.name}</TableCell>
                    <TableCell sx={{ color: '#a1a1aa' }}>{cust.email}</TableCell>
                    <TableCell sx={{ color: '#a1a1aa' }}>{cust.phone}</TableCell>
                    <TableCell sx={{ fontWeight: 650, color: 'white' }}>{cust.orders} Orders</TableCell>
                    <TableCell>
                      <Chip label={cust.group} size="small" sx={{ fontSize: '9px', fontWeight: 700, color: '#a855f7', bgcolor: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.2)' }} />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => showToast(`Opening patient record for ${cust.name}`)}
                        sx={{ borderColor: 'var(--card-border)', color: '#a1a1aa' }}
                      >
                        Records
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* CUSTOMER GROUPS VIEW */}
      {activeTab === 'customer-groups' && (
        <Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>Patient & Customer Groups</Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>Segment patient directories for email newsletters and refill triggers.</Typography>
          </Box>
          <Grid container spacing={3}>
            {[
              { title: 'Diabetic Refills', count: '142 Patients', color: 'rgba(236,72,153,0.02)', borderColor: 'rgba(236,72,153,0.2)', desc: 'Auto-refill reminders sent every 28 days for Metformin/Insulin.' },
              { title: 'Hypertension VIP', count: '98 Patients', color: 'rgba(168,85,247,0.02)', borderColor: 'rgba(168,85,247,0.2)', desc: 'Patients with cardiovascular prescriptions requiring regular monitoring.' },
              { title: 'Geriatric Support', count: '210 Patients', color: 'rgba(16,185,129,0.02)', borderColor: 'rgba(16,185,129,0.2)', desc: 'Senior citizens eligible for 15% discount on medicines.' },
              { title: 'General Over-Counter', count: '1,450 Patients', color: 'rgba(255,255,255,0.01)', borderColor: 'var(--card-border)', desc: 'General OTC users purchasing vitamins and pain relief tablets.' }
            ].map((gp, i) => (
              <Grid xs={12} sm={6} lg={3} key={i}>
                <Card className="glass" sx={{ height: 210, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', bgcolor: gp.color, borderColor: gp.borderColor }}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 750, color: 'var(--foreground)' }}>{gp.title}</Typography>
                      <Chip label={gp.count} size="small" sx={{ fontSize: '9px', fontWeight: 700 }} />
                    </Box>
                    <Typography variant="caption" sx={{ color: '#a1a1aa', mt: 2, display: 'block', lineHeight: 1.5 }}>{gp.desc}</Typography>
                  </Box>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    onClick={() => showToast(`Campaign dispatch simulated for ${gp.title}`)}
                    sx={{ borderColor: 'var(--card-border)', color: 'var(--foreground)', fontSize: '10px' }}
                  >
                    Send Refill Broadcast
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}
