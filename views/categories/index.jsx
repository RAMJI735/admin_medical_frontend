'use client';

import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button
} from '@mui/material';
import CategoryTable from './CategoryTable';

function Categories({
  categories = [],
  medicines = [],
  deleteCatConfirmId,
  setDeleteCatConfirmId,
  handleDeleteCategory,
  editCategory,
  setEditCategory,
  setNewCat,
  newCat,
  handleAddCategorySubmit
}) {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
          Medicine Categories
        </Typography>
        <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>
          Classification directories for managing inventory therapeutic index.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Categories List Table */}
        <Grid item xs={12} md={8}>
          <CategoryTable
            categories={categories}
            medicines={medicines}
            deleteCatConfirmId={deleteCatConfirmId}
            setDeleteCatConfirmId={setDeleteCatConfirmId}
            handleDeleteCategory={handleDeleteCategory}
            editCategory={editCategory}
            setEditCategory={setEditCategory}
          />
        </Grid>

        {/* Add Category Form Card */}
        <Grid item xs={12} md={4}>
          <Paper className="glass" sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
                Add New Category
              </Typography>
              <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>
                Create a new therapeutic group index in the database.
              </Typography>
            </Box>
            <Box
              component="form"
              onSubmit={handleAddCategorySubmit}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
            >
              <Box>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}
                >
                  Category Name *
                </Typography>
                <TextField
                  fullWidth
                  placeholder="e.g. Analgesics"
                  value={newCat.name || ''}
                  onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                  required
                />
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}
                >
                  Description
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="e.g. Pain relief and antipyretic formulations"
                  value={newCat.description || ''}
                  onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                />
              </Box>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: 'linear-gradient(to right, #ec4899, #9333ea)',
                  color: 'white',
                  py: 1.2,
                  '&:hover': { background: 'linear-gradient(to right, #db2777, #7e22ce)' },
                }}
              >
                Add Category
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Categories;