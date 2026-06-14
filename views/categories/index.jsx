'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import { useMedicine } from '../../services/medicineService/MedicineContext';
import CategoryTable from './CategoryTable';
import AddCategoryModal from './AddCategoryModal';
import EditCategoryModal from './EditCategoryModal';

function Categories() {
  const { categories, medicines, deleteCategory } = useMedicine();
  const [addOpen, setAddOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [deleteCatConfirmId, setDeleteCatConfirmId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showToast = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDeleteCategory = async (id, name) => {
    if (deleteCatConfirmId !== id) {
      setDeleteCatConfirmId(id);
      setTimeout(() => setDeleteCatConfirmId(prev => prev === id ? null : prev), 3000);
      return;
    }
    try {
      await deleteCategory(id);
      showToast(`Category "${name}" deleted successfully!`);
      setDeleteCatConfirmId(null);
    } catch (err) {
      showToast('Failed to delete category: ' + err.message, 'error');
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

      {/* Add Category Modal */}
      <AddCategoryModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSaved={handleSaved}
      />

      {/* Edit Category Modal */}
      <EditCategoryModal
        open={!!editCategory}
        category={editCategory}
        onClose={() => setEditCategory(null)}
        onSaved={handleSaved}
      />

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
            Medicine Categories
          </Typography>
          <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>
            Classification directories for managing inventory therapeutic index.
          </Typography>
        </Box>
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
          Add Category
        </Button>
      </Box>

      {/* Categories List Table - Full Width */}
      <CategoryTable
        categories={categories}
        medicines={medicines}
        deleteCatConfirmId={deleteCatConfirmId}
        handleDeleteCategory={handleDeleteCategory}
        setEditCategory={setEditCategory}
      />
    </Paper>
  );
}

export default Categories;