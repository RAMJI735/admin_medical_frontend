'use client';

import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { api } from '@/utils/api';
import Categories from './categories';
import AllMedicines from './all-medicines';
import AddMedicine from './add-medicine';
import Brands from './brands';
import Inventory from './inventory';
import ExpiryAlerts from './expiry-alerts';
import { useEffect, useState, useMemo } from 'react';

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
        <AllMedicines
          filteredMedicines={filteredMedicines}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setEditMedicine={setEditMedicine}
          handleDeleteMedicine={handleDeleteMedicine}
          deleteConfirmId={deleteConfirmId}
        />
      )}

      {/* ── ADD MEDICINE VIEW ── */}
      {activeTab === 'add-medicine' && (
        <AddMedicine
          newMed={newMed}
          setNewMed={setNewMed}
          categories={categories}
          handleAddMedicineSubmit={handleAddMedicineSubmit}
        />
      )}

      {/* ── CATEGORIES VIEW ── */}
      {activeTab === 'categories' && (
        <Categories
          categories={categories}
          medicines={medicines}
          deleteCatConfirmId={deleteCatConfirmId}
          setDeleteCatConfirmId={setDeleteCatConfirmId}
          handleDeleteCategory={handleDeleteCategory}
          editCategory={editCategory}
          setEditCategory={setEditCategory}
          setNewCat={setNewCat}
          newCat={newCat}
          handleAddCategorySubmit={handleAddCategorySubmit}
        />
      )}

      {/* ── BRANDS VIEW ── */}
      {activeTab === 'brands' && <Brands />}

      {/* ── INVENTORY VIEW ── */}
      {activeTab === 'inventory' && (
        <Inventory
          medicines={medicines}
          showToast={showToast}
        />
      )}

      {/* ── EXPIRY ALERTS VIEW ── */}
      {activeTab === 'expiry-alerts' && (
        <ExpiryAlerts
          medicines={medicines}
          handleDeleteMedicine={handleDeleteMedicine}
          deleteConfirmId={deleteConfirmId}
        />
      )}
    </Box>
  );
}
