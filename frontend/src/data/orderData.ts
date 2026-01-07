import { Shop, ShopFilters } from "@/types";

type Order = {
    "order": {
        "store_id": number,
        "items": {
            "product_id": number,
            "quantity": number,
            "subtotal": number,
        }[],
    }
}

export const createOrder = async function (order: Order) {
    let url = `${import.meta.env.VITE_BASE_URL}/api/orders`;

    return fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(order),
    }).then(response => response.json()).then(data => {
        console.log('Order created:', data);
        return data.status;
    }).catch(error => {
        console.error('Error:', error);
        return [];
    });
};

export const getAllOrders = async function (filters: ShopFilters = {}) {
    let url = `${import.meta.env.VITE_BASE_URL}/api/stores`;
    if (filters && filters.id) {
        url += `/${filters.id}`;
    }else if (filters && filters.idMultiple) {
        const shops = await Promise.all(
            filters.idMultiple.map(id => getAllOrders({ id }))
        );
        return shops.flat();
    }

    return fetch(url,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }).then(response => response.json()).then(data => {
        return data.data as Shop[]
    }).catch(error => {
        console.error('Error:', error);
        return [];
    });
};

export const getStoreOrders = async function (id: number): Promise<Shop | null> {
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
