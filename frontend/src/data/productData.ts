import { ProductFilters, Product } from "@/types";

export const getAllProducts = async function (filters: ProductFilters = {limit: 6, page:1}){
    let url = `${import.meta.env.VITE_BASE_URL}/api/products/filter?`;
    
    if (filters.page && filters.limit) {
        url += `page=${filters.page}&limit=${filters.limit}`;
    }

    if (filters.searchQuery && filters.searchQuery.trim() !== "") {
        url += `&search=${encodeURIComponent(filters.searchQuery)}`;
    }

    if (filters.category) {
        url += `&category=${encodeURIComponent(filters.category)}`;
    }

    if (filters.priceRange && filters.priceRange.min !== undefined) {
        url += `&min_price=${filters.priceRange.min}`;
    }

    if (filters.priceRange && filters.priceRange.max !== undefined) {
        url += `&max_price=${filters.priceRange.max}`;
    }

    return fetch(url,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }).then(response => response.json()).then(data => {
        return data
    }).catch(error => {
        console.error('Error:', error);
        return []
    });
};

export const getSingleStoreProducts = async function (storeId: Number): Promise<Product[]> {
    const url = `${import.meta.env.VITE_BASE_URL}/api/stores/${storeId}/products`;

    return fetch(url,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }).then(response => response.json()).then(data => {
        return data.data as Product[]
    }).catch(error => {
        console.error('Error:', error);
        return [] as Product[];
    });
};

export const getSingleProduct = async function (id: Number): Promise<Product> {
    const url = `${import.meta.env.VITE_BASE_URL}/api/products/${id}`;

    return fetch(url,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }).then(response => response.json()).then(data => {
        return data.data as Product
    }).catch(error => {
        console.error('Error:', error);
        return {} as Product;
    });
};
