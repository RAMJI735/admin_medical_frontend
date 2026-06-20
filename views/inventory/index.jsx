'use client';

import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip
} from '@mui/material';

function Inventory({
  medicines = [],
  showToast
}) {
  const inStockCount = medicines.filter(m => m.status === 'In Stock').length;
  const lowStockCount = medicines.filter(m => m.status === 'Low Stock').length;
  const outOfStockCount = medicines.filter(m => m.status === 'Out of Stock').length;

  return (
    <Paper className="glass" sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
            Inventory Levels
          </Typography>
          <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>
            Audit log and status indicators for stockpiled drug packages.
          </Typography>
        </Box>
        <Button variant="contained" color="primary" onClick={() => showToast('Reorder requests dispatched to Suppliers.')}>
          Order Low Stock Items
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} md={4}>
          <Box
            sx={{
              backgroundColor: 'rgba(16, 185, 129, 0.05)',
              border: '1px solid rgba(16, 185, 129, 0.15)',
              p: 3,
              borderRadius: '16px',
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>
              Adequate Stock
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--foreground)', mt: 1 }}>
              {inStockCount} Items
            </Typography>
            <Typography variant="caption" sx={{ color: '#71717a', mt: 0.5, display: 'block' }}>
              No restock necessary right now.
            </Typography>
          </Box>
        </Grid>
        <Grid xs={12} md={4}>
          <Box
            sx={{
              backgroundColor: 'rgba(245, 158, 11, 0.05)',
              border: '1px solid rgba(245, 158, 11, 0.15)',
              p: 3,
              borderRadius: '16px',
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase' }}>
              Low Stock Warning
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--foreground)', mt: 1 }}>
              {lowStockCount} Items
            </Typography>
            <Typography variant="caption" sx={{ color: '#71717a', mt: 0.5, display: 'block' }}>
              Quantity is below the safety limit threshold.
            </Typography>
          </Box>
        </Grid>
        <Grid xs={12} md={4}>
          <Box
            sx={{
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid rgba(239, 68, 68, 0.15)',
              p: 3,
              borderRadius: '16px',
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#ef4444', textTransform: 'uppercase' }}>
              Out of Stock
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--foreground)', mt: 1 }}>
              {outOfStockCount} Items
            </Typography>
            <Typography variant="caption" sx={{ color: '#71717a', mt: 0.5, display: 'block' }}>
              Sales disabled due to vacant inventory slots.
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'var(--foreground)', mb: 2 }}>
        Stock Health Details
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Medicine</TableCell>
              <TableCell>Current Stock</TableCell>
              <TableCell>Safety Reorder Limit</TableCell>
              <TableCell>Replenish Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {medicines
              .filter(m => m.status !== 'In Stock')
              .map((m) => (
                <TableRow key={m.id}>
                  <TableCell sx={{ fontWeight: 700, color: 'var(--foreground)' }}>{m.name}</TableCell>
                  <TableCell sx={{ color: m.status === 'Out of Stock' ? '#ef4444' : '#f59e0b', fontWeight: 650 }}>
                    {m.stock} Units
                  </TableCell>
                  <TableCell sx={{ color: '#a1a1aa' }}>10 Units</TableCell>
                  <TableCell>
                    <Chip
                      label={m.status === 'Out of Stock' ? 'CRITICAL' : 'Auto-Reordering'}
                      size="small"
                      variant="outlined"
                      sx={{
                        color: m.status === 'Out of Stock' ? '#ef4444' : '#f59e0b',
                        borderColor: m.status === 'Out of Stock' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
                        fontSize: '9px',
                        fontWeight: 700,
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            {medicines.filter(m => m.status !== 'In Stock').length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ color: '#a1a1aa', py: 4 }}>
                  All items are adequately stocked.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default Inventory;
