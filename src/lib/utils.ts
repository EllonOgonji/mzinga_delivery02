import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Shop } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateDeliveryFee = (coordinates: { lat: number; lon: number }): number => {
  const distanceKm = findDistanceBetweenCoordinates(
    coordinates.lat,
    coordinates.lon,
    parseFloat(localStorage.getItem("userLat")) || -1.2828,
    parseFloat(localStorage.getItem("userLon")) || 36.8029
  );
  const feeTiers = {
    "0-2km": 70.0,
    "2-5km": 100.0,
    "5-10km": 120.0,
    "10km+": 150.0,
  };

  if (distanceKm <= 2) return feeTiers["0-2km"] || 0;
  if (distanceKm <= 5) return feeTiers["2-5km"] || 0;
  if (distanceKm <= 10) return feeTiers["5-10km"] || 0;
  return feeTiers["10km+"] || 0;
};

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

export const getShopStatus = (shop: Shop) => {
  const now = new Date();
  const day = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const hours = shop.openingHours[day];
  
  if (!hours) return { isOpen: false, text: "Closed" };
  
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const [openHour, openMin] = hours.open.split(':').map(Number);
  const [closeHour, closeMin] = hours.close.split(':').map(Number);
  const openTime = openHour * 60 + openMin;
  const closeTime = closeHour * 60 + closeMin;
  
  const isOpen = currentTime >= openTime && currentTime <= closeTime;
  return {
    isOpen,
    text: isOpen ? `Open - Closes at ${hours.close}` : `Closed - Opens at ${hours.open}`,
  };
};