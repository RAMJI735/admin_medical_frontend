'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Select,
  MenuItem,
  Button
} from '@mui/material';

function AddMedicine({
  newMed = {},
  setNewMed,
  categories = [],
  handleAddMedicineSubmit
}) {
  return (
    <Paper className="glass" sx={{ p: 3, maxWidth: 640 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
          Add New Medicine
        </Typography>
        <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>
          Register a new drug SKU with stock, pricing, and categorizations.
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={handleAddMedicineSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}
            >
              Medicine Name *
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g. Paracetamol 650mg"
              value={newMed.name || ''}
              onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}
            >
              SKU / Code *
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g. MED-1092"
              value={newMed.sku || ''}
              onChange={(e) => setNewMed({ ...newMed, sku: e.target.value })}
              required
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}
            >
              Brand / Manufacturer *
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g. Abbott Labs"
              value={newMed.brand || ''}
              onChange={(e) => setNewMed({ ...newMed, brand: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}
            >
              Therapeutic Category *
            </Typography>
            <Select
              fullWidth
              value={newMed.category || ''}
              onChange={(e) => setNewMed({ ...newMed, category: e.target.value })}
              required
            >
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}
            >
              Price (₹) *
            </Typography>
            <TextField
              fullWidth
              type="number"
              placeholder="e.g. 140.00"
              value={newMed.price || ''}
              onChange={(e) => setNewMed({ ...newMed, price: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}
            >
              Initial Stock Qty *
            </Typography>
            <TextField
              fullWidth
              type="number"
              placeholder="e.g. 100"
              value={newMed.stock || ''}
              onChange={(e) => setNewMed({ ...newMed, stock: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}
            >
              Expiry Date
            </Typography>
            <TextField
              fullWidth
              type="date"
              value={newMed.expiry || ''}
              onChange={(e) => setNewMed({ ...newMed, expiry: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          sx={{
            background: 'linear-gradient(to right, #ec4899, #9333ea)',
            color: 'white',
            py: 1.5,
            '&:hover': { background: 'linear-gradient(to right, #db2777, #7e22ce)' },
          }}
        >
          Add Formulation
        </Button>
      </Box>
    </Paper>
  );
}

export default AddMedicine;
