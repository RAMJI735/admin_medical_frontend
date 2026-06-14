'use client';

import {
  Box,
  Snackbar,
  Alert
} from '@mui/material';
import { useMedicine } from '../services/medicineService/MedicineContext';
import Categories from './categories';
import AllMedicines from './all-medicines';
import AddMedicine from './add-medicine';
import Brands from './brands';
import Inventory from './inventory';
import ExpiryAlerts from './expiry-alerts';
import { useEffect, useState, useMemo } from 'react';

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MedicinesView({ activeTab }) {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const {
    medicines,
    categories,
    loadMedicines,
    loadCategories,
    addMedicine
  } = useMedicine();

  const [newMed, setNewMed] = useState({ name: '', sku: '', category: '', brand: '', stock: '', price: '', expiry: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const showToast = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const init = async () => {
      try {
        const cats = await loadCategories();
        if (cats && cats.length > 0) {
          setNewMed(prev => ({ ...prev, category: cats[0]._id }));
        }
      } catch (err) {
        showToast('Failed to load categories: ' + err.message, 'error');
      }
      try {
        await loadMedicines();
      } catch (err) {
        showToast('Failed to load medicines: ' + err.message, 'error');
      }
    };
    init();
  }, []);

  const filteredMedicines = useMemo(() => {
    return medicines.filter(m =>
      (m.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.brand || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.sku || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [medicines, searchQuery]);

  // ── Medicine CRUD (for sidebar AddMedicine tab if active) ──
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
      await addMedicine(body);
      showToast(`${newMed.name} added successfully!`);
      setNewMed({ name: '', sku: '', category: categories[0]?._id || '', brand: '', stock: '', price: '', expiry: '' });
    } catch (err) {
      showToast('Failed to add medicine: ' + err.message, 'error');
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

      {/* ── ALL MEDICINES VIEW ── */}
      {activeTab === 'all-medicines' && (
        <AllMedicines
          filteredMedicines={filteredMedicines}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
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
        <Categories />
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
        />
      )}
    </Box>
  );
}
