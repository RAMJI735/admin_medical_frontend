import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  FormControlLabel,
  Switch
} from '@mui/material';
import { useMedicine } from '../../services/medicineService/MedicineContext';

export default function EditBrandModal({ open, brand, onClose, onSaved }) {
  const { updateBrand } = useMedicine();
  const [form, setForm] = useState({ brandName: '', logo: '', isActive: true });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (brand) {
      setForm({
        brandName: brand.brandName || '',
        logo: brand.logo || '',
        isActive: brand.isActive ?? true
      });
    }
  }, [brand]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.brandName.trim()) {
      onSaved('Brand name is required', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await updateBrand(brand._id, {
        brandName: form.brandName,
        logo: form.logo,
        isActive: form.isActive
      });
      onSaved('Brand updated successfully!', 'success');
      onClose();
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      const errorMessage = serverErrors ? serverErrors.join(', ') : (err.response?.data?.message || err.message);
      onSaved('Failed to update brand: ' + errorMessage, 'error');
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
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            background: 'var(--card-bg, #18181b)',
            border: '1px solid var(--card-border, rgba(255,255,255,0.08))',
            borderRadius: '20px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
            Edit Brand
          </Typography>
          <Typography variant="caption" sx={{ color: '#71717a' }}>
            Modify brand parameters and status.
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#71717a', '&:hover': { color: 'var(--foreground)' } }}>
          ✕
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: 'var(--card-border)', pt: 2.5 }}>
        <Box component="form" id="edit-brand-form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box>
            <Typography variant="caption" sx={labelSx}>Brand Name *</Typography>
            <TextField
              fullWidth
              value={form.brandName}
              onChange={(e) => setForm({ ...form, brandName: e.target.value })}
              required
            />
          </Box>
          <Box>
            <Typography variant="caption" sx={labelSx}>Logo Image URL</Typography>
            <TextField
              fullWidth
              placeholder="https://example.com/logo.png"
              value={form.logo}
              onChange={(e) => setForm({ ...form, logo: e.target.value })}
            />
          </Box>
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  color="secondary"
                />
              }
              label="Active Status"
              sx={{ color: 'var(--foreground)' }}
            />
          </Box>
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
          form="edit-brand-form"
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
          {submitting ? 'Saving…' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
