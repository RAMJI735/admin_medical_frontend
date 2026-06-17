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
import { useBanner } from '../../services/bannerService/BannerContext';

export default function AddBannerModal({ open, banner, onClose, onSaved }) {
  const { addBanner, updateBanner } = useBanner();
  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '',
    link: '',
    isActive: true,
    default: false
  });
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = !!banner;

  useEffect(() => {
    if (banner) {
      setForm({
        title: banner.title || '',
        description: banner.description || '',
        image: banner.image || '',
        link: banner.link || '',
        isActive: banner.isActive !== undefined ? banner.isActive : true,
        default: banner.default || false
      });
    } else {
      setForm({
        title: '',
        description: '',
        image: '',
        link: '',
        isActive: true,
        default: false
      });
    }
  }, [banner, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      onSaved('Banner title is required', 'error');
      return;
    }
    if (!form.image.trim()) {
      onSaved('Banner image URL or path is required', 'error');
      return;
    }
    setSubmitting(true);
    try {
      if (isEditMode) {
        await updateBanner(banner._id, {
          title: form.title,
          description: form.description,
          image: form.image,
          link: form.link,
          isActive: form.isActive,
          default: form.default
        });
        onSaved(`Banner "${form.title}" updated successfully!`, 'success');
      } else {
        await addBanner({
          title: form.title,
          description: form.description,
          image: form.image,
          link: form.link,
          isActive: form.isActive,
          default: form.default
        });
        onSaved(`Banner "${form.title}" created successfully!`, 'success');
      }
      onClose();
    } catch (err) {
      onSaved(`Failed to ${isEditMode ? 'update' : 'add'} banner: ` + err.message, 'error');
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
            {isEditMode ? 'Edit Banner' : 'Add New Banner'}
          </Typography>
          <Typography variant="caption" sx={{ color: '#71717a' }}>
            {isEditMode ? 'Update promotional content and attributes.' : 'Create a new app display layout.'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#71717a', '&:hover': { color: 'var(--foreground)' } }}>
          ✕
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: 'var(--card-border)', pt: 2.5 }}>
        <Box component="form" id="banner-form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box>
            <Typography variant="caption" sx={labelSx}>Banner Title *</Typography>
            <TextField
              fullWidth
              placeholder="e.g. Monsoon Health Sale"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={labelSx}>Description</Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="e.g. Flat 20% off on generic formulations"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={labelSx}>Image URL or Path *</Typography>
            <TextField
              fullWidth
              placeholder="e.g. https://domain.com/banner.jpg"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              required
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={labelSx}>Destination Link</Typography>
            <TextField
              fullWidth
              placeholder="e.g. /dashboard/medicines/all-medicines"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  color="primary"
                />
              }
              label={
                <Typography variant="caption" sx={{ ...labelSx, mb: 0 }}>
                  Active Status
                </Typography>
              }
            />

            <FormControlLabel
              control={
                <Switch
                  checked={form.default}
                  onChange={(e) => setForm({ ...form, default: e.target.checked })}
                  color="primary"
                />
              }
              label={
                <Typography variant="caption" sx={{ ...labelSx, mb: 0 }}>
                  Set as Default
                </Typography>
              }
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
          form="banner-form"
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
          {submitting ? 'Saving…' : (isEditMode ? 'Save Changes' : 'Add Banner')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
