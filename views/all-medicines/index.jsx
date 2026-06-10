'use client';

import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Chip
} from '@mui/material';

function AllMedicines({
  filteredMedicines = [],
  searchQuery,
  setSearchQuery,
  setEditMedicine,
  handleDeleteMedicine,
  deleteConfirmId
}) {
  return (
    <Paper className="glass" sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { sm: 'center' },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
            All Medicines
          </Typography>
          <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>
            Catalog directory of registered medical formulations and pills.
          </Typography>
        </Box>
        <TextField
          size="small"
          placeholder="Search name, brand, SKU..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: { xs: '100%', sm: 260 } }}
        />
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Medicine &amp; SKU</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMedicines.map((m) => (
              <TableRow key={m.id} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.02)' } }}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
                    {m.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#71717a' }}>
                    {m.sku}
                  </Typography>
                </TableCell>
                <TableCell sx={{ color: '#a1a1aa' }}>{m.category}</TableCell>
                <TableCell sx={{ color: '#a1a1aa' }}>{m.brand}</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'var(--foreground)' }}>{m.price}</TableCell>
                <TableCell sx={{ color: '#a1a1aa', fontWeight: 650 }}>{m.stock} Units</TableCell>
                <TableCell>
                  <Chip
                    label={m.status}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      fontSize: '10px',
                      borderRadius: '8px',
                      border: '1px solid',
                      backgroundColor:
                        m.status === 'In Stock'
                          ? 'rgba(16, 185, 129, 0.1)'
                          : m.status === 'Low Stock'
                          ? 'rgba(245, 158, 11, 0.1)'
                          : 'rgba(239, 68, 68, 0.1)',
                      borderColor:
                        m.status === 'In Stock'
                          ? 'rgba(16, 185, 129, 0.2)'
                          : m.status === 'Low Stock'
                          ? 'rgba(245, 158, 11, 0.2)'
                          : 'rgba(239, 68, 68, 0.2)',
                      color: m.status === 'In Stock' ? '#10b981' : m.status === 'Low Stock' ? '#f59e0b' : '#ef4444',
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setEditMedicine(m)}
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
                      onClick={() => handleDeleteMedicine(m.id, m.name)}
                      sx={{
                        borderColor: deleteConfirmId === m.id ? '#ef4444' : 'rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        bgcolor: deleteConfirmId === m.id ? 'rgba(239,68,68,0.1)' : 'transparent',
                        '&:hover': { borderColor: '#ef4444', bgcolor: 'rgba(239,68,68,0.15)' },
                      }}
                    >
                      {deleteConfirmId === m.id ? 'Confirm?' : 'Delete'}
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {filteredMedicines.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ color: '#a1a1aa', py: 4 }}>
                  No formulations found matching search query.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default AllMedicines;
