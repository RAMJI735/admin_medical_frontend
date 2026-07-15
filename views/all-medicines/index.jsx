'use client';

import React, { useState } from 'react';
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
  Alert
} from '@mui/material';
import { useMedicine } from '../../services/medicineService/MedicineContext';
import AddMedicineModal from './AddMedicineModal';
import EditMedicineModal from './EditMedicineModal';

function AllMedicines({
  filteredMedicines = [],
  searchQuery,
  setSearchQuery
}) {
  const { deleteMedicine } = useMedicine();
  const [addOpen, setAddOpen] = useState(false);
  const [editMedicine, setEditMedicine] = useState(null);
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

  const handleSaved = (message, severity = 'success') => {
    showToast(message, severity);
  };

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
            onChange={(e) => setSearchQuery(e.target.value)}
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

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Medicine &amp; SKU</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Expiry Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMedicines.map((m) => (
              <TableRow key={m.id} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.02)' } }}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
                    {m.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#71717a' }}>
                    {m.sku}
                  </Typography>
                </TableCell>
                <TableCell sx={{ color: '#a1a1aa' }}>{m.category}</TableCell>
                <TableCell sx={{ color: '#a1a1aa' }}>{m.brand}</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'var(--foreground)' }}>{m.price}</TableCell>
                <TableCell sx={{ color: '#a1a1aa', fontWeight: 650 }}>{m.stock} Units</TableCell>
                <TableCell>
                  <Chip
                    label={m.status}
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
                  {(() => {
                    if (!m?.expiry || m.expiry === 'N/A') return <Typography variant="body2" sx={{ color: '#a1a1aa' }}>N/A</Typography>;
                    
                    const expiryDate = new Date(m.expiry);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    const diffTime = expiryDate - today;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    const isExpired = diffDays < 0;
                    
                    let statusText = '';
                    if (isExpired) {
                      statusText = 'Expired';
                    } else if (diffDays === 0) {
                      statusText = 'Expires Today';
                    } else {
                      statusText = `Not Expired (${diffDays} days remaining)`;
                    }
                    
                    return (
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
                    );
                  })()}
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setEditMedicine(m)}
                      sx={{
                        borderColor: 'var(--card-border)',
                        color: '#a1a1aa',
                        '&:hover': { borderColor: '#a1a1aa', color: 'white' },
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteMedicine(m.id, m.name)}
                      sx={{
                        borderColor: deleteConfirmId === m.id ? '#ef4444' : 'rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        bgcolor: deleteConfirmId === m.id ? 'rgba(239,68,68,0.1)' : 'transparent',
                        '&:hover': { borderColor: '#ef4444', bgcolor: 'rgba(239,68,68,0.15)' },
                      }}
                    >
                      {deleteConfirmId === m.id ? 'Confirm?' : 'Delete'}
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {filteredMedicines.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ color: '#a1a1aa', py: 4 }}>
                  No formulations found matching search query.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default AllMedicines;
