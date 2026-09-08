'use client';

import React, { useState, useMemo } from 'react';
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
  TextField,
  Button,
  Chip,
  Snackbar,
  Alert,
  Avatar,
  TablePagination,
  TableSortLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useMedicine } from '../../services/medicineService/MedicineContext';
import AddMedicineModal from './AddMedicineModal';
import EditMedicineModal from './EditMedicineModal';

const avatarBgColors = [
  { bg: 'rgba(115, 103, 240, 0.12)', color: '#7367f0' },
  { bg: 'rgba(40, 199, 111, 0.12)', color: '#28c76f' },
  { bg: 'rgba(0, 207, 234, 0.12)', color: '#00cfe8' },
  { bg: 'rgba(255, 159, 67, 0.12)', color: '#ff9f43' },
  { bg: 'rgba(234, 84, 85, 0.12)', color: '#ea5455' },
];

function getAvatarStyle(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % avatarBgColors.length;
  return avatarBgColors[index];
}

function AllMedicines({
  filteredMedicines = [],
  searchQuery,
  setSearchQuery
}) {
  const { deleteMedicine, loadMedicines, totalMedicines } = useMedicine();
  const [addOpen, setAddOpen] = useState(false);
  const [editMedicine, setEditMedicine] = useState(null);
  const [viewMedicine, setViewMedicine] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Sorting and Pagination states (standard React with backend integration)
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Trigger Backend Pagination request whenever page, itemsPerPage, or search changes
  React.useEffect(() => {
    loadMedicines({
      page: currentPage,
      limit: itemsPerPage,
      search: searchQuery
    }).catch(err => console.error("Error loading paginated medicines from backend", err));
  }, [currentPage, itemsPerPage, searchQuery]);

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

  const handleSaved = (message, severity = 'success') => {
    showToast(message, severity);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const descendingComparator = (a, b, orderBy) => {
    let valA = a[orderBy] ?? '';
    let valB = b[orderBy] ?? '';
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    if (valB < valA) return -1;
    if (valB > valA) return 1;
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const sortedData = useMemo(() => {
    return stableSort(filteredMedicines, getComparator(order, orderBy));
  }, [filteredMedicines, order, orderBy]);

  // Use backend paginated data if returned, otherwise slice locally as fallback
  const displayData = useMemo(() => {
    if (totalMedicines > 0 && filteredMedicines.length <= itemsPerPage) {
      return sortedData;
    }
    return sortedData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [sortedData, currentPage, itemsPerPage, totalMedicines, filteredMedicines]);

  const totalEntries = totalMedicines || filteredMedicines.length;
  const startEntry = totalEntries === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, totalEntries);

  return (
    <Paper className="glass" sx={{ p: 3, borderRadius: 0 }}>
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

      {/* Add Medicine Modal */}
      <AddMedicineModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSaved={handleSaved}
      />

      {/* Edit Medicine Modal */}
      <EditMedicineModal
        open={!!editMedicine}
        medicine={editMedicine}
        onClose={() => setEditMedicine(null)}
        onSaved={handleSaved}
      />

      {/* View Medicine Details Dialog */}
      <Dialog
        open={!!viewMedicine}
        onClose={() => setViewMedicine(null)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              background: 'var(--card-bg, #18181b)',
              border: '1px solid var(--card-border, rgba(255,255,255,0.08))',
              borderRadius: '20px',
              p: 1
            }
          }
        }}
      >
        <DialogTitle component="div" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography component="span" variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
            Medicine Details
          </Typography>
          <IconButton onClick={() => setViewMedicine(null)} size="small" sx={{ color: '#71717a' }}>✕</IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: 'var(--card-border)' }}>
          {viewMedicine && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Avatar
                  src={viewMedicine.image || viewMedicine.thumbnail}
                  sx={{
                    width: 54,
                    height: 54,
                    bgcolor: getAvatarStyle(viewMedicine.name).bg,
                    color: getAvatarStyle(viewMedicine.name).color,
                    fontWeight: 700,
                    fontSize: '20px'
                  }}
                >
                  {viewMedicine.name ? viewMedicine.name.charAt(0).toUpperCase() : 'M'}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
                    {viewMedicine.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#71717a' }}>
                    SKU: {viewMedicine.sku}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: '#a1a1aa' }}><strong>Category:</strong> {viewMedicine.category}</Typography>
              <Typography variant="body2" sx={{ color: '#a1a1aa' }}><strong>Brand:</strong> {viewMedicine.brand}</Typography>
              <Typography variant="body2" sx={{ color: '#a1a1aa' }}><strong>Price:</strong> {viewMedicine.price}</Typography>
              <Typography variant="body2" sx={{ color: '#a1a1aa' }}><strong>Stock:</strong> {viewMedicine.stock} Units</Typography>
              <Typography variant="body2" sx={{ color: '#a1a1aa' }}><strong>Status:</strong> {viewMedicine.status}</Typography>
              <Typography variant="body2" sx={{ color: '#a1a1aa' }}><strong>Expiry:</strong> {viewMedicine.expiry || 'N/A'}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setViewMedicine(null)} sx={{ color: '#a1a1aa', borderColor: 'var(--card-border)' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { sm: 'center' },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
            All Medicines
          </Typography>
          <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>
            Catalog directory of registered medical formulations and pills.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', width: { xs: '100%', sm: 'auto' } }}>
          <TextField
            size="small"
            placeholder="Search name, brand, SKU..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            sx={{ width: { xs: '100%', sm: 260 } }}
          />
          <Button
            variant="contained"
            onClick={() => setAddOpen(true)}
            sx={{
              background: 'linear-gradient(to right, #ec4899, #9333ea)',
              color: 'white',
              px: 3,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              '&:hover': { background: 'linear-gradient(to right, #db2777, #7e22ce)' },
            }}
          >
            Add Medicine
          </Button>
        </Box>
      </Box>

      <TableContainer sx={{ borderRadius: 0 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'var(--foreground)', fontWeight: 600 }}>
                Image
              </TableCell>
              <TableCell sx={{ color: 'var(--foreground)', fontWeight: 600 }}>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleRequestSort('name')}
                  sx={{ color: 'inherit !important', '& .MuiTableSortLabel-icon': { color: '#a1a1aa !important' } }}
                >
                  Title
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: 'var(--foreground)', fontWeight: 600 }}>
                <TableSortLabel
                  active={orderBy === 'category'}
                  direction={orderBy === 'category' ? order : 'asc'}
                  onClick={() => handleRequestSort('category')}
                  sx={{ color: 'inherit !important', '& .MuiTableSortLabel-icon': { color: '#a1a1aa !important' } }}
                >
                  Category
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: 'var(--foreground)', fontWeight: 600 }}>
                <TableSortLabel
                  active={orderBy === 'brand'}
                  direction={orderBy === 'brand' ? order : 'asc'}
                  onClick={() => handleRequestSort('brand')}
                  sx={{ color: 'inherit !important', '& .MuiTableSortLabel-icon': { color: '#a1a1aa !important' } }}
                >
                  Brand
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: 'var(--foreground)', fontWeight: 600 }}>
                <TableSortLabel
                  active={orderBy === 'price'}
                  direction={orderBy === 'price' ? order : 'asc'}
                  onClick={() => handleRequestSort('price')}
                  sx={{ color: 'inherit !important', '& .MuiTableSortLabel-icon': { color: '#a1a1aa !important' } }}
                >
                  Price
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: 'var(--foreground)', fontWeight: 600 }}>
                <TableSortLabel
                  active={orderBy === 'stock'}
                  direction={orderBy === 'stock' ? order : 'asc'}
                  onClick={() => handleRequestSort('stock')}
                  sx={{ color: 'inherit !important', '& .MuiTableSortLabel-icon': { color: '#a1a1aa !important' } }}
                >
                  Stock
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: 'var(--foreground)', fontWeight: 600 }}>
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? order : 'asc'}
                  onClick={() => handleRequestSort('status')}
                  sx={{ color: 'inherit !important', '& .MuiTableSortLabel-icon': { color: '#a1a1aa !important' } }}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: 'var(--foreground)', fontWeight: 600 }}>
                <TableSortLabel
                  active={orderBy === 'expiry'}
                  direction={orderBy === 'expiry' ? order : 'asc'}
                  onClick={() => handleRequestSort('expiry')}
                  sx={{ color: 'inherit !important', '& .MuiTableSortLabel-icon': { color: '#a1a1aa !important' } }}
                >
                  Expiry Date
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" sx={{ color: 'var(--foreground)', fontWeight: 600 }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayData.length > 0 ? (
              displayData.map((m) => {
                const isConfirming = deleteConfirmId === m.id;
                const avatarStyle = getAvatarStyle(m.name || 'M');

                const expiryDate = m?.expiry && m.expiry !== 'N/A' ? new Date(m.expiry) : null;
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                let diffDays = 0;
                let isExpired = false;
                let statusText = 'N/A';

                if (expiryDate) {
                  const diffTime = expiryDate - today;
                  diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  isExpired = diffDays < 0;
                  if (isExpired) statusText = 'Expired';
                  else if (diffDays === 0) statusText = 'Expires Today';
                  else statusText = `Not Expired (${diffDays} days remaining)`;
                }

                return (
                  <TableRow key={m.id} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.02)' } }}>
                    <TableCell>
                      <Avatar
                        src={m.image || m.thumbnail}
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: avatarStyle.bg,
                          color: avatarStyle.color,
                          fontWeight: 700,
                          fontSize: '14px',
                        }}
                      >
                        {m.name ? m.name.charAt(0).toUpperCase() : 'M'}
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
                        {m.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#71717a' }}>
                        {m.sku}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: '#a1a1aa' }}>{m.category || 'N/A'}</TableCell>
                    <TableCell sx={{ color: '#a1a1aa' }}>{m.brand || 'N/A'}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
                      {typeof m.price === 'number' ? `₹${m.price}` : m.price}
                    </TableCell>
                    <TableCell sx={{ color: '#a1a1aa', fontWeight: 650 }}>{m.stock} Units</TableCell>
                    <TableCell>
                      <Chip
                        label={m.status || 'In Stock'}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '10px',
                          borderRadius: '8px',
                          border: '1px solid',
                          backgroundColor:
                            m.status === 'In Stock'
                              ? 'rgba(16, 185, 129, 0.1)'
                              : m.status === 'Low Stock'
                                ? 'rgba(245, 158, 11, 0.1)'
                                : 'rgba(239, 68, 68, 0.1)',
                          borderColor:
                            m.status === 'In Stock'
                              ? 'rgba(16, 185, 129, 0.2)'
                              : m.status === 'Low Stock'
                                ? 'rgba(245, 158, 11, 0.2)'
                                : 'rgba(239, 68, 68, 0.2)',
                          color: m.status === 'In Stock' ? '#10b981' : m.status === 'Low Stock' ? '#f59e0b' : '#ef4444',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {!expiryDate ? (
                        <Typography variant="body2" sx={{ color: '#a1a1aa' }}>N/A</Typography>
                      ) : (
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              color: isExpired ? '#ef4444' : '#a1a1aa',
                              fontWeight: isExpired ? 600 : 400
                            }}
                          >
                            {m.expiry}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: isExpired ? '#ef4444' : (diffDays <= 30 ? '#f59e0b' : '#10b981'),
                              display: 'block',
                              mt: 0.5,
                              fontWeight: 500
                            }}
                          >
                            {statusText}
                          </Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'flex-end' }}>
                        <Eye
                          style={{ width: 20, height: 20, color: '#3b82f6', cursor: 'pointer' }}
                          onClick={() => setViewMedicine(m)}
                        />
                        <Pencil
                          style={{ width: 20, height: 20, color: '#3b82f6', cursor: 'pointer' }}
                          onClick={() => setEditMedicine(m)}
                        />
                        {isConfirming ? (
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleDeleteMedicine(m.id, m.name)}
                            sx={{ py: 0.2, px: 1, fontSize: '11px', textTransform: 'none' }}
                          >
                            Confirm?
                          </Button>
                        ) : (
                          <Trash2
                            style={{ width: 20, height: 20, color: '#ef4444', cursor: 'pointer' }}
                            onClick={() => handleDeleteMedicine(m.id, m.name)}
                          />
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ color: '#a1a1aa', py: 4 }}>
                  No formulations found matching search query.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', mt: 2, gap: 2 }}>
        <Typography variant="body2" sx={{ color: '#a1a1aa' }}>
          Showing {startEntry}–{endEntry} of {totalEntries} entries
        </Typography>
        <TablePagination
          component="div"
          count={totalEntries}
          page={currentPage - 1}
          rowsPerPage={itemsPerPage}
          onPageChange={(_, newPage) => setCurrentPage(newPage + 1)}
          onRowsPerPageChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            color: '#a1a1aa',
            borderTop: 'none',
            '.MuiTablePagination-selectIcon': { color: '#a1a1aa' },
            '.MuiTablePagination-actions button': { color: '#a1a1aa' },
          }}
        />
      </Box>
    </Paper>
  );
}

export default AllMedicines;
