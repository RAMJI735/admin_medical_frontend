'use client';

import { useState, useMemo, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { api } from '@/utils/api';

// ─── Edit Medicine Modal ──────────────────────────────────────────────────────
function EditMedicineModal({ open, medicine, categories, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: '', sku: '', category: '', brand: '', stock: '', price: '', expiry: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (medicine) {
      setForm({
        name: medicine.name || '',
        sku: medicine.sku || '',
        category: medicine.categoryId || '',
        brand: medicine.brand || '',
        stock: medicine.stockRaw ?? '',
        price: medicine.priceRaw ?? '',
        expiry: medicine.expiry !== 'N/A' ? medicine.expiry : '',
      });
    }
  }, [medicine]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.brand || !form.sku || !form.stock || !form.price || !form.category) {
      return;
    }
    setSaving(true);
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
        expiryDate: form.expiry
          ? new Date(form.expiry).toISOString()
          : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      };
      await api.put(`/medicines/${medicine.id}`, body);
      onSaved(`${form.name} updated successfully!`);
      onClose();
    } catch (err) {
      onSaved('Failed to update medicine: ' + err.message, 'error');
    } finally {
      setSaving(false);
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
      <DialogTitle
        sx={{
          pb: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
            Edit Medicine
          </Typography>
          <Typography variant="caption" sx={{ color: '#71717a' }}>
            Update the details for this formulation.
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#71717a', '&:hover': { color: 'var(--foreground)' } }}>
          ✕
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: 'var(--card-border)', pt: 2.5 }}>
        <Box component="form" id="edit-medicine-form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={labelSx}>Medicine Name *</Typography>
              <TextField fullWidth value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={labelSx}>SKU / Batch Number *</Typography>
              <TextField fullWidth value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={labelSx}>Brand / Manufacturer *</Typography>
              <TextField fullWidth value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={labelSx}>Therapeutic Category *</Typography>
              <Select fullWidth value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>{cat.categoryName}</MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" sx={labelSx}>Price (₹) *</Typography>
              <TextField fullWidth type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" sx={labelSx}>Stock Qty *</Typography>
              <TextField fullWidth type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={4}>
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
          form="edit-medicine-form"
          variant="contained"
          disabled={saving}
          sx={{
            background: 'linear-gradient(to right, #ec4899, #9333ea)',
            color: 'white',
            px: 3,
            '&:hover': { background: 'linear-gradient(to right, #db2777, #7e22ce)' },
            '&:disabled': { opacity: 0.5 },
          }}
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Edit Category Modal ──────────────────────────────────────────────────────
function EditCategoryModal({ open, category, onClose, onSaved }) {
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (category) {
      setForm({ name: category.categoryName || '', description: category.description || '' });
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return;
    setSaving(true);
    try {
      await api.put(`/categories/${category._id}`, {
        categoryName: form.name,
        description: form.description,
      });
      onSaved(`"${form.name}" updated successfully!`);
      onClose();
    } catch (err) {
      onSaved('Failed to update category: ' + err.message, 'error');
    } finally {
      setSaving(false);
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
            Edit Category
          </Typography>
          <Typography variant="caption" sx={{ color: '#71717a' }}>
            Rename or update the description.
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#71717a', '&:hover': { color: 'var(--foreground)' } }}>
          ✕
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: 'var(--card-border)', pt: 2.5 }}>
        <Box component="form" id="edit-category-form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box>
            <Typography variant="caption" sx={labelSx}>Category Name *</Typography>
            <TextField
              fullWidth
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
          form="edit-category-form"
          variant="contained"
          disabled={saving}
          sx={{
            background: 'linear-gradient(to right, #ec4899, #9333ea)',
            color: 'white',
            px: 3,
            '&:hover': { background: 'linear-gradient(to right, #db2777, #7e22ce)' },
            '&:disabled': { opacity: 0.5 },
          }}
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MedicinesView({ activeTab }) {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', sku: '', category: '', brand: '', stock: '', price: '', expiry: '' });
  const [newCat, setNewCat] = useState({ name: '', description: '' });
  const [searchQuery, setSearchQuery] = useState('');

  // Delete confirm states
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteCatConfirmId, setDeleteCatConfirmId] = useState(null);

  // Edit modal states
  const [editMedicine, setEditMedicine] = useState(null);  // medicine object or null
  const [editCategory, setEditCategory] = useState(null);  // category object or null

  const showToast = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const loadCategories = async () => {
    try {
      const data = await api.get('/categories');
      setCategories(data);
      if (data.length > 0) {
        setNewMed(prev => ({ ...prev, category: data[0]._id }));
      }
    } catch (err) {
      showToast('Failed to load categories: ' + err.message, 'error');
    }
  };

  const loadMedicines = async () => {
    setLoading(true);
    try {
      const data = await api.get('/medicines?limit=100');
      const formatted = data.medicines.map(m => {
        const stockNum = m.stock;
        const status = stockNum === 0 ? 'Out of Stock' : (stockNum <= m.minStockLevel ? 'Low Stock' : 'In Stock');
        return {
          id: m._id,
          name: m.medicineName,
          sku: m.batchNumber,
          categoryId: m.category?._id || '',
          category: m.category?.categoryName || 'Uncategorized',
          brand: m.manufacturer,
          stock: stockNum,
          stockRaw: stockNum,
          price: `₹${m.sellingPrice.toFixed(2)}`,
          priceRaw: m.sellingPrice,
          status,
          expiry: m.expiryDate ? new Date(m.expiryDate).toISOString().split('T')[0] : 'N/A'
        };
      });
      setMedicines(formatted);
    } catch (err) {
      showToast('Failed to load medicines: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    loadMedicines();
  }, []);

  const filteredMedicines = useMemo(() => {
    return medicines.filter(m =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [medicines, searchQuery]);

  // ── Medicine CRUD ──
  const handleAddMedicineSubmit = async (e) => {
    e.preventDefault();
    if (!newMed.name || !newMed.brand || !newMed.sku || !newMed.stock || !newMed.price || !newMed.category) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    try {
      const body = {
        medicineName: newMed.name,
        batchNumber: newMed.sku,
        category: newMed.category,
        manufacturer: newMed.brand,
        stock: parseInt(newMed.stock),
        purchasePrice: parseFloat(newMed.price) * 0.8,
        sellingPrice: parseFloat(newMed.price),
        mrp: parseFloat(newMed.price),
        expiryDate: newMed.expiry ? new Date(newMed.expiry).toISOString() : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      };
      await api.post('/medicines', body);
      showToast(`${newMed.name} added successfully!`);
      loadMedicines();
      setNewMed({ name: '', sku: '', category: categories[0]?._id || '', brand: '', stock: '', price: '', expiry: '' });
    } catch (err) {
      showToast('Failed to add medicine: ' + err.message, 'error');
    }
  };

  const handleDeleteMedicine = async (id, name) => {
    if (deleteConfirmId !== id) {
      setDeleteConfirmId(id);
      setTimeout(() => setDeleteConfirmId(prev => prev === id ? null : prev), 3000);
      return;
    }
    try {
      await api.delete(`/medicines/${id}`);
      showToast(`${name} deleted successfully!`);
      loadMedicines();
      setDeleteConfirmId(null);
    } catch (err) {
      showToast('Failed to delete medicine: ' + err.message, 'error');
    }
  };

  // ── Category CRUD ──
  const handleAddCategorySubmit = async (e) => {
    e.preventDefault();
    if (!newCat.name) {
      showToast('Please fill in Category Name.', 'error');
      return;
    }
    try {
      await api.post('/categories', {
        categoryName: newCat.name,
        description: newCat.description,
      });
      showToast(`${newCat.name} category added successfully!`);
      setNewCat({ name: '', description: '' });
      loadCategories();
    } catch (err) {
      showToast('Failed to add category: ' + err.message, 'error');
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (deleteCatConfirmId !== id) {
      setDeleteCatConfirmId(id);
      setTimeout(() => setDeleteCatConfirmId(prev => prev === id ? null : prev), 3000);
      return;
    }
    try {
      await api.delete(`/categories/${id}`);
      showToast(`"${name}" deleted successfully!`);
      loadCategories();
      setDeleteCatConfirmId(null);
    } catch (err) {
      showToast('Failed to delete category: ' + err.message, 'error');
    }
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

      {/* ── Edit Modals ── */}
      <EditMedicineModal
        open={!!editMedicine}
        medicine={editMedicine}
        categories={categories}
        onClose={() => setEditMedicine(null)}
        onSaved={(msg, severity) => { showToast(msg, severity || 'success'); loadMedicines(); }}
      />
      <EditCategoryModal
        open={!!editCategory}
        category={editCategory}
        onClose={() => setEditCategory(null)}
        onSaved={(msg, severity) => { showToast(msg, severity || 'success'); loadCategories(); }}
      />

      {/* ── ALL MEDICINES VIEW ── */}
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
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => setEditMedicine(m)}
                          sx={{ borderColor: 'var(--card-border)', color: '#a1a1aa', '&:hover': { borderColor: '#a1a1aa', color: 'white' } }}
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
                            '&:hover': { borderColor: '#ef4444', bgcolor: 'rgba(239,68,68,0.15)' }
                          }}
                        >
                          {deleteConfirmId === m.id ? 'Confirm?' : 'Delete'}
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* ── ADD MEDICINE VIEW ── */}
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
                <TextField fullWidth placeholder="e.g. Paracetamol 650mg" value={newMed.name} onChange={(e) => setNewMed({ ...newMed, name: e.target.value })} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}>SKU / Code *</Typography>
                <TextField fullWidth placeholder="e.g. MED-1092" value={newMed.sku} onChange={(e) => setNewMed({ ...newMed, sku: e.target.value })} required />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}>Brand / Manufacturer *</Typography>
                <TextField fullWidth placeholder="e.g. Abbott Labs" value={newMed.brand} onChange={(e) => setNewMed({ ...newMed, brand: e.target.value })} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}>Therapeutic Category *</Typography>
                <Select fullWidth value={newMed.category} onChange={(e) => setNewMed({ ...newMed, category: e.target.value })} required>
                  {categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>{cat.categoryName}</MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}>Price (₹) *</Typography>
                <TextField fullWidth type="number" placeholder="e.g. 140.00" value={newMed.price} onChange={(e) => setNewMed({ ...newMed, price: e.target.value })} required />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}>Initial Stock Qty *</Typography>
                <TextField fullWidth type="number" placeholder="e.g. 100" value={newMed.stock} onChange={(e) => setNewMed({ ...newMed, stock: e.target.value })} required />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}>Expiry Date</Typography>
                <TextField fullWidth type="date" value={newMed.expiry} onChange={(e) => setNewMed({ ...newMed, expiry: e.target.value })} InputLabelProps={{ shrink: true }} />
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              sx={{
                background: 'linear-gradient(to right, #ec4899, #9333ea)',
                color: 'white',
                py: 1.5,
                '&:hover': { background: 'linear-gradient(to right, #db2777, #7e22ce)' }
              }}
            >
              Add Formulation
            </Button>
          </Box>
        </Paper>
      )}

      {/* ── CATEGORIES VIEW ── */}
      {activeTab === 'categories' && (
        <Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>Medicine Categories</Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>Classification directories for managing inventory therapeutic index.</Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Categories List */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={2.5}>
                {categories.map((cat) => {
                  const count = medicines.filter(m => m.category === cat.categoryName).length;
                  const isDeleteConfirm = deleteCatConfirmId === cat._id;
                  return (
                    <Grid item xs={12} sm={6} key={cat._id}>
                      <Card
                        className="glass"
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          '&:hover': { borderColor: 'var(--foreground)' },
                          transition: 'border-color 0.3s',
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
                              {cat.categoryName}
                            </Typography>
                            <Chip
                              label={`${count} Meds`}
                              size="small"
                              sx={{
                                fontSize: '10px', fontWeight: 700,
                                color: '#ec4899',
                                backgroundColor: 'rgba(236,72,153,0.08)',
                                borderColor: 'rgba(236,72,153,0.2)',
                                borderStyle: 'solid', borderWidth: '1px',
                              }}
                            />
                          </Box>
                          <Typography variant="caption" sx={{ color: '#a1a1aa', lineHeight: 1.5, display: 'block' }}>
                            {cat.description || 'No description available.'}
                          </Typography>
                        </CardContent>

                        {/* Action footer */}
                        <Box
                          sx={{
                            p: 1.5,
                            borderTop: '1px solid var(--card-border)',
                            display: 'flex',
                            gap: 1,
                            justifyContent: 'flex-end',
                          }}
                        >
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setEditCategory(cat)}
                            sx={{
                              fontSize: '11px',
                              borderColor: 'var(--card-border)',
                              color: '#a1a1aa',
                              '&:hover': { borderColor: '#a1a1aa', color: 'white' },
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleDeleteCategory(cat._id, cat.categoryName)}
                            sx={{
                              fontSize: '11px',
                              borderColor: isDeleteConfirm ? '#ef4444' : 'rgba(239,68,68,0.2)',
                              color: '#ef4444',
                              bgcolor: isDeleteConfirm ? 'rgba(239,68,68,0.1)' : 'transparent',
                              '&:hover': { borderColor: '#ef4444', bgcolor: 'rgba(239,68,68,0.15)' },
                            }}
                          >
                            {isDeleteConfirm ? 'Confirm?' : 'Delete'}
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>

            {/* Add Category Form Card */}
            <Grid item xs={12} md={4}>
              <Paper className="glass" sx={{ p: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>Add New Category</Typography>
                  <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>Create a new therapeutic group index in the database.</Typography>
                </Box>
                <Box component="form" onSubmit={handleAddCategorySubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}>Category Name *</Typography>
                    <TextField
                      fullWidth
                      placeholder="e.g. Analgesics"
                      value={newCat.name}
                      onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                      required
                    />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}>Description</Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="e.g. Pain relief and antipyretic formulations"
                      value={newCat.description}
                      onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                    />
                  </Box>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      background: 'linear-gradient(to right, #ec4899, #9333ea)',
                      color: 'white',
                      py: 1.2,
                      '&:hover': { background: 'linear-gradient(to right, #db2777, #7e22ce)' }
                    }}
                  >
                    Add Category
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* ── BRANDS VIEW ── */}
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

      {/* ── INVENTORY VIEW ── */}
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
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--foreground)', mt: 1 }}>{medicines.filter(m => m.status === 'In Stock').length} Items</Typography>
                <Typography variant="caption" sx={{ color: '#71717a', mt: 0.5, display: 'block' }}>No restock necessary right now.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ backgroundColor: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.15)', p: 3, borderRadius: '16px' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase' }}>Low Stock Warning</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--foreground)', mt: 1 }}>{medicines.filter(m => m.status === 'Low Stock').length} Items</Typography>
                <Typography variant="caption" sx={{ color: '#71717a', mt: 0.5, display: 'block' }}>Quantity is below the safety limit threshold.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)', p: 3, borderRadius: '16px' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#ef4444', textTransform: 'uppercase' }}>Out of Stock</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--foreground)', mt: 1 }}>{medicines.filter(m => m.status === 'Out of Stock').length} Items</Typography>
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
                {medicines.filter(m => m.status !== 'In Stock').map((m) => (
                  <TableRow key={m.id}>
                    <TableCell sx={{ fontWeight: 700, color: 'var(--foreground)' }}>{m.name}</TableCell>
                    <TableCell sx={{ color: m.status === 'Out of Stock' ? '#ef4444' : '#f59e0b', fontWeight: 650 }}>{m.stock} Units</TableCell>
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
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* ── EXPIRY ALERTS VIEW ── */}
      {activeTab === 'expiry-alerts' && (
        <Paper className="glass" sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#ef4444' }}>Critical Expiry Alerts</Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>Near-term expiry notifications. Immediate clearance or disposal protocol advised.</Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {medicines.map((m) => {
              if (m.expiry === 'N/A') return null;
              const expiryDate = new Date(m.expiry);
              const diffTime = expiryDate.getTime() - Date.now();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              if (diffDays > 180) return null;
              const severity = diffDays < 30 ? 'critical' : (diffDays < 90 ? 'warning' : 'info');
              return (
                <Box
                  key={m.id}
                  sx={{
                    p: 2.5,
                    borderRadius: '16px',
                    border: '1px solid',
                    backgroundColor: severity === 'critical' ? 'rgba(239, 68, 68, 0.03)' : severity === 'warning' ? 'rgba(245, 158, 11, 0.03)' : 'rgba(255, 255, 255, 0.02)',
                    borderColor: severity === 'critical' ? 'rgba(239, 68, 68, 0.15)' : severity === 'warning' ? 'rgba(245, 158, 11, 0.15)' : 'var(--card-border)',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { sm: 'center' },
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: severity === 'critical' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: severity === 'critical' ? '#ef4444' : '#f59e0b' }}>
                      ⚠️
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>{m.name}</Typography>
                      <Typography variant="caption" sx={{ color: '#71717a' }}>{m.sku} • {m.brand}</Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: severity === 'critical' ? '#ef4444' : '#f59e0b' }}>
                      {diffDays < 0 ? 'Expired' : `${diffDays} days left`}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#71717a' }}>Expires: {m.expiry}</Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleDeleteMedicine(m.id, m.name)}
                    sx={{
                      borderColor: deleteConfirmId === m.id ? '#ef4444' : 'var(--card-border)',
                      color: deleteConfirmId === m.id ? '#ef4444' : '#a1a1aa',
                      bgcolor: deleteConfirmId === m.id ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                      '&:hover': { borderColor: '#ef4444', color: '#f87171', bgcolor: 'rgba(239, 68, 68, 0.05)' }
                    }}
                  >
                    {deleteConfirmId === m.id ? 'Confirm?' : 'Dispose Batch'}
                  </Button>
                </Box>
              );
            }).filter(Boolean)}
            {medicines.filter(m => m.expiry !== 'N/A' && (new Date(m.expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24) <= 180).length === 0 && (
              <Typography variant="body2" sx={{ color: '#a1a1aa', textAlign: 'center', py: 4 }}>No near-term expiry alerts.</Typography>
            )}
          </Box>
        </Paper>
      )}
    </Box>
  );
}
