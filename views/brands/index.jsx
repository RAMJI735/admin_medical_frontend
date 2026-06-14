'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Snackbar,
  Alert
} from '@mui/material';
import { useMedicine } from '../../services/medicineService/MedicineContext';
import AddBrandModal from './AddBrandModal';
import EditBrandModal from './EditBrandModal';

function Brands() {
  const {
    brands,
    loadBrands,
    deleteBrand,
    loading
  } = useMedicine();

  // Local state
  const [addOpen, setAddOpen] = useState(false);
  const [editBrand, setEditBrand] = useState(null); // brand object being edited
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showToast = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Load brands on mount
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        await loadBrands();
      } catch (err) {
        showToast('Failed to load brands: ' + (err.response?.data?.message || err.message), 'error');
      }
    };
    fetchBrands();
  }, []);

  // Filter brands based on search
  const filteredBrands = useMemo(() => {
    if (!brands) return [];
    return brands.filter(b =>
      b.brandName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [brands, searchQuery]);

  // Handle Delete Brand
  const handleDelete = async (id, name) => {
    if (deleteConfirmId !== id) {
      setDeleteConfirmId(id);
      // Auto cancel after 3 seconds
      setTimeout(() => {
        setDeleteConfirmId(prev => prev === id ? null : prev);
      }, 3000);
      return;
    }

    try {
      await deleteBrand(id);
      showToast(`Brand "${name}" deleted successfully!`);
      setDeleteConfirmId(null);
    } catch (err) {
      showToast('Failed to delete brand: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'B';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
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

      {/* Add Brand Modal */}
      <AddBrandModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSaved={handleSaved}
      />

      {/* Edit Brand Modal */}
      <EditBrandModal
        open={!!editBrand}
        brand={editBrand}
        onClose={() => setEditBrand(null)}
        onSaved={handleSaved}
      />

      {/* Title Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
            Pharmaceutical Brands
          </Typography>
          <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>
            Affiliated manufacturing partners and drug brand catalogs.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search brands..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: 250 }}
          />
          <Button
            variant="contained"
            onClick={() => setAddOpen(true)}
            sx={{
              background: 'linear-gradient(to right, #ec4899, #9333ea)',
              color: 'white',
              px: 3,
              fontWeight: 600,
              '&:hover': { background: 'linear-gradient(to right, #db2777, #7e22ce)' },
            }}
          >
            Add a Brand
          </Button>
        </Box>
      </Box>

      <TableContainer sx={{ boxShadow: 'none', background: 'transparent' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Logo</TableCell>
              <TableCell>Brand Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBrands.map((brand) => {
              const isDeleteConfirm = deleteConfirmId === brand._id;
              return (
                <TableRow key={brand._id} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.02)' } }}>
                  <TableCell>
                    <Avatar
                      src={brand.logo}
                      alt={brand.brandName}
                      sx={{
                        width: 38,
                        height: 38,
                        bgcolor: 'rgba(147, 51, 234, 0.1)',
                        color: '#a855f7',
                        fontWeight: 700,
                        border: '1px solid rgba(147, 51, 234, 0.2)',
                        fontSize: '14px'
                      }}
                    >
                      {getInitials(brand.brandName)}
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
                      {brand.brandName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={brand.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      sx={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: brand.isActive ? '#10b981' : '#f43f5e',
                        backgroundColor: brand.isActive ? 'rgba(16,185,129,0.08)' : 'rgba(244,63,94,0.08)',
                        borderColor: brand.isActive ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)',
                        borderStyle: 'solid',
                        borderWidth: '1px',
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setEditBrand(brand)}
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
                        onClick={() => handleDelete(brand._id, brand.brandName)}
                        sx={{
                          borderColor: isDeleteConfirm ? '#ef4444' : 'rgba(239, 68, 68, 0.2)',
                          color: '#ef4444',
                          bgcolor: isDeleteConfirm ? 'rgba(239,68,68,0.1)' : 'transparent',
                          '&:hover': { borderColor: '#ef4444', bgcolor: 'rgba(239,68,68,0.15)' },
                        }}
                      >
                        {isDeleteConfirm ? 'Confirm?' : 'Delete'}
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredBrands.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ color: '#a1a1aa', py: 6 }}>
                  {loading ? 'Loading brands...' : 'No brands available.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default Brands;
