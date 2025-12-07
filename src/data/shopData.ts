import { Shop, ShopFilters } from "@/types";

export const getAllShops = async function (filters: ShopFilters = {}) {
    // let query = supabase.from('stores').select('*');

    // if (filters) {
    //     if (filters.category) {
    //         // Assuming category is an array in DB or we filter by one of them
    //         // This might need adjustment based on DB schema. 
    //         // If category is text[] in postgres:
    //         query = query.overlaps('category', filters.category);
    //     }
    //     if (filters.rating) {
    //         // query = query.gte('rating', filters.rating);
    //         // Skip for now as rating might be computed
    //     }
    //     if (filters.isOpenNow !== undefined) {
    //         if (filters.isOpenNow) {
    //             query = query.eq('status', 'open');
    //         }
    //     }
    //     // if (filters.featured !== undefined) {
    //     //     query = query.eq('featured', filters.featured);
    //     // }
    //     if (filters.searchQuery) {
    //         query = query.ilike('name', `%${filters.searchQuery}%`);
    //     }
    //     if (filters.id) {
    //         query = query.eq('id', filters.id);
    //     }
    //     if (filters.idMultiple && filters.idMultiple.length > 0) {
    //         query = query.in('id', filters.idMultiple);
    //     }
    // }

    // const { data, error } = await query;

    // if (error) {
    //     console.error("Error fetching shop data from Supabase:", error);
    //     return [];
    // }

    // return data as Shop[];

    fetch(`${import.meta.env.VITE_BASE_URL}/api/stores`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }).then(response => response.json()).then(data => {
        console.log(data);
    }).catch(error => {
        console.error('Error:', error);
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
