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
  Chip,
  Snackbar,
  Alert,
} from '@mui/material';

export default function OrdersView({ activeTab }) {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showToast = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // State for orders log
  const [orders, setOrders] = useState([
    { id: 'ORD-1092', customer: 'Ramesh Kumar', items: 'Paracetamol x 2, Cough Syrup x 1', total: '₹195.00', date: '2026-06-02 21:10', status: 'New Orders', rxRequired: true, rxVerified: false },
    { id: 'ORD-1091', customer: 'Sunita Sharma', items: 'Amoxicillin x 1, Glycomet x 3', total: '₹375.00', date: '2026-06-02 18:35', status: 'Processing Orders', rxRequired: true, rxVerified: true },
    { id: 'ORD-1090', customer: 'Vijay Mallya', items: 'Lipvas 10mg x 2', total: '₹280.00', date: '2026-06-01 14:20', status: 'Shipped Orders', rxRequired: false, rxVerified: false },
    { id: 'ORD-1089', customer: 'Anjali Gupta', items: 'Brufen 400mg x 4', total: '₹152.00', date: '2026-05-30', status: 'Delivered Orders', rxRequired: false, rxVerified: false },
    { id: 'ORD-1088', customer: 'Vikram Singh', items: 'Atorvastatin x 1', total: '₹140.00', date: '2026-05-29', status: 'Cancelled Orders', rxRequired: false, rxVerified: false }
  ]);

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

      <Paper className="glass" sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)', textTransform: 'capitalize' }}>{activeTab.replace('-', ' ')}</Typography>
          <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>Audit orders, manage drug dispensaries, and track courier logistics.</Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell>Formulation Items</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Rx Required</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders
                .filter(o => o.status.toLowerCase().replace(' ', '-') === activeTab)
                .map((order) => (
                  <TableRow key={order.id} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.02)' } }}>
                    <TableCell sx={{ fontWeight: 700, color: 'var(--foreground)' }}>{order.id}</TableCell>
                    <TableCell sx={{ color: 'var(--foreground)', fontWeight: 600 }}>{order.customer}</TableCell>
                    <TableCell sx={{ color: '#a1a1aa' }}>{order.items}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'white' }}>{order.total}</TableCell>
                    <TableCell sx={{ color: '#71717a', fontSize: '10px' }}>{order.date}</TableCell>
                    <TableCell>
                      {order.rxRequired ? (
                        <Chip
                          label={order.rxVerified ? 'Rx Verified' : 'Requires Rx'}
                          size="small"
                          sx={{
                            fontSize: '9px',
                            fontWeight: 700,
                            borderRadius: '6px',
                            border: '1px solid',
                            bgcolor: order.rxVerified ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
                            borderColor: order.rxVerified ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
                            color: order.rxVerified ? '#10b981' : '#f59e0b'
                          }}
                        />
                      ) : (
                        <Typography variant="caption" sx={{ color: '#71717a' }}>None</Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        {activeTab === 'new-orders' && (
                          <>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => {
                                if (order.rxRequired && !order.rxVerified) {
                                  showToast('Cannot approve. Doctor prescription verification pending.', 'error');
                                } else {
                                  setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'Processing Orders' } : o));
                                  showToast(`Order ${order.id} moved to Processing`);
                                }
                              }}
                              sx={{ backgroundColor: '#ec4899', fontSize: '9px', '&:hover': { backgroundColor: '#db2777' } }}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => {
                                setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'Cancelled Orders' } : o));
                                showToast(`Order ${order.id} has been cancelled.`);
                              }}
                              sx={{ borderColor: 'var(--card-border)', color: '#a1a1aa', fontSize: '9px', '&:hover': { color: '#ef4444', borderColor: '#ef4444' } }}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {activeTab === 'processing-orders' && (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                              setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'Shipped Orders' } : o));
                              showToast(`Order ${order.id} has been shipped via Delivery Partner.`);
                            }}
                            sx={{ backgroundColor: '#ec4899' }}
                          >
                            Dispatch Courier
                          </Button>
                        )}
                        {activeTab === 'shipped-orders' && (
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            onClick={() => {
                              setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'Delivered Orders' } : o));
                              showToast(`Order ${order.id} marked as successfully delivered.`);
                            }}
                          >
                            Mark Delivered
                          </Button>
                        )}
                        {['delivered-orders', 'cancelled-orders'].includes(activeTab) && (
                          <Typography variant="caption" sx={{ color: '#71717a', fontStyle: 'italic' }}>Archived</Typography>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
              ))}
              {orders.filter(o => o.status.toLowerCase().replace(' ', '-') === activeTab).length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, color: '#71717a', fontStyle: 'italic' }}>No orders present in this log queue.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
