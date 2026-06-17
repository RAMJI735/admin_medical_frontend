'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { useBanner } from '../../services/bannerService/BannerContext';
import BannerTable from './BannerTable';
import AddBannerModal from './addBannerModal';

function BannerView() {
  const { banners, loading, loadBanners, deleteBanner } = useBanner();
  const [modalOpen, setModalOpen] = useState(false);
  const [editBannerData, setEditBannerData] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showToast = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    loadBanners().catch((err) => {
      showToast('Failed to load banners: ' + err.message, 'error');
    });
  }, []);

  const handleDeleteBanner = async (id, title) => {
    if (deleteConfirmId !== id) {
      setDeleteConfirmId(id);
      setTimeout(() => setDeleteConfirmId((prev) => (prev === id ? null : prev)), 3000);
      return;
    }
    try {
      await deleteBanner(id);
      showToast(`Banner "${title}" deleted successfully!`);
      setDeleteConfirmId(null);
    } catch (err) {
      showToast('Failed to delete banner: ' + err.message, 'error');
    }
  };

  const handleSaved = (message, severity = 'success') => {
    showToast(message, severity);
  };

  const handleOpenAdd = () => {
    setEditBannerData(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (banner) => {
    setEditBannerData(banner);
    setModalOpen(true);
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

      <AddBannerModal
        open={modalOpen}
        banner={editBannerData}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
            Promotional Banners
          </Typography>
          <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>
            Configure and schedule app promotional graphics and external link banners.
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={handleOpenAdd}
          sx={{
            background: 'linear-gradient(to right, #ec4899, #9333ea)',
            color: 'white',
            px: 3,
            fontWeight: 600,
            '&:hover': { background: 'linear-gradient(to right, #db2777, #7e22ce)' },
          }}
        >
          Add Banner
        </Button>
      </Box>

      {loading && banners.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={36} sx={{ color: '#ec4899' }} />
        </Box>
      ) : (
        <BannerTable
          banners={banners}
          deleteConfirmId={deleteConfirmId}
          handleDeleteBanner={handleDeleteBanner}
          setEditBanner={handleOpenEdit}
        />
      )}
    </Paper>
  );
}

export default BannerView;
