'use client';

import { useEffect, useState } from 'react';
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
  CircularProgress,
} from '@mui/material';
import { useOrder } from '../../services/orderService/OrderContext';

export default function OrdersView({ activeTab }) {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { orders, loading, loadOrders, updateOrderStatus, cancelOrder } = useOrder();

  const showToast = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Fetch orders on mount
  useEffect(() => {
    loadOrders().catch((err) => {
      showToast('Failed to load orders: ' + err.message, 'error');
    });
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (!o.status) return false;
    return o.status.toLowerCase().replace(/\s+/g, '-') === activeTab;
  });

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
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)', textTransform: 'capitalize' }}>
            {activeTab.replace('-', ' ')}
          </Typography>
          <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>
            Audit orders, manage drug dispensaries, and track courier logistics.
          </Typography>
        </Box>

        {loading && orders.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={36} sx={{ color: '#ec4899' }} />
          </Box>
        ) : (
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
                {filteredOrders.map((order) => (
                  <TableRow key={order._id} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.02)' } }}>
                    <TableCell sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
                      {`ORD-${order._id.slice(-6).toUpperCase()}`}
                    </TableCell>
                    <TableCell sx={{ color: 'var(--foreground)', fontWeight: 600 }}>
                      {order.userId?.name || 'Guest User'}
                    </TableCell>
                    <TableCell sx={{ color: '#a1a1aa', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {order.items
                        .map((item) => `${item.medicineId?.medicineName || 'Medicine'} x ${item.quantity}`)
                        .join(', ') || 'No items'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'white' }}>
                      {`₹${(order.totalAmount || 0).toFixed(2)}`}
                    </TableCell>
                    <TableCell sx={{ color: '#71717a', fontSize: '10px' }}>
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
                    </TableCell>
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
                            color: order.rxVerified ? '#10b981' : '#f59e0b',
                          }}
                        />
                      ) : (
                        <Typography variant="caption" sx={{ color: '#71717a' }}>
                          None
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        {activeTab === 'new-orders' && (
                          <>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={async () => {
                                if (order.rxRequired && !order.rxVerified) {
                                  showToast('Cannot approve. Doctor prescription verification pending.', 'error');
                                } else {
                                  try {
                                    await updateOrderStatus(order._id, 'Processing Orders');
                                    showToast(`Order approved and moved to Processing`);
                                  } catch (err) {
                                    showToast('Failed to approve order: ' + err.message, 'error');
                                  }
                                }
                              }}
                              sx={{ backgroundColor: '#ec4899', fontSize: '9px', '&:hover': { backgroundColor: '#db2777' } }}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={async () => {
                                try {
                                  await cancelOrder(order._id);
                                  showToast(`Order has been cancelled.`);
                                } catch (err) {
                                  showToast('Failed to cancel order: ' + err.message, 'error');
                                }
                              }}
                              sx={{
                                borderColor: 'var(--card-border)',
                                color: '#a1a1aa',
                                fontSize: '9px',
                                '&:hover': { color: '#ef4444', borderColor: '#ef4444' },
                              }}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {activeTab === 'processing-orders' && (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={async () => {
                              try {
                                await updateOrderStatus(order._id, 'Shipped Orders');
                                showToast(`Order has been shipped via Delivery Partner.`);
                              } catch (err) {
                                showToast('Failed to dispatch order: ' + err.message, 'error');
                              }
                            }}
                            sx={{ backgroundColor: '#ec4899', fontSize: '9px', '&:hover': { backgroundColor: '#db2777' } }}
                          >
                            Dispatch Courier
                          </Button>
                        )}
                        {activeTab === 'shipped-orders' && (
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            onClick={async () => {
                              try {
                                await updateOrderStatus(order._id, 'Delivered Orders');
                                showToast(`Order marked as successfully delivered.`);
                              } catch (err) {
                                showToast('Failed to deliver order: ' + err.message, 'error');
                              }
                            }}
                            sx={{ fontSize: '9px' }}
                          >
                            Mark Delivered
                          </Button>
                        )}
                        {['delivered-orders', 'cancelled-orders'].includes(activeTab) && (
                          <Typography variant="caption" sx={{ color: '#71717a', fontStyle: 'italic' }}>
                            Archived
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4, color: '#71717a', fontStyle: 'italic' }}>
                      No orders present in this log queue.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
