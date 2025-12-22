import React, { createContext, useContext, useState, useEffect } from 'react';

interface ShopFilterContextType {
  selectedShops: number[];
  setSelectedShops: (shops: number[]) => void;
  toggleShop: (shopId: number) => void;
  clearShops: () => void;
  isShopSelected: (shopId: number) => boolean;
}

const ShopFilterContext = createContext<ShopFilterContextType | undefined>(undefined);

export const ShopFilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedShops, setSelectedShopsState] = useState<number[]>(() => {
    const stored = localStorage.getItem('selectedShops');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('selectedShops', JSON.stringify(selectedShops));
  }, [selectedShops]);

  const setSelectedShops = (shops: number[]) => {
    setSelectedShopsState(shops);
  };

  const toggleShop = (shopId: number) => {
    setSelectedShopsState(prev => 
      prev.includes(shopId) 
        ? prev.filter(id => id !== shopId)
        : [...prev, shopId]
    );
  };

  const clearShops = () => {
    setSelectedShopsState([]);
  };

  const isShopSelected = (shopId: number) => {
    return selectedShops.includes(shopId);
  };

  return (
    <ShopFilterContext.Provider value={{ 
      selectedShops, 
      setSelectedShops, 
      toggleShop, 
      clearShops,
      isShopSelected 
    }}>
      {children}
    </ShopFilterContext.Provider>
  );
};

export const useShopFilter = () => {
  const context = useContext(ShopFilterContext);
  if (!context) {
    throw new Error('useShopFilter must be used within ShopFilterProvider');
  }
  return context;
};
