'use client';

import { createContext, useContext, useState } from 'react';
import { medicineService } from './medicineService';

const MedicineContext = createContext(null);

export function MedicineProvider({ children }) {
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMedicines = async () => {
    setLoading(true);
    try {
      const data = await medicineService.getMedicines(100);
      const formatted = (data.medicines || []).map(m => {
        const stockNum = m.stock;
        const status = stockNum === 0 ? 'Out of Stock' : (stockNum <= m.minStockLevel ? 'Low Stock' : 'In Stock');
        return {
          id: m._id,
          name: m.medicineName,
          sku: m.batchNumber,
          categoryId: m.category?._id || '',
          category: m.category?.categoryName || 'Uncategorized',
          brand: m.manufacturer && typeof m.manufacturer === 'object' ? (m.manufacturer.brandName || 'Unbranded') : (m.manufacturer || 'Unbranded'),
          brandId: m.manufacturer && typeof m.manufacturer === 'object' ? (m.manufacturer._id || '') : (m.manufacturer || ''),
          stock: stockNum,
          stockRaw: stockNum,
          price: `₹${m.sellingPrice.toFixed(2)}`,
          priceRaw: m.sellingPrice,
          status,
          expiry: m.expiryDate ? new Date(m.expiryDate).toISOString().split('T')[0] : 'N/A'
        };
      });
      setMedicines(formatted);
      return formatted;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await medicineService.getCategories();
      setCategories(data);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const addMedicine = async (body) => {
    try {
      const res = await medicineService.addMedicine(body);
      await loadMedicines();
      return res;
    } catch (error) {
      throw error;
    }
  };

  const updateMedicine = async (id, body) => {
    try {
      const res = await medicineService.updateMedicine(id, body);
      await loadMedicines();
      return res;
    } catch (error) {
      throw error;
    }
  };

  const deleteMedicine = async (id) => {
    try {
      const res = await medicineService.deleteMedicine(id);
      await loadMedicines();
      return res;
    } catch (error) {
      throw error;
    }
  };

  const addCategory = async (body) => {
    try {
      const res = await medicineService.addCategory(body);
      await loadCategories();
      return res;
    } catch (error) {
      throw error;
    }
  };

  const updateCategory = async (id, body) => {
    try {
      const res = await medicineService.updateCategory(id, body);
      await loadCategories();
      return res;
    } catch (error) {
      throw error;
    }
  };

  const deleteCategory = async (id) => {
    try {
      const res = await medicineService.deleteCategory(id);
      await loadCategories();
      return res;
    } catch (error) {
      throw error;
    }
  };

  const loadBrands = async () => {
    try {
      const data = await medicineService.getBrands();
      setBrands(data);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const addBrand = async (body) => {
    try {
      const res = await medicineService.addBrand(body);
      await loadBrands();
      return res;
    } catch (error) {
      throw error;
    }
  };

  const updateBrand = async (id, body) => {
    try {
      const res = await medicineService.updateBrand(id, body);
      await loadBrands();
      return res;
    } catch (error) {
      throw error;
    }
  };

  const deleteBrand = async (id) => {
    try {
      const res = await medicineService.deleteBrand(id);
      await loadBrands();
      return res;
    } catch (error) {
      throw error;
    }
  };

  return (
    <MedicineContext.Provider
      value={{
        medicines,
        categories,
        brands,
        loading,
        loadMedicines,
        loadCategories,
        loadBrands,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        addCategory,
        updateCategory,
        deleteCategory,
        addBrand,
        updateBrand,
        deleteBrand,
      }}
    >
      {children}
    </MedicineContext.Provider>
  );
}

export function useMedicine() {
  const context = useContext(MedicineContext);
  if (!context) {
    throw new Error('useMedicine must be used within a MedicineProvider');
  }
  return context;
}
