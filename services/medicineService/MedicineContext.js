'use client';

import { createContext, useContext, useState } from 'react';
import { medicineService } from './medicineService';

const MedicineContext = createContext(null);

export function MedicineProvider({ children }) {
  const [medicines, setMedicines] = useState([]);
  const [totalMedicines, setTotalMedicines] = useState(0);
  const [categories, setCategories] = useState([]);
  const [totalCategories, setTotalCategories] = useState(0);
  const [brands, setBrands] = useState([]);
  const [totalBrands, setTotalBrands] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadMedicines = async (params = {}) => {
    setLoading(true);
    try {
      const data = await medicineService.getMedicines(params);
      let rawList = [];
      let total = 0;

      if (Array.isArray(data)) {
        rawList = data;
        total = data.length;
      } else if (data && typeof data === 'object') {
        rawList = data.medicines || data.data || [];
        total = data.totalMedicines ?? data.totalCount ?? data.total ?? rawList.length;
      }

      const formatted = rawList.map(m => {
        const stockNum = m.stock ?? 0;
        const status = stockNum === 0 ? 'Out of Stock' : (stockNum <= (m.minStockLevel || 10) ? 'Low Stock' : 'In Stock');
        return {
          id: m._id,
          name: m.medicineName || m.name || '',
          sku: m.batchNumber || m.sku || '',
          categoryId: m.category?._id || m.category || '',
          category: m.category?.categoryName || (typeof m.category === 'string' ? m.category : 'Uncategorized'),
          brand: m.manufacturer && typeof m.manufacturer === 'object' ? (m.manufacturer.brandName || 'Unbranded') : (m.manufacturer || 'Unbranded'),
          brandId: m.manufacturer && typeof m.manufacturer === 'object' ? (m.manufacturer._id || '') : (m.manufacturer || ''),
          stock: stockNum,
          stockRaw: stockNum,
          price: typeof m.sellingPrice === 'number' ? `₹${m.sellingPrice.toFixed(2)}` : (m.price || '₹0.00'),
          priceRaw: m.sellingPrice || 0,
          status,
          expiry: m.expiryDate ? new Date(m.expiryDate).toISOString().split('T')[0] : (m.expiry || 'N/A')
        };
      });
      setMedicines(formatted);
      setTotalMedicines(total);
      return { medicines: formatted, total };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async (params = {}) => {
    try {
      const data = await medicineService.getCategories(params);
      let rawList = [];
      let total = 0;
      if (Array.isArray(data)) {
        rawList = data;
        total = data.length;
      } else if (data && typeof data === 'object') {
        rawList = data.categories || data.data || [];
        total = data.totalCategories ?? data.totalCount ?? data.total ?? rawList.length;
      }
      setCategories(rawList);
      setTotalCategories(total);
      return { categories: rawList, total };
    } catch (error) {
      throw error;
    }
  };

  const loadBrands = async (params = {}) => {
    try {
      const data = await medicineService.getBrands(params);
      let rawList = [];
      let total = 0;
      if (Array.isArray(data)) {
        rawList = data;
        total = data.length;
      } else if (data && typeof data === 'object') {
        rawList = data.brands || data.data || [];
        total = data.totalBrands ?? data.totalCount ?? data.total ?? rawList.length;
      }
      setBrands(rawList);
      setTotalBrands(total);
      return { brands: rawList, total };
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
        totalMedicines,
        categories,
        totalCategories,
        brands,
        totalBrands,
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
