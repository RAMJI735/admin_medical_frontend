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
  Chip,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';

export default function SuppliersView({ activeTab }) {
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

      {/* SUPPLIERS VIEW */}
      {activeTab === 'all-suppliers' && (
        <Paper className="glass" sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>Registered Suppliers</Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>Wholesale drug distributors and manufacturing contractors.</Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Supplier Company</TableCell>
                  <TableCell>Contact Representative</TableCell>
                  <TableCell>Active Catalog Items</TableCell>
                  <TableCell>Delivery Performance</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { name: 'Karan Pharma Distributors', rep: 'Karan Johar', items: 150, perf: '98%', status: 'Active' },
                  { name: 'Medica Life Distributors', rep: 'Vipul Mehta', items: 85, perf: '95%', status: 'Active' },
                  { name: 'Wellness Wholesalers Ltd', rep: 'Seema Rao', items: 210, perf: '89%', status: 'Suspended' }
                ].map((sup, i) => (
                  <TableRow key={i} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.02)' } }}>
                    <TableCell sx={{ fontWeight: 700, color: 'var(--foreground)' }}>{sup.name}</TableCell>
                    <TableCell sx={{ color: '#a1a1aa' }}>{sup.rep}</TableCell>
                    <TableCell sx={{ color: '#a1a1aa', fontWeight: 600 }}>{sup.items} Formulations</TableCell>
                    <TableCell>
                      <Chip
                        label={`${sup.perf} Rating`}
                        size="small"
                        sx={{
                          fontSize: '10px',
                          fontWeight: 700,
                          color: parseInt(sup.perf) >= 95 ? '#10b981' : '#f59e0b',
                          bgcolor: parseInt(sup.perf) >= 95 ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)'
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => showToast(`Initiating restock chat with ${sup.name}`)}
                        sx={{ borderColor: 'var(--card-border)', color: '#a1a1aa' }}
                      >
                        Contact
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {activeTab === 'add-supplier' && (
        <Paper className="glass" sx={{ p: 3, maxWidth: 520 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>Add Wholesale Supplier</Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>Register a new distributor company to expand medicine procurement options.</Typography>
          </Box>

          <Box component="form" onSubmit={(e) => { e.preventDefault(); showToast('Supplier successfully registered!'); }} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 705, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}>Supplier Name *</Typography>
              <TextField fullWidth placeholder="e.g. Apex Biotech Wholesalers" required />
            </Box>
            <Grid container spacing={2}>
              <Grid xs={6}>
                <Typography variant="caption" sx={{ fontWeight: 705, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}>Contact Person *</Typography>
                <TextField fullWidth placeholder="e.g. Amit Kumar" required />
              </Grid>
              <Grid xs={6}>
                <Typography variant="caption" sx={{ fontWeight: 705, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}>License Number *</Typography>
                <TextField fullWidth placeholder="e.g. DL-20381-A" required />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid xs={6}>
                <Typography variant="caption" sx={{ fontWeight: 705, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}>Email *</Typography>
                <TextField fullWidth type="email" placeholder="e.g. wholesale@apex.com" required />
              </Grid>
              <Grid xs={6}>
                <Typography variant="caption" sx={{ fontWeight: 705, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}>Phone *</Typography>
                <TextField fullWidth placeholder="e.g. +91 90001-20000" required />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              sx={{ background: 'linear-gradient(to right, #ec4899, #9333ea)', color: 'white' }}
            >
              Register Distributor
            </Button>
          </Box>
        </Paper>
      )}

      {/* PURCHASE ORDERS VIEW */}
      {activeTab === 'purchase-orders' && (
        <Paper className="glass" sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>Purchase Orders (PO)</Typography>
              <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>Audit log of drug purchases and restocks made by the store.</Typography>
            </Box>
            <Button variant="contained" onClick={() => showToast('Redirecting to PO Composer...')}>Create Purchase Order</Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>PO Number</TableCell>
                  <TableCell>Supplier</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Cost</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: 'white' }}>PO-2026-009</TableCell>
                  <TableCell sx={{ color: 'var(--foreground)' }}>Karan Pharma</TableCell>
                  <TableCell sx={{ color: '#a1a1aa' }}>Novamox 500mg x 500 Capsules</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'var(--foreground)' }}>₹42,000.00</TableCell>
                  <TableCell><Chip label="Dispatched" size="small" sx={{ bgcolor: 'rgba(245,158,11,0.1)', color: '#f59e0b', fontSize: '9px', fontWeight: 700 }} /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: 'white' }}>PO-2026-008</TableCell>
                  <TableCell sx={{ color: 'var(--foreground)' }}>Medica Life</TableCell>
                  <TableCell sx={{ color: '#a1a1aa' }}>Glycomet 1000mg x 1000 tablets</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'var(--foreground)' }}>₹28,500.00</TableCell>
                  <TableCell><Chip label="Delivered" size="small" sx={{ bgcolor: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: '9px', fontWeight: 700 }} /></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}
