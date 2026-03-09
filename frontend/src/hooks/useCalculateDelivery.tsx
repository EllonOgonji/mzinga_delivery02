import { useState, useEffect } from 'react';

type ReturnData = {
  status: boolean,
  data: any,
  error: any
  
}

type Enabled = {
  enabled: boolean
}

export const calculateDeliveryFee = async (
  coordinates: { lat: number; lon: number }, 
  storeId: number
): Promise<ReturnData> => {
  const url = `${import.meta.env.VITE_BASE_URL}/api/delivery/calculate`;

  try {
    const fetchResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        store_id: storeId,
        delivery_lat: coordinates.lat,
        delivery_lng: coordinates.lon
      })
    });

    if (!fetchResponse.ok) {
      throw new Error('Network response was not ok');
    }

    const parsedResponse = await fetchResponse.json();

    return {
      status: true,
      data: parsedResponse,
      error: null
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      status: false,
      data: null,
      error: error
    };
  }
};

// Then create a custom hook in your component
export const useShopDeliveryData = (shopIds: number[], allShops: any[], cartByShop: any, latitude, longitude, status: Enabled) => {
  const [shopsData, setShopsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!status.enabled) {
      return;
    }

    let isMounted = true; // Prevent state updates if component unmounts
    
    const fetchDeliveryData = async () => {
      if (shopIds.length === 0 || allShops.length === 0) return;
      
      setIsLoading(true);
      
      try {
        const shopsDataPromises = shopIds.map(async (shopId) => {
          const shop = allShops.find(s => s.id === shopId);
          
          if (!shop) return null;
          
          const shopItems = cartByShop[shopId];
          const shopSubtotal = shopItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
          
          const result = await calculateDeliveryFee(
            { lat: latitude, lon: longitude }, 
            shopId
          );
          
          if (!result.status || !result.data) {
            console.error('Failed to calculate delivery fee for shop:', shopId);
            return null;
          }
          
          const shopTotal = shopSubtotal + result.data.data.delivery_fee;
          
          return {
            shopId: shopId,
            shop: shop,
            items: shopItems,
            subtotal: shopSubtotal,
            deliveryFee: Number(result.data.data.delivery_fee),
            distance: result.data.data.distance_km,
            total: shopTotal
          };
        });
        
        const resolvedData = await Promise.all(shopsDataPromises);

        if (isMounted) {
          setShopsData(resolvedData.filter(item => item !== null));
        }

      } catch (error) {
        console.error('Error fetching delivery data:', error);
      } finally {
         if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDeliveryData();

    return () => {
      isMounted = false;
    };
  }, [shopIds, allShops, cartByShop, latitude, longitude, status.enabled]);

  return { shopsData, isLoading };
};