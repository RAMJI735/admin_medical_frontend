import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  IconButton
} from '@mui/material';
import { useMedicine } from '../../services/medicineService/MedicineContext';

export default function AddCategoryModal({ open, onClose, onSaved }) {
  const { addCategory } = useMedicine();
  const [form, setForm] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      onSaved('Category name is required', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await addCategory({
        categoryName: form.name,
        description: form.description
      });
      onSaved(`Category "${form.name}" added successfully!`, 'success');
      setForm({ name: '', description: '' });
      onClose();
    } catch (err) {
      onSaved('Failed to add category: ' + err.message, 'error');
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
      <DialogTitle sx={{ pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
            Add New Category
          </Typography>
          <Typography variant="caption" sx={{ color: '#71717a' }}>
            Create a new therapeutic group index.
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#71717a', '&:hover': { color: 'var(--foreground)' } }}>
          ✕
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: 'var(--card-border)', pt: 2.5 }}>
        <Box component="form" id="add-category-form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box>
            <Typography variant="caption" sx={labelSx}>Category Name *</Typography>
            <TextField
              fullWidth
              placeholder="e.g. Analgesics"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </Box>
          <Box>
            <Typography variant="caption" sx={labelSx}>Description</Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="e.g. Pain relief and antipyretic formulations"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
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
          form="add-category-form"
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
          {submitting ? 'Adding…' : 'Add Category'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
