import { ProductFilters, Product } from "@/types";

export const getAllProducts = async function (filters: ProductFilters = {}): Promise<Product[]> {
    let url = `${import.meta.env.VITE_BASE_URL}/api/stores`;
    if (filters.id) {
        url = `${import.meta.env.VITE_BASE_URL}/api/products/${filters.id}`;
    }else if(filters.shopId){
        url += `/${filters.shopId}/products`;
    }

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
