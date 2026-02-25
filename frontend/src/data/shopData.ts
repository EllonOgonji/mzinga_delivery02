import { Shop, ShopFilters } from "@/types";

type ShopResponse = {
    data: Shop[];
    meta: {
        page: number;
        limit: number;
        total: number;
    }
};

export const getAllShops = async function (filters: ShopFilters = {limit: 6, page: 1}): Promise<ShopResponse>{
    let filterUrl = `${import.meta.env.VITE_BASE_URL}/api/stores/filter?`;

    if (filters && filters.idMultiple) {
        const shops = await Promise.all(
            filters.idMultiple.map(id => getSingleShop(id))
        );
        return { data: shops.flat(), meta: { page: 1, limit: shops.length, total: shops.length } };
    }

    if (filters.page && filters.limit) {
        filterUrl += `page=${filters.page}&limit=${filters.limit}`;
    }

    if (filters.searchQuery && filters.searchQuery.trim() !== "") {
        filterUrl += `&search=${encodeURIComponent(filters.searchQuery)}`;
    }

    return fetch(filterUrl,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }).then(response => response.json()).then(data => {
        if(localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).role != 'admin'){
            return {...data, data: data.data.filter((shop) => shop.is_verified === true)}
        }
        return data;
    }).catch(error => {
        console.error('Error:', error);
        return [];
    });
};

export const adminGetAllShops = async function (filters: ShopFilters = {limit: 6, page: 1}): Promise<ShopResponse>{
    let filterUrl = `${import.meta.env.VITE_BASE_URL}/api/admin/stores/filter?`;

    if (filters && filters.idMultiple) {
        const shops = await Promise.all(
            filters.idMultiple.map(id => getSingleShop(id))
        );
        return { data: shops.flat(), meta: { page: 1, limit: shops.length, total: shops.length } };
    }

    if (filters.page && filters.limit) {
        filterUrl += `page=${filters.page}&limit=${filters.limit}`;
    }

    if (filters.searchQuery && filters.searchQuery.trim() !== "") {
        filterUrl += `&search=${encodeURIComponent(filters.searchQuery)}`;
    }

    if (filters.status && filters.status.trim() !== "") {
        filterUrl += `&status=${encodeURIComponent(filters.status)}`;
    }

    return fetch(filterUrl,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }).then(response => response.json()).then(data => {
        return data;
    }).catch(error => {
        console.error('Error:', error);
        return [];
    });
};

export const getSingleShop = async function (id: number): Promise<Shop> {
    let url = `${import.meta.env.VITE_BASE_URL}/api/stores/${id}`;

    return fetch(url,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }).then(response => response.json()).then(data => {
        return data.data as Shop
    }).catch(error => {
        console.error('Error:', error);
        return {} as Shop;
    });
};

export const getVendorShops = async function (id: number): Promise<Shop | null> {
    return fetch(`${import.meta.env.VITE_BASE_URL}/api/vendor/stores`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(res => {
        return res.data.filter((shop) => shop.is_verified === true)[0]
    }).catch(error => {
        console.error('Error:', error);
        return null;
    });
}

export const approveShop = async (id: number) => {
    return fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/stores/${id}/approve`,{
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return {
            status: true,
            data: null,
            error: null
        }
    }).catch(error => {
        console.error('Error:', error);
        return {
            status: true,
            data: null,
            error: error
        }
    });
}

export const rejectShop = async (id: number, reasonForRejection: string) => {
    return fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/stores/${id}/reject`,{
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({reason : reasonForRejection})
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return {
            status: true,
            data: null,
            error: null
        }
    }).catch(error => {
        console.error('Error:', error);
        return {
            status: false,
            data: null,
            error: error
        }
    });
}
