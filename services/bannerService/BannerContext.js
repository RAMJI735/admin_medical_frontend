'use client';

import { createContext, useContext, useState } from 'react';
import { bannerService } from './bannerService';

const BannerContext = createContext(null);

export function BannerProvider({ children }) {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadBanners = async (isActive) => {
    setLoading(true);
    try {
      const data = await bannerService.getBanners(isActive);
      setBanners(data || []);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addBanner = async (body) => {
    try {
      const res = await bannerService.createBanner(body);
      await loadBanners();
      return res;
    } catch (error) {
      throw error;
    }
  };

  const updateBanner = async (id, body) => {
    try {
      const res = await bannerService.updateBanner(id, body);
      await loadBanners();
      return res;
    } catch (error) {
      throw error;
    }
  };

  const deleteBanner = async (id) => {
    try {
      const res = await bannerService.deleteBanner(id);
      await loadBanners();
      return res;
    } catch (error) {
      throw error;
    }
  };

  return (
    <BannerContext.Provider
      value={{
        banners,
        loading,
        loadBanners,
        addBanner,
        updateBanner,
        deleteBanner,
      }}
    >
      {children}
    </BannerContext.Provider>
  );
}

export function useBanner() {
  const context = useContext(BannerContext);
  if (!context) {
    throw new Error('useBanner must be used within a BannerProvider');
  }
  return context;
}
