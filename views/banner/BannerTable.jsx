'use client';

import React from 'react';
import {
  Box,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper
} from '@mui/material';

function BannerTable({
  banners = [],
  deleteConfirmId,
  handleDeleteBanner,
  setEditBanner
}) {
  return (
    <TableContainer component={Paper} className="glass" sx={{ boxShadow: 'none', background: 'transparent' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Preview</TableCell>
            <TableCell>Banner Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Destination Link</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {banners.map((banner) => {
            const isDeleteConfirm = deleteConfirmId === banner._id;
            return (
              <TableRow key={banner._id} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.02)' } }}>
                {/* Preview column */}
                <TableCell>
                  <Box
                    component="img"
                    src={banner.image}
                    alt={banner.title}
                    onError={(e) => {
                      // fallback for invalid image urls
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/120x60/27272a/a1a1aa?text=No+Image';
                    }}
                    sx={{
                      width: 90,
                      height: 50,
                      borderRadius: '8px',
                      objectFit: 'cover',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      bgcolor: '#09090b',
                    }}
                  />
                </TableCell>
                {/* Title */}
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
                    {banner.title}
                  </Typography>
                </TableCell>
                {/* Description */}
                <TableCell sx={{ color: '#a1a1aa', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {banner.description || 'No description provided.'}
                </TableCell>
                {/* Link */}
                <TableCell sx={{ color: '#a1a1aa', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {banner.link ? (
                    <Typography
                      component="a"
                      href={banner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="body2"
                      sx={{
                        color: '#38bdf8',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      {banner.link}
                    </Typography>
                  ) : (
                    'None'
                  )}
                </TableCell>
                {/* Status Flags */}
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {banner.default && (
                      <Chip
                        label="Default"
                        size="small"
                        sx={{
                          fontSize: '10px',
                          fontWeight: 700,
                          color: '#ec4899',
                          backgroundColor: 'rgba(236,72,153,0.08)',
                          borderColor: 'rgba(236,72,153,0.2)',
                          borderStyle: 'solid',
                          borderWidth: '1px',
                        }}
                      />
                    )}
                    <Chip
                      label={banner.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      sx={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: banner.isActive ? '#10b981' : '#71717a',
                        backgroundColor: banner.isActive ? 'rgba(16,185,129,0.08)' : 'rgba(113,113,122,0.08)',
                        borderColor: banner.isActive ? 'rgba(16,185,129,0.2)' : 'rgba(113,113,122,0.2)',
                        borderStyle: 'solid',
                        borderWidth: '1px',
                      }}
                    />
                  </Box>
                </TableCell>
                {/* Actions */}
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setEditBanner(banner)}
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
                      onClick={() => handleDeleteBanner(banner._id, banner.title)}
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
          {banners.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ color: '#a1a1aa', py: 4 }}>
                No banners configured. Click "Add Banner" to upload one.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default BannerTable;
