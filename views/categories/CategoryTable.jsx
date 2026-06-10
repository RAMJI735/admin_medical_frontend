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

function CategoryTable({
  categories = [],
  medicines = [],
  deleteCatConfirmId,
  handleDeleteCategory,
  setEditCategory
}) {
  return (
    <TableContainer component={Paper} className="glass" sx={{ boxShadow: 'none', background: 'transparent' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Category Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Medicines Count</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((cat) => {
            const count = medicines.filter(m => m.category === cat.categoryName).length;
            const isDeleteConfirm = deleteCatConfirmId === cat._id;
            return (
              <TableRow key={cat._id} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.02)' } }}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
                    {cat.categoryName}
                  </Typography>
                </TableCell>
                <TableCell sx={{ color: '#a1a1aa', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {cat.description || 'No description available.'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={`${count} Meds`}
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
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setEditCategory(cat)}
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
                      onClick={() => handleDeleteCategory(cat._id, cat.categoryName)}
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
          {categories.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ color: '#a1a1aa', py: 4 }}>
                No categories available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default CategoryTable;