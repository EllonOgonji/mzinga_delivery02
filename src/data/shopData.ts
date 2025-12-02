import { Shop, ShopFilters } from "@/types";
import { mockShops } from "./mockData";
import { supabase } from "@/integrations/supabase/client";

export const getAllShops = async function (filters: ShopFilters = {}): Promise<Shop[]> {
    let query = supabase.from('stores').select('*');

    if (filters) {
        if (filters.category) {
            // Assuming category is an array in DB or we filter by one of them
            // This might need adjustment based on DB schema. 
            // If category is text[] in postgres:
            query = query.overlaps('category', filters.category);
        }
        if (filters.rating) {
            // query = query.gte('rating', filters.rating);
            // Skip for now as rating might be computed
        }
        if (filters.isOpenNow !== undefined) {
            if (filters.isOpenNow) {
                query = query.eq('status', 'open');
            }
        }
        // if (filters.featured !== undefined) {
        //     query = query.eq('featured', filters.featured);
        // }
        if (filters.searchQuery) {
            query = query.ilike('name', `%${filters.searchQuery}%`);
        }
        if (filters.id) {
            query = query.eq('id', filters.id);
        }
        if (filters.idMultiple && filters.idMultiple.length > 0) {
            query = query.in('id', filters.idMultiple);
        }
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching shop data from Supabase:", error);
        return [];
    }

    return data as Shop[];
};
