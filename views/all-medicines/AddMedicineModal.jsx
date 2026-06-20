import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  Button,
  IconButton
} from '@mui/material';
import { useMedicine } from '../../services/medicineService/MedicineContext';

export default function AddMedicineModal({ open, onClose, onSaved }) {
  const { addMedicine, categories, loadCategories, brands, loadBrands } = useMedicine();
  const [form, setForm] = useState({
    name: '', sku: '', category: '', brand: '', stock: '', price: '', expiry: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Load categories and brands if not already loaded
  useEffect(() => {
    if (open) {
      if (categories.length === 0) {
        loadCategories().catch(err => console.error("Error loading categories", err));
      }
      if (brands.length === 0) {
        loadBrands().catch(err => console.error("Error loading brands", err));
      }
    }
  }, [open, categories, brands]);

  // Set default category when categories list changes or is loaded
  useEffect(() => {
    if (categories.length > 0 && !form.category) {
      setForm(prev => ({ ...prev, category: categories[0]._id }));
    }
  }, [categories]);

  // Set default brand when brands list changes or is loaded
  useEffect(() => {
    if (brands.length > 0 && !form.brand) {
      setForm(prev => ({ ...prev, brand: brands[0].brandName }));
    }
  }, [brands]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.brand || !form.sku || !form.stock || !form.price || !form.category) {
      onSaved('Please fill in all required fields.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const body = {
        medicineName: form.name,
        batchNumber: form.sku,
        category: form.category,
        manufacturer: form.brand,
        stock: parseInt(form.stock),
        purchasePrice: parseFloat(form.price) * 0.8,
        sellingPrice: parseFloat(form.price),
        mrp: parseFloat(form.price),
        expiryDate: form.expiry ? new Date(form.expiry).toISOString() : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      };
      await addMedicine(body);
      onSaved(`${form.name} added successfully!`, 'success');
      setForm({ name: '', sku: '', category: categories[0]?._id || '', brand: '', stock: '', price: '', expiry: '' });
      onClose();
    } catch (err) {
      onSaved('Failed to add medicine: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const labelSx = {
    fontWeight: 700,
    color: '#a1a1aa',
    mb: 0.8,
    display: 'block',
    textTransform: 'uppercase',
    fontSize: '11px',
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: 'var(--card-bg, #18181b)',
          border: '1px solid var(--card-border, rgba(255,255,255,0.08))',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
            Add New Medicine
          </Typography>
          <Typography variant="caption" sx={{ color: '#71717a' }}>
            Register a new drug SKU with stock, pricing, and categorizations.
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#71717a', '&:hover': { color: 'var(--foreground)' } }}>
          ✕
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: 'var(--card-border)', pt: 2.5 }}>
        <Box component="form" id="add-medicine-form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Grid container spacing={2}>
            <Grid xs={12} sm={6}>
              <Typography variant="caption" sx={labelSx}>Medicine Name *</Typography>
              <TextField fullWidth placeholder="e.g. Paracetamol 650mg" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </Grid>
            <Grid xs={12} sm={6}>
              <Typography variant="caption" sx={labelSx}>SKU / Code *</Typography>
              <TextField fullWidth placeholder="e.g. MED-1092" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid xs={12} sm={6}>
              <Typography variant="caption" sx={labelSx}>Brand / Manufacturer *</Typography>
              <Select fullWidth value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required>
                {brands.map((b) => (
                  <MenuItem key={b._id} value={b._id}>{b.brandName}</MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid xs={12} sm={6}>
              <Typography variant="caption" sx={labelSx}>Therapeutic Category *</Typography>
              <Select fullWidth value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>{cat.categoryName}</MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid xs={12} sm={4}>
              <Typography variant="caption" sx={labelSx}>Price (₹) *</Typography>
              <TextField fullWidth type="number" placeholder="e.g. 140.00" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </Grid>
            <Grid xs={12} sm={4}>
              <Typography variant="caption" sx={labelSx}>Initial Stock Qty *</Typography>
              <TextField fullWidth type="number" placeholder="e.g. 100" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
            </Grid>
            <Grid xs={12} sm={4}>
              <Typography variant="caption" sx={labelSx}>Expiry Date</Typography>
              <TextField fullWidth type="date" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} InputLabelProps={{ shrink: true }} />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, gap: 1.5 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ borderColor: 'var(--card-border)', color: '#a1a1aa', '&:hover': { borderColor: '#a1a1aa', color: 'white' } }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="add-medicine-form"
          variant="contained"
          disabled={submitting}
          sx={{
            background: 'linear-gradient(to right, #ec4899, #9333ea)',
            color: 'white',
            px: 3,
            '&:hover': { background: 'linear-gradient(to right, #db2777, #7e22ce)' },
            '&:disabled': { opacity: 0.5 },
          }}
        >
          {submitting ? 'Adding…' : 'Add Medicine'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
