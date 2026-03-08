import { CartItem, Shop, ShopFilters } from "@/types";

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

type OrderFilters = {
    limit?: number,
    page?: number
}

type cartItem = {
    
}

type checkout = {

}

export const addItemToCart = async function (item) {
    let url = `${import.meta.env.VITE_BASE_URL}/api/cart/items`;

    return fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({product_id: item.id, quantity: item.quantity}),
    }).then(response => response.json()).then(data => {
        console.log('item added to cart:');
        return data.status;
    }).catch(error => {
        console.error('Error:', error);
        return [];
    });
};

export const checkout = async function (paymentPhoneNumber: string) {
    let url = `${import.meta.env.VITE_BASE_URL}/api/checkout`;

    return fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ payment_phone: paymentPhoneNumber }),
    }).then(response => {
        if (!response.ok){
           throw new Error("Checkout request failed")
        }
        return response.json()
    }).then(data => {
        return {
            status: true,
            data: data,
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
};

export const getAllOrders = async function (filters: ShopFilters = {limit: 6, page: 1}): Promise<Shop[]> {
    let url = `${import.meta.env.VITE_BASE_URL}/api/stores`;
    if (filters && filters.id) {
        url += `/${filters.id}`;
    }else if (filters && filters.idMultiple) {
        const shops = await Promise.all(
            filters.idMultiple.map(id => getAllOrders({ id, limit: 6, page: 1 }))
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

// Returns all orders belonging to authenticated user (vendor, customer, admin)
export const getOrders = async function (filters: OrderFilters = {limit:6, page: 1}){
    let url = `${import.meta.env.VITE_BASE_URL}/api/orders`;
    
    if (filters.page && filters.limit) {
        url += `/filter?page=${filters.page}&limit=${filters.limit}`;
    }

    return fetch(url,{
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
        return {
            status: true,
            data: res,
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

export const updateOrderStatus = async function (orderId: number, itemId: number, newStatus: string) {
    return fetch(`${import.meta.env.VITE_BASE_URL}/api/orders/${orderId}/items/${itemId}`,{
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(res => {
        return {
            status: true,
            data: res,
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
