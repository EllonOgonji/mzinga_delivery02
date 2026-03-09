import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Shop } from "@/types";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

type DeliveryFee = {
  distance_km: number,
  delivery_fee: number,
  duration_text: string,
  distance_text: string
}

type ReturnData = {
  status: boolean,
  data: any,
  error: any
  
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "");

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export const calculateDeliveryFee = (coordinates: { lat: number; lon: number }, storeId: number): ReturnData => {
//   const getDeliveryMeta = async ():Promise<ReturnData> => {
//     const url = `${import.meta.env.VITE_BASE_URL}/api/delivery/calculate`

//     try {const fecthResponse = await fetch(url,{
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify({
//           store_id: storeId,
//           delivery_lat: coordinates.lat,
//           delivery_lng: coordinates.lon
//         })
//     })

//     if (!fecthResponse.ok) {
//       throw new Error('Network response was not ok');
//     }

//     const parsedResponse = await fecthResponse.json()

//     return {
//       status: true,
//       data: parsedResponse,
//       error: null
//     }
//     } catch (error){
//         console.error('Error:', error);
//         return {
//             status: false,
//             data: null,
//             error: error
//         }
//     }
//   }
  
//   return getDeliveryMeta()
// };

export const findDistanceBetweenUserAndShop = (shopCoordinates: { lat: number; lon: number }): number => {
  const userLat = parseFloat(localStorage.getItem("userLat"));
  const userLon = parseFloat(localStorage.getItem("userLon"));

  return findDistanceBetweenCoordinates(
    userLat,
    userLon,
    shopCoordinates.lat,
    shopCoordinates.lon
  );
}

export const findDistanceBetweenCoordinates = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;

  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers

  return distance;
}

export const uploadImage = async (file: File): Promise<string> => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are not set");
  }

  const ext = file.name.split('.').pop() ?? '';
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext ? `.${ext}` : ''}`;
  const filePath = `images/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('store-images')
    .upload(filePath, file, { cacheControl: '3600', upsert: false });

  if (uploadError) {
    console.error('Supabase upload error:', uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('store-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
};