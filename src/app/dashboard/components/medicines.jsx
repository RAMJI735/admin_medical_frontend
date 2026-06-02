'use client';

import { useState, useMemo } from 'react';
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
  Select,
  MenuItem,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Snackbar,
  Alert,
} from '@mui/material';

export default function MedicinesView({ activeTab }) {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showToast = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // State for formulations
  const [medicines, setMedicines] = useState([
    { id: 1, name: 'Paracetamol 650mg', sku: 'MED-7291', category: 'Analgesics', brand: 'Crocin', stock: 120, price: '₹45.00', status: 'In Stock', expiry: '2027-10-15' },
    { id: 2, name: 'Amoxicillin 500mg', sku: 'MED-4109', category: 'Antibiotics', brand: 'Novamox', stock: 8, price: '₹120.00', status: 'Low Stock', expiry: '2026-07-20' },
    { id: 3, name: 'Metformin 1000mg', sku: 'MED-8812', category: 'Antidiabetics', brand: 'Glycomet', stock: 240, price: '₹85.00', status: 'In Stock', expiry: '2028-02-10' },
    { id: 4, name: 'Atorvastatin 10mg', sku: 'MED-3341', category: 'Cardiovascular', brand: 'Lipvas', stock: 0, price: '₹140.00', status: 'Out of Stock', expiry: '2026-06-25' },
    { id: 5, name: 'Ibuprofen 400mg', sku: 'MED-2209', category: 'Analgesics', brand: 'Brufen', stock: 150, price: '₹38.00', status: 'In Stock', expiry: '2027-12-05' },
    { id: 6, name: 'Cough Syrup 100ml', sku: 'MED-0912', category: 'Respiratory', brand: 'Benadryl', stock: 3, price: '₹105.00', status: 'Low Stock', expiry: '2026-06-12' },
  ]);

  const [newMed, setNewMed] = useState({ name: '', sku: '', category: 'Analgesics', brand: '', stock: '', price: '', expiry: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMedicines = useMemo(() => {
    return medicines.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [medicines, searchQuery]);

  const handleAddMedicineSubmit = (e) => {
    e.preventDefault();
    if (!newMed.name || !newMed.brand || !newMed.sku || !newMed.stock || !newMed.price) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    const stockNum = parseInt(newMed.stock);
    const status = stockNum === 0 ? 'Out of Stock' : (stockNum <= 10 ? 'Low Stock' : 'In Stock');
    const newEntry = {
      id: medicines.length + 1,
      name: newMed.name,
      sku: newMed.sku,
      category: newMed.category,
      brand: newMed.brand,
      stock: stockNum,
      price: `₹${parseFloat(newMed.price).toFixed(2)}`,
      status,
      expiry: newMed.expiry || '2027-12-31'
    };
    setMedicines([newEntry, ...medicines]);
    showToast(`${newMed.name} added successfully!`);
    setNewMed({ name: '', sku: '', category: 'Analgesics', brand: '', stock: '', price: '', expiry: '' });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%', borderRadius: '12px' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* ALL MEDICINES VIEW */}
      {activeTab === 'all-medicines' && (
        <Paper className="glass" sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>All Medicines</Typography>
              <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>Catalog directory of registered medical formulations and pills.</Typography>
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
                  <TableCell>Medicine & SKU</TableCell>
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
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>{m.name}</Typography>
                      <Typography variant="caption" sx={{ color: '#71717a' }}>{m.sku}</Typography>
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
                          backgroundColor: m.status === 'In Stock' ? 'rgba(16, 185, 129, 0.1)' : m.status === 'Low Stock' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          borderColor: m.status === 'In Stock' ? 'rgba(16, 185, 129, 0.2)' : m.status === 'Low Stock' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          color: m.status === 'In Stock' ? '#10b981' : m.status === 'Low Stock' ? '#f59e0b' : '#ef4444',
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => showToast(`Opening details for ${m.name}`)}
                        sx={{ borderColor: 'var(--card-border)', color: '#a1a1aa', '&:hover': { borderColor: '#a1a1aa', color: 'white' } }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* ADD MEDICINE VIEW */}
      {activeTab === 'add-medicine' && (
        <Paper className="glass" sx={{ p: 3, maxWidth: 640 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>Add New Medicine</Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>Register a new drug SKU with stock, pricing, and categorizations.</Typography>
          </Box>

          <Box component="form" onSubmit={handleAddMedicineSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}>Medicine Name *</Typography>
                <TextField
                  fullWidth
                  placeholder="e.g. Paracetamol 650mg"
                  value={newMed.name}
                  onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}>SKU / Code *</Typography>
                <TextField
                  fullWidth
                  placeholder="e.g. MED-1092"
                  value={newMed.sku}
                  onChange={(e) => setNewMed({ ...newMed, sku: e.target.value })}
                  required
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}>Brand / Manufacturer *</Typography>
                <TextField
                  fullWidth
                  placeholder="e.g. Abbott Labs"
                  value={newMed.brand}
                  onChange={(e) => setNewMed({ ...newMed, brand: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}>Therapeutic Category</Typography>
                <Select
                  fullWidth
                  value={newMed.category}
                  onChange={(e) => setNewMed({ ...newMed, category: e.target.value })}
                >
                  <MenuItem value="Analgesics">Analgesics (Pain Relief)</MenuItem>
                  <MenuItem value="Antibiotics">Antibiotics (Anti-bacterial)</MenuItem>
                  <MenuItem value="Antidiabetics">Antidiabetics</MenuItem>
                  <MenuItem value="Cardiovascular">Cardiovascular</MenuItem>
                  <MenuItem value="Respiratory">Respiratory / Cough</MenuItem>
                </Select>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}>Price (₹) *</Typography>
                <TextField
                  fullWidth
                  type="number"
                  placeholder="e.g. 140.00"
                  value={newMed.price}
                  onChange={(e) => setNewMed({ ...newMed, price: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}>Initial Stock Qty *</Typography>
                <TextField
                  fullWidth
                  type="number"
                  placeholder="e.g. 100"
                  value={newMed.stock}
                  onChange={(e) => setNewMed({ ...newMed, stock: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}>Expiry Date</Typography>
                <TextField
                  fullWidth
                  type="date"
                  value={newMed.expiry}
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
                '&:hover': {
                  background: 'linear-gradient(to right, #db2777, #7e22ce)',
                }
              }}
            >
              Add Formulation
            </Button>
          </Box>
        </Paper>
      )}

      {/* CATEGORIES VIEW */}
      {activeTab === 'categories' && (
        <Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>Medicine Categories</Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>Classification directories for managing inventory therapeutic index.</Typography>
          </Box>
          <Grid container spacing={3}>
            {[
              { name: 'Analgesics & Antipyretics', count: 18, desc: 'Pain management and fever reduction formulations.' },
              { name: 'Antibiotics & Antivirals', count: 24, desc: 'Bacterial and viral infection medications.' },
              { name: 'Antidiabetics', count: 12, desc: 'Blood sugar regulation capsules and metformin compounds.' },
              { name: 'Cardiovascular Agents', count: 15, desc: 'Cholesterol reducers, blood pressure pills, statins.' },
              { name: 'Respiratory and Pulmonology', count: 9, desc: 'Bronchodilators, antihistamines, cough syrups.' },
              { name: 'Dermatological Compounding', count: 11, desc: 'Antifungal ointments, skin steroids, moisturizers.' }
            ].map((cat, i) => (
              <Grid item xs={12} sm={6} lg={4} key={i}>
                <Card className="glass" sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', '&:hover': { borderColor: 'var(--foreground)' }, transition: 'border-color 0.3s' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>{cat.name}</Typography>
                      <Chip label={`${cat.count} Meds`} size="small" sx={{ fontSize: '10px', fontWeight: 700, color: '#ec4899', backgroundColor: 'rgba(236,72,153,0.08)', borderColor: 'rgba(236,72,153,0.2)', borderStyle: 'solid', borderWidth: '1px' }} />
                    </Box>
                    <Typography variant="caption" sx={{ color: '#a1a1aa', lineHeight: 1.5, display: 'block' }}>{cat.desc}</Typography>
                  </CardContent>
                  <Box 
                    onClick={() => showToast(`Navigating to ${cat.name} index`)}
                    sx={{ p: 2, borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: '#71717a', cursor: 'pointer', '&:hover': { color: 'var(--foreground)' } }}
                  >
                    <span>Browse Category Directory</span>
                    <span>→</span>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* BRANDS VIEW */}
      {activeTab === 'brands' && (
        <Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>Pharmaceutical Brands</Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>Affiliated manufacturing partners and drug brand catalogs.</Typography>
          </Box>
          <Grid container spacing={3}>
            {[
              { name: 'Pfizer Ltd', logo: 'Pz', country: 'USA', rating: '5.0' },
              { name: 'Abbott Healthcare', logo: 'Ab', country: 'USA', rating: '4.9' },
              { name: 'GlaxoSmithKline', logo: 'GSK', country: 'UK', rating: '4.8' },
              { name: 'Cipla India', logo: 'Cp', country: 'India', rating: '4.9' },
              { name: 'Novartis AG', logo: 'Nv', country: 'Switzerland', rating: '4.7' },
              { name: 'Sun Pharma', logo: 'Sun', country: 'India', rating: '4.6' },
              { name: 'Lupin Corp', logo: 'Lp', country: 'India', rating: '4.5' },
              { name: 'Zydus Cadila', logo: 'Zy', country: 'India', rating: '4.4' },
            ].map((brand, i) => (
              <Grid item xs={6} sm={4} md={3} lg={2.4} key={i}>
                <Card className="glass" sx={{ textAlign: 'center', p: 3, '&:hover': { borderColor: 'var(--foreground)' }, transition: 'all 0.3s' }}>
                  <Avatar sx={{ width: 48, height: 48, mx: 'auto', mb: 2, bgcolor: 'rgba(147, 51, 234, 0.1)', color: '#a855f7', fontWeight: 705, border: '1px solid rgba(147, 51, 234, 0.2)' }}>
                    {brand.logo}
                  </Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--foreground)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{brand.name}</Typography>
                  <Typography variant="caption" sx={{ color: '#71717a', display: 'block', mt: 0.5 }}>{brand.country} • ★ {brand.rating}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* INVENTORY VIEW */}
      {activeTab === 'inventory' && (
        <Paper className="glass" sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>Inventory Levels</Typography>
              <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>Audit log and status indicators for stockpiled drug packages.</Typography>
            </Box>
            <Button variant="contained" color="primary" onClick={() => showToast('Reorder requests dispatched to Suppliers.')}>
              Order Low Stock Items
            </Button>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.15)', p: 3, borderRadius: '16px' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>Adequate Stock</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--foreground)', mt: 1 }}>1,248 Items</Typography>
                <Typography variant="caption" sx={{ color: '#71717a', mt: 0.5, display: 'block' }}>No restock necessary right now.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ backgroundColor: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.15)', p: 3, borderRadius: '16px' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase' }}>Low Stock Warning</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--foreground)', mt: 1 }}>14 Items</Typography>
                <Typography variant="caption" sx={{ color: '#71717a', mt: 0.5, display: 'block' }}>Quantity is below the safety limit threshold.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)', p: 3, borderRadius: '16px' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#ef4444', textTransform: 'uppercase' }}>Out of Stock</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--foreground)', mt: 1 }}>3 Items</Typography>
                <Typography variant="caption" sx={{ color: '#71717a', mt: 0.5, display: 'block' }}>Sales disabled due to vacant inventory slots.</Typography>
              </Box>
            </Grid>
          </Grid>

          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'var(--foreground)', mb: 2 }}>Stock Health Details</Typography>
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
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: 'var(--foreground)' }}>Amoxicillin 500mg</TableCell>
                  <TableCell sx={{ color: '#f59e0b', fontWeight: 650 }}>8 Units</TableCell>
                  <TableCell sx={{ color: '#a1a1aa' }}>20 Units</TableCell>
                  <TableCell><Chip label="Auto-Reordering" size="small" variant="outlined" sx={{ color: '#f59e0b', borderColor: 'rgba(245,158,11,0.2)', fontSize: '9px', fontWeight: 700 }} /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: 'var(--foreground)' }}>Atorvastatin 10mg</TableCell>
                  <TableCell sx={{ color: '#ef4444', fontWeight: 650 }}>0 Units</TableCell>
                  <TableCell sx={{ color: '#a1a1aa' }}>30 Units</TableCell>
                  <TableCell><Chip label="CRITICAL" size="small" sx={{ bgcolor: 'rgba(239,68,68,0.1)', color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)', borderStyle: 'solid', borderWidth: '1px', fontSize: '9px', fontWeight: 700 }} /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: 'var(--foreground)' }}>Cough Syrup 100ml</TableCell>
                  <TableCell sx={{ color: '#f59e0b', fontWeight: 650 }}>3 Units</TableCell>
                  <TableCell sx={{ color: '#a1a1aa' }}>15 Units</TableCell>
                  <TableCell><Chip label="Manual Review Required" size="small" variant="outlined" sx={{ color: '#f59e0b', borderColor: 'rgba(245,158,11,0.2)', fontSize: '9px', fontWeight: 700 }} /></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* EXPIRY ALERTS VIEW */}
      {activeTab === 'expiry-alerts' && (
        <Paper className="glass" sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#ef4444' }}>Critical Expiry Alerts</Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>Near-term expiry notifications. Immediate clearance or disposal protocol advised.</Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { id: 1, name: 'Cough Syrup 100ml', sku: 'MED-0912', brand: 'Benadryl', date: '2026-06-12', days: '10 days left', severity: 'critical' },
              { id: 2, name: 'Atorvastatin 10mg', sku: 'MED-3341', brand: 'Lipvas', date: '2026-06-25', days: '23 days left', severity: 'warning' },
              { id: 3, name: 'Amoxicillin 500mg', sku: 'MED-4109', brand: 'Novamox', date: '2026-07-20', days: '48 days left', severity: 'info' }
            ].map((alert) => (
              <Box 
                key={alert.id} 
                sx={{ 
                  p: 2.5, 
                  borderRadius: '16px', 
                  border: '1px solid',
                  backgroundColor: alert.severity === 'critical' ? 'rgba(239, 68, 68, 0.03)' : alert.severity === 'warning' ? 'rgba(245, 158, 11, 0.03)' : 'rgba(255, 255, 255, 0.02)',
                  borderColor: alert.severity === 'critical' ? 'rgba(239, 68, 68, 0.15)' : alert.severity === 'warning' ? 'rgba(245, 158, 11, 0.15)' : 'var(--card-border)',
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { sm: 'center' },
                  gap: 2,
                }}
              >
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: alert.severity === 'critical' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: alert.severity === 'critical' ? '#ef4444' : '#f59e0b' }}>
                    ⚠️
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>{alert.name}</Typography>
                    <Typography variant="caption" sx={{ color: '#71717a' }}>{alert.sku} • {alert.brand}</Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: alert.severity === 'critical' ? '#ef4444' : '#f59e0b' }}>{alert.days}</Typography>
                  <Typography variant="caption" sx={{ color: '#71717a' }}>Expires: {alert.date}</Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => showToast(`Initiated disposal protocol for batch of ${alert.name}`)}
                  sx={{ borderColor: 'var(--card-border)', color: '#a1a1aa', '&:hover': { borderColor: '#ef4444', color: '#f87171' } }}
                >
                  Dispose Batch
                </Button>
              </Box>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
}
