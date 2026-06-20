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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  TablePagination,
} from '@mui/material';
import { useOrder } from '../../services/orderService/OrderContext';

export default function OrdersView({ activeTab }) {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { orders, loading, loadOrders, updateOrderStatus, cancelOrder, updateOrder, deleteOrder, pagination } = useOrder();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editItems, setEditItems] = useState([]);
  const [editPaymentStatus, setEditPaymentStatus] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [openEditModal, setOpenEditModal] = useState(false);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const showToast = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Reset page when switching tabs
  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  // Fetch orders from backend when activeTab, page, or rowsPerPage changes
  useEffect(() => {
    loadOrders({ status: activeTab, page, limit: rowsPerPage }).catch((err) => {
      showToast('Failed to load orders: ' + err.message, 'error');
    });
  }, [activeTab, page, rowsPerPage]);

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setEditItems(order.items ? order.items.map(item => ({
      _id: item._id,
      medicineId: item.medicineId?._id || item.medicineId,
      medicineName: item.medicineId?.medicineName || 'Medicine',
      quantity: item.quantity
    })) : []);
    setEditPaymentStatus(order.paymentStatus || 'Pending');
    setEditStatus(order.status || 'New Orders');
    setOpenEditModal(true);
  };

  const handleQtyChange = (index, value) => {
    const updated = [...editItems];
    updated[index].quantity = Math.max(1, parseInt(value) || 1);
    setEditItems(updated);
  };

  const handleSaveEdit = async () => {
    if (!selectedOrder) return;
    try {
      const payload = {
        items: editItems.map(item => ({
          medicineId: item.medicineId,
          quantity: item.quantity
        })),
        paymentStatus: editPaymentStatus,
        status: editStatus
      };

      await updateOrder(selectedOrder._id, payload);
      showToast('Order updated successfully!');
      setOpenEditModal(false);
    } catch (err) {
      showToast('Failed to update order: ' + err.message, 'error');
    }
  };

  const handleDelete = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order? This will permanently delete the order record and restore any active stock.")) {
      try {
        await deleteOrder(orderId);
        showToast('Order deleted successfully!');
      } catch (err) {
        showToast('Failed to delete order: ' + err.message, 'error');
      }
    }
  };

  const filteredOrders = orders;

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
            {(activeTab || '').replace('-', ' ')}
          </Typography>
          <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>
            Audit orders, manage drug dispensaries, and track customer details.
          </Typography>
        </Box>

        {loading && orders.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={36} sx={{ color: '#ec4899' }} />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>User Name</TableCell>
                    <TableCell>Medicines</TableCell>
                    <TableCell>Total Amount</TableCell>
                    <TableCell>Order Status</TableCell>
                    <TableCell>Payment Status</TableCell>
                    <TableCell>Payment Method</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order._id} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.02)' } }}>
                      <TableCell sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
                            {`ORD-${order._id.slice(-6).toUpperCase()}`}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#71717a', fontSize: '9px' }}>
                            {order._id}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'var(--foreground)', fontWeight: 600 }}>
                        {order?.userId?.name || 'Guest User'}
                      </TableCell>
                      <TableCell sx={{ color: '#a1a1aa' }}>
                        {order?.items?.map((item) => `${item.medicineId?.medicineName || 'Medicine'} (${item.quantity})`).join(', ')}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'white' }}>
                        ₹{order?.totalAmount}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order?.status || 'New Orders'}
                          size="small"
                          sx={{
                            fontSize: '9px',
                            fontWeight: 700,
                            borderRadius: '6px',
                            border: '1px solid',
                            bgcolor: 'rgba(236,72,153,0.08)',
                            borderColor: 'rgba(236,72,153,0.2)',
                            color: '#ec4899',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order?.paymentStatus || 'Pending'}
                          size="small"
                          sx={{
                            fontSize: '9px',
                            fontWeight: 700,
                            borderRadius: '6px',
                            border: '1px solid',
                            bgcolor: order?.paymentStatus === 'Paid' ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
                            borderColor: order?.paymentStatus === 'Paid' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
                            color: order?.paymentStatus === 'Paid' ? '#10b981' : '#f59e0b',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'var(--foreground)' }}>
                        {order?.paymentMethod || 'COD'}
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleEdit(order)}
                            sx={{ fontSize: '9px' }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleDelete(order._id)}
                            sx={{ fontSize: '9px' }}
                          >
                            Delete
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredOrders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4, color: '#71717a', fontStyle: 'italic' }}>
                        No orders present in this log queue.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={pagination.totalOrders || 0}
              rowsPerPage={rowsPerPage}
              page={page - 1}
              onPageChange={(event, newPage) => setPage(newPage + 1)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(1);
              }}
              sx={{
                borderTop: '1px solid var(--divider)',
                color: '#a1a1aa',
                '& .MuiTablePagination-selectIcon': {
                  color: '#a1a1aa'
                },
                '& .MuiTablePagination-actions': {
                  color: '#a1a1aa'
                }
              }}
            />
          </>
        )}
      </Paper>

      {/* Edit Order Modal */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid var(--card-border)' }}>
          Edit Order - {selectedOrder ? `ORD-${selectedOrder._id.slice(-6).toUpperCase()}` : ''}
        </DialogTitle>
        <DialogContent sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {selectedOrder && (
            <>
              {/* Customer Details */}
              <Box>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>Customer</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {selectedOrder.userId?.name || 'Guest User'} ({selectedOrder.userId?.phone || 'No Phone'})
                </Typography>
              </Box>

              {/* Edit Quantities */}
              <Box>
                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1.5 }}>
                  Medicines & Quantities
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {editItems.map((item, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, border: '1px solid var(--card-border)', borderRadius: '8px' }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, maxWidth: '70%' }}>
                        {item.medicineName}
                      </Typography>
                      <TextField
                        type="number"
                        label="Quantity"
                        size="small"
                        value={item.quantity}
                        onChange={(e) => handleQtyChange(idx, e.target.value)}
                        slotProps={{ htmlInput: { min: 1 } }}
                        sx={{ width: 90 }}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Status and Payment Selectors */}
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <TextField
                  select
                  label="Order Status"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="New Orders">New Orders</MenuItem>
                  <MenuItem value="Processing Orders">Processing Orders</MenuItem>
                  <MenuItem value="Shipped Orders">Shipped Orders</MenuItem>
                  <MenuItem value="Delivered Orders">Delivered Orders</MenuItem>
                  <MenuItem value="Cancelled Orders">Cancelled Orders</MenuItem>
                </TextField>

                <TextField
                  select
                  label="Payment Status"
                  value={editPaymentStatus}
                  onChange={(e) => setEditPaymentStatus(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Paid">Paid</MenuItem>
                  <MenuItem value="Failed">Failed</MenuItem>
                </TextField>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: '1px solid var(--card-border)' }}>
          <Button onClick={() => setOpenEditModal(false)} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} variant="contained" sx={{ backgroundColor: '#ec4899', '&:hover': { backgroundColor: '#db2777' } }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
