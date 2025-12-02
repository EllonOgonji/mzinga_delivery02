import { ProductFilters, Product } from "@/types";
import { mockProducts } from "./mockData";
import { supabase } from "@/integrations/supabase/client";

export const getAllProducts = async function (filters: ProductFilters = {}): Promise<Product[]> {
    let query = supabase.from('products').select('*');

    if (filters) {
        if (filters.id) {
            query = query.eq('id', filters.id);
        }
        if (filters.idMultiple && filters.idMultiple.length > 0) {
            query = query.in('id', filters.idMultiple);
        }
        if (filters.shopId) {
            query = query.eq('shopId', filters.shopId);
        }
        if (filters.shopIdMultiple && filters.shopIdMultiple.length > 0) {
            query = query.in('shopId', filters.shopIdMultiple);
        }
        if (filters.category) {
            // Handle pipe-separated categories from legacy filter
            if (filters.category.includes('|')) {
                const categories = filters.category.split('|');
                query = query.in('category', categories);
            } else {
                query = query.eq('category', filters.category);
            }
        }
        if (filters.categoryMultiple && filters.categoryMultiple.length > 0) {
            query = query.in('category', filters.categoryMultiple);
        }
        if (filters.priceRange) {
            query = query.gte('price', filters.priceRange.min).lte('price', filters.priceRange.max);
        }
        if (filters.featured !== undefined) {
            // Assuming there is a featured column
            query = query.eq('featured', filters.featured);
        }
        if (filters.searchQuery) {
            query = query.ilike('name', `%${filters.searchQuery}%`);
        }
        // Note: Complex filters like rating (array average) and shopOpen (join) 
        // might need Edge Functions or Views. For now, we fetch and potentially filter client-side 
        // if the DB doesn't support it directly, or we assume columns exist.
        // For rating, we'll skip DB filtering for now as it requires array calculation.
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching product data from Supabase:", error);
        return [];
    }

    return data as Product[];
};
